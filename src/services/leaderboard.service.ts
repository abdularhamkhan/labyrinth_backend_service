import { prisma } from "../config/prisma";
import { LeaderboardCache, CacheInvalidation } from "../redis/strategies/cachingStrategies";
import { cacheRedis } from "../redis";
import { LeaderboardQueryInput, LeaderboardType } from "../schemas/leaderboard.schema";
import {
  LeaderboardPlayer,
  LeaderboardResponse,
  UserRankResponse,
  RebuildResult,
} from "../types/leaderboard.types";

/**
 * =============================================================================
 * LEADERBOARD SERVICE - REDIS-POWERED RANKINGS
 * =============================================================================
 *
 * This service handles leaderboard operations with Redis caching for
 * optimal performance. Supports global, weekly, and daily rankings.
 *
 * Features:
 * - Redis sorted sets for fast rankings
 * - Automatic cache invalidation
 * - Fallback to database when cache is unavailable
 * - Time-based leaderboards (daily, weekly)
 *
 * =============================================================================
 */

// =============================================================================
// CACHE KEY GENERATORS
// =============================================================================

const getCacheKey = (type: LeaderboardType, suffix?: string): string => {
  const now = new Date();

  switch (type) {
    case "global":
      return `leaderboard:global${suffix ? `:${suffix}` : ""}`;

    case "weekly":
      // Get start of current week (Monday)
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() + 1);
      weekStart.setHours(0, 0, 0, 0);
      const weekKey = weekStart.toISOString().split("T")[0];
      return `leaderboard:weekly:${weekKey}${suffix ? `:${suffix}` : ""}`;

    case "daily":
      const dayKey = now.toISOString().split("T")[0];
      return `leaderboard:daily:${dayKey}${suffix ? `:${suffix}` : ""}`;

    default:
      throw new Error(`Invalid leaderboard type: ${type}`);
  }
};

// =============================================================================
// GLOBAL LEADERBOARD SERVICE
// =============================================================================

export const getGlobalLeaderboard = async (
  query: LeaderboardQueryInput
): Promise<LeaderboardResponse> => {
  console.log("🏆 Fetching global leaderboard:", query);

  try {
    const cacheKey = getCacheKey("global");

    // Try to get from Redis cache first
    const cachedData = await getCachedLeaderboard(cacheKey, query);
    if (cachedData) {
      console.log("✅ Global leaderboard retrieved from cache");
      return {
        ...cachedData,
        fromCache: true,
      };
    }

    // Cache miss - get from database
    console.log("💾 Cache miss - fetching global leaderboard from database");

    const [players, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: {
          status: "ACTIVE",
          gamesPlayed: { gt: 0 }, // Only users who have played games
        },
        select: {
          id: true,
          username: true,
          avatar: true,
          totalScore: true,
          gamesPlayed: true,
          gamesWon: true,
          winRate: true,
        },
        orderBy: {
          totalScore: "desc",
        },
        skip: query.offset,
        take: query.limit,
      }),
      prisma.user.count({
        where: {
          status: "ACTIVE",
          gamesPlayed: { gt: 0 },
        },
      }),
    ]);

    const formattedPlayers: LeaderboardPlayer[] = players.map((player, index) => ({
      rank: query.offset + index + 1,
      userId: player.id,
      username: player.username,
      score: player.totalScore,
      gamesPlayed: player.gamesPlayed,
      gamesWon: player.gamesWon,
      winRate: player.winRate,
      avatar: player.avatar || undefined,
    }));

    // Cache the result
    await cacheLeaderboard(cacheKey, formattedPlayers, totalCount);

    console.log(`✅ Global leaderboard fetched: ${formattedPlayers.length} players`);

    return {
      players: formattedPlayers,
      totalPlayers: totalCount,
      fromCache: false,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Error fetching global leaderboard:", error);
    throw error;
  }
};

// =============================================================================
// WEEKLY LEADERBOARD SERVICE
// =============================================================================

export const getWeeklyLeaderboard = async (
  query: LeaderboardQueryInput
): Promise<LeaderboardResponse> => {
  console.log("📅 Fetching weekly leaderboard:", query);

  try {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const cacheKey = getCacheKey("weekly");

    // Try cache first
    const cachedData = await getCachedLeaderboard(cacheKey, query);
    if (cachedData) {
      console.log("✅ Weekly leaderboard retrieved from cache");
      return {
        ...cachedData,
        fromCache: true,
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
      };
    }

    // Get weekly scores from completed game sessions
    const weeklyGameData = await prisma.gameSession.findMany({
      where: {
        status: "COMPLETED",
        endedAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            scores: true,
          },
        },
      },
    });

    // Aggregate weekly scores by user
    const userWeeklyScores = new Map<
      string,
      {
        userId: string;
        username: string;
        avatar?: string;
        totalScore: number;
        gamesPlayed: number;
        gamesWon: number;
      }
    >();

    weeklyGameData.forEach((game) => {
      game.participants.forEach((participant) => {
        const userId = participant.userId;
        const totalGameScore = participant.scores.reduce((sum, score) => sum + score.totalScore, 0);
        const isWinner = participant.finalRank === 1;

        if (userWeeklyScores.has(userId)) {
          const existing = userWeeklyScores.get(userId)!;
          existing.totalScore += totalGameScore;
          existing.gamesPlayed += 1;
          existing.gamesWon += isWinner ? 1 : 0;
        } else {
          userWeeklyScores.set(userId, {
            userId,
            username: participant.user.username,
            avatar: participant.user.avatar || undefined,
            totalScore: totalGameScore,
            gamesPlayed: 1,
            gamesWon: isWinner ? 1 : 0,
          });
        }
      });
    });

    // Convert to array and sort by score
    const sortedPlayers = Array.from(userWeeklyScores.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(query.offset, query.offset + query.limit);

    const formattedPlayers: LeaderboardPlayer[] = sortedPlayers.map((player, index) => ({
      rank: query.offset + index + 1,
      userId: player.userId,
      username: player.username,
      score: player.totalScore,
      gamesPlayed: player.gamesPlayed,
      gamesWon: player.gamesWon,
      winRate: player.gamesPlayed > 0 ? player.gamesWon / player.gamesPlayed : 0,
      avatar: player.avatar,
    }));

    // Cache the result
    await cacheLeaderboard(cacheKey, formattedPlayers, userWeeklyScores.size);

    console.log(`✅ Weekly leaderboard fetched: ${formattedPlayers.length} players`);

    return {
      players: formattedPlayers,
      totalPlayers: userWeeklyScores.size,
      fromCache: false,
      lastUpdated: new Date().toISOString(),
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
    };
  } catch (error) {
    console.error("❌ Error fetching weekly leaderboard:", error);
    throw error;
  }
};

// =============================================================================
// DAILY LEADERBOARD SERVICE
// =============================================================================

export const getDailyLeaderboard = async (
  query: LeaderboardQueryInput
): Promise<LeaderboardResponse> => {
  console.log("📆 Fetching daily leaderboard:", query);

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const cacheKey = getCacheKey("daily");

    // Try cache first
    const cachedData = await getCachedLeaderboard(cacheKey, query);
    if (cachedData) {
      console.log("✅ Daily leaderboard retrieved from cache");
      return {
        ...cachedData,
        fromCache: true,
        date: today.toISOString().split("T")[0],
      };
    }

    // Get daily scores from completed game sessions
    const dailyGameData = await prisma.gameSession.findMany({
      where: {
        status: "COMPLETED",
        endedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            scores: true,
          },
        },
      },
    });

    // Aggregate daily scores by user (similar to weekly logic)
    const userDailyScores = new Map<
      string,
      {
        userId: string;
        username: string;
        avatar?: string;
        totalScore: number;
        gamesPlayed: number;
        gamesWon: number;
      }
    >();

    dailyGameData.forEach((game) => {
      game.participants.forEach((participant) => {
        const userId = participant.userId;
        const totalGameScore = participant.scores.reduce((sum, score) => sum + score.totalScore, 0);
        const isWinner = participant.finalRank === 1;

        if (userDailyScores.has(userId)) {
          const existing = userDailyScores.get(userId)!;
          existing.totalScore += totalGameScore;
          existing.gamesPlayed += 1;
          existing.gamesWon += isWinner ? 1 : 0;
        } else {
          userDailyScores.set(userId, {
            userId,
            username: participant.user.username,
            avatar: participant.user.avatar || undefined,
            totalScore: totalGameScore,
            gamesPlayed: 1,
            gamesWon: isWinner ? 1 : 0,
          });
        }
      });
    });

    // Convert to array and sort by score
    const sortedPlayers = Array.from(userDailyScores.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(query.offset, query.offset + query.limit);

    const formattedPlayers: LeaderboardPlayer[] = sortedPlayers.map((player, index) => ({
      rank: query.offset + index + 1,
      userId: player.userId,
      username: player.username,
      score: player.totalScore,
      gamesPlayed: player.gamesPlayed,
      gamesWon: player.gamesWon,
      winRate: player.gamesPlayed > 0 ? player.gamesWon / player.gamesPlayed : 0,
      avatar: player.avatar,
    }));

    // Cache the result
    await cacheLeaderboard(cacheKey, formattedPlayers, userDailyScores.size);

    console.log(`✅ Daily leaderboard fetched: ${formattedPlayers.length} players`);

    return {
      players: formattedPlayers,
      totalPlayers: userDailyScores.size,
      fromCache: false,
      lastUpdated: new Date().toISOString(),
      date: today.toISOString().split("T")[0],
    };
  } catch (error) {
    console.error("❌ Error fetching daily leaderboard:", error);
    throw error;
  }
};

// =============================================================================
// USER RANK SERVICE
// =============================================================================

export const getUserRank = async (
  userId: string,
  type: LeaderboardType
): Promise<UserRankResponse> => {
  console.log(`🎯 Getting user rank: ${userId} (${type})`);

  try {
    const cacheKey = getCacheKey(type);

    // Try to get rank from Redis
    const rank = await LeaderboardCache.getUserRank(type, userId);

    // Get user's current score based on leaderboard type
    let userScore = 0;
    let totalPlayers = 0;

    if (type === "global") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          totalScore: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      userScore = user.totalScore;
      totalPlayers = await prisma.user.count({
        where: {
          status: "ACTIVE",
          gamesPlayed: { gt: 0 },
        },
      });
    } else {
      // For weekly/daily, calculate from Redis cache or fallback
      const cacheScore = await cacheRedis.zscore(cacheKey, userId);
      userScore = cacheScore ? parseInt(cacheScore.toString()) : 0;
      totalPlayers = await cacheRedis.zcard(cacheKey);
    }

    const percentile =
      rank && totalPlayers > 0
        ? Math.round(((totalPlayers - rank) / totalPlayers) * 100)
        : undefined;

    console.log(`✅ User rank retrieved: ${rank} (${userId})`);

    return {
      rank,
      score: userScore,
      totalPlayers,
      percentile,
    };
  } catch (error) {
    console.error("❌ Error getting user rank:", error);
    throw error;
  }
};

// =============================================================================
// REBUILD LEADERBOARD SERVICE
// =============================================================================

export const rebuildLeaderboard = async (type: LeaderboardType): Promise<RebuildResult> => {
  console.log(`🔄 Rebuilding ${type} leaderboard`);

  const startTime = Date.now();

  try {
    // Clear existing cache
    const cacheKey = getCacheKey(type);
    await cacheRedis.del(cacheKey);

    // Rebuild based on type
    let playersProcessed = 0;

    switch (type) {
      case "global":
        await LeaderboardCache.rebuildLeaderboard("global");
        playersProcessed = await prisma.user.count({
          where: {
            status: "ACTIVE",
            gamesPlayed: { gt: 0 },
          },
        });
        break;

      case "weekly":
        // Rebuild weekly leaderboard from game sessions
        const weeklyData = await getWeeklyLeaderboard({ limit: 1000, offset: 0 });
        playersProcessed = weeklyData.totalPlayers;
        break;

      case "daily":
        // Rebuild daily leaderboard from game sessions
        const dailyData = await getDailyLeaderboard({ limit: 1000, offset: 0 });
        playersProcessed = dailyData.totalPlayers;
        break;
    }

    const rebuildTime = Date.now() - startTime;

    console.log(`✅ ${type} leaderboard rebuilt: ${playersProcessed} players in ${rebuildTime}ms`);

    return {
      success: true,
      playersProcessed,
      rebuildTime,
      type,
    };
  } catch (error) {
    console.error(`❌ Error rebuilding ${type} leaderboard:`, error);
    throw error;
  }
};

// =============================================================================
// UPDATE USER SCORE SERVICE
// =============================================================================

export const updateUserScore = async (
  userId: string,
  scoreIncrement: number,
  gamesWon: number = 0,
  gamesPlayed: number = 1
): Promise<void> => {
  console.log(`📈 Updating user score: ${userId} (+${scoreIncrement})`);

  try {
    // Update user stats in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        totalScore: { increment: scoreIncrement },
        gamesPlayed: { increment: gamesPlayed },
        gamesWon: { increment: gamesWon },
        winRate: {
          // Calculate new win rate - we need to get current values first
          set: undefined, // Will calculate after getting current values
        },
        lastActive: new Date(),
      },
      select: {
        totalScore: true,
        gamesPlayed: true,
        gamesWon: true,
      },
    });

    // Update win rate separately
    const newWinRate =
      updatedUser.gamesPlayed > 0 ? updatedUser.gamesWon / updatedUser.gamesPlayed : 0;
    await prisma.user.update({
      where: { id: userId },
      data: { winRate: newWinRate },
    });

    // Update leaderboard caches
    await Promise.all([
      LeaderboardCache.updateLeaderboard("global", userId, updatedUser.totalScore),
      // Weekly and daily leaderboards are updated when games are completed
    ]);

    // Invalidate user caches
    await CacheInvalidation.invalidateUserCaches(userId);

    console.log(`✅ User score updated: ${userId} = ${updatedUser.totalScore}`);
  } catch (error) {
    console.error("❌ Error updating user score:", error);
    throw error;
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getCachedLeaderboard = async (
  cacheKey: string,
  query: LeaderboardQueryInput
): Promise<Omit<LeaderboardResponse, "fromCache"> | null> => {
  try {
    // Try to get paginated data from cache
    const cachedPlayers = await cacheRedis.zrevrange(
      cacheKey,
      query.offset,
      query.offset + query.limit - 1,
      "WITHSCORES"
    );

    if (cachedPlayers.length === 0) {
      return null;
    }

    // Get total count
    const totalPlayers = await cacheRedis.zcard(cacheKey);

    // Format players data
    const players: LeaderboardPlayer[] = [];
    for (let i = 0; i < cachedPlayers.length; i += 2) {
      const userId = cachedPlayers[i];
      const score = parseInt(cachedPlayers[i + 1]);

      // Get user details from database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          username: true,
          avatar: true,
          gamesPlayed: true,
          gamesWon: true,
          winRate: true,
        },
      });

      if (user) {
        players.push({
          rank: query.offset + Math.floor(i / 2) + 1,
          userId,
          username: user.username,
          score,
          gamesPlayed: user.gamesPlayed,
          gamesWon: user.gamesWon,
          winRate: user.winRate,
          avatar: user.avatar || undefined,
        });
      }
    }

    return {
      players,
      totalPlayers,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Error getting cached leaderboard:", error);
    return null;
  }
};

const cacheLeaderboard = async (
  cacheKey: string,
  players: LeaderboardPlayer[],
  totalCount: number
): Promise<void> => {
  try {
    // Clear existing cache
    await cacheRedis.del(cacheKey);

    // Add all players to sorted set
    if (players.length > 0) {
      const pipeline = cacheRedis.pipeline();

      players.forEach((player) => {
        pipeline.zadd(cacheKey, player.score, player.userId);
      });

      // Set expiration (5 minutes for leaderboards)
      pipeline.expire(cacheKey, 300);

      await pipeline.exec();
    }

    console.log(`💾 Cached leaderboard: ${cacheKey} (${players.length} players)`);
  } catch (error) {
    console.error("❌ Error caching leaderboard:", error);
    // Don't throw error - caching failure shouldn't break the request
  }
};
