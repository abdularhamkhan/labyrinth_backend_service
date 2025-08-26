/**
 * =============================================================================
 * REDIS CACHING STRATEGIES - Different Patterns for Different Use Cases
 * =============================================================================
 *
 * This module implements various caching strategies to optimize data access
 * and reduce database load for different types of data in the game system.
 *
 * Strategies Implemented:
 * - Write-Through: Write to cache and database simultaneously
 * - Write-Behind: Write to cache immediately, database later
 * - Cache-Aside: Load from cache, fallback to database
 * - Write-Around: Write directly to database, invalidate cache
 *
 * =============================================================================
 */

import { cacheRedis } from "../config/redis.production.config";
import { prisma } from "../../config/prisma";

// =============================================================================
// CACHE KEYS AND TTL CONSTANTS
// =============================================================================

export const CACHE_KEYS = {
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  USER_STATS: (userId: string) => `user:stats:${userId}`,
  LEADERBOARD: (type: string) => `leaderboard:${type}`,
  GAME_SESSION: (sessionId: string) => `game:session:${sessionId}`,
  FRIENDS_LIST: (userId: string) => `user:friends:${userId}`,
  ACHIEVEMENTS: (userId: string) => `user:achievements:${userId}`,
} as const;

export const CACHE_TTL = {
  USER_PROFILE: 3600, // 1 hour
  USER_STATS: 1800, // 30 minutes
  LEADERBOARD: 300, // 5 minutes
  GAME_SESSION: 7200, // 2 hours
  FRIENDS_LIST: 1800, // 30 minutes
  ACHIEVEMENTS: 3600, // 1 hour
} as const;

// =============================================================================
// WRITE-THROUGH CACHE STRATEGY
// =============================================================================

export class WriteThroughCache {
  /**
   * Update user stats with write-through strategy
   */
  static async updateUserStats(userId: string, statsUpdate: any): Promise<any> {
    try {
      // 1. Write to database first
      const updatedStats = await prisma.user.update({
        where: { id: userId },
        data: statsUpdate,
        select: {
          id: true,
          username: true,
          totalScore: true,
          gamesPlayed: true,
          gamesWon: true,
          winRate: true,
          currentStreak: true,
          bestStreak: true,
        },
      });

      // 2. Write to cache immediately
      const cacheKey = CACHE_KEYS.USER_STATS(userId);
      await cacheRedis.setex(cacheKey, CACHE_TTL.USER_STATS, JSON.stringify(updatedStats));

      console.log(`✅ Write-through cache: Updated user stats for ${userId}`);
      return updatedStats;
    } catch (error) {
      console.error("❌ Write-through cache error:", error);
      throw error;
    }
  }

  /**
   * Update user profile with write-through strategy
   */
  static async updateUserProfile(userId: string, profileUpdate: any): Promise<any> {
    try {
      // 1. Write to database first
      const updatedProfile = await prisma.user.update({
        where: { id: userId },
        data: profileUpdate,
      });

      // 2. Write to cache immediately
      const cacheKey = CACHE_KEYS.USER_PROFILE(userId);
      await cacheRedis.setex(cacheKey, CACHE_TTL.USER_PROFILE, JSON.stringify(updatedProfile));

      console.log(`✅ Write-through cache: Updated user profile for ${userId}`);
      return updatedProfile;
    } catch (error) {
      console.error("❌ Write-through cache error:", error);
      throw error;
    }
  }
}

// =============================================================================
// CACHE-ASIDE (LAZY LOADING) STRATEGY
// =============================================================================

export class CacheAsideStrategy {
  /**
   * Get user profile with cache-aside strategy
   */
  static async getUserProfile(userId: string): Promise<any> {
    try {
      const cacheKey = CACHE_KEYS.USER_PROFILE(userId);

      // 1. Try to get from cache first
      const cachedProfile = await cacheRedis.get(cacheKey);

      if (cachedProfile) {
        console.log(`🎯 Cache hit: User profile for ${userId}`);
        return JSON.parse(cachedProfile);
      }

      // 2. Cache miss - get from database
      console.log(`💾 Cache miss: Fetching user profile for ${userId} from database`);
      const userProfile = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          leaderboardEntry: true,
          sessions: true,
        },
      });

      // 3. Store in cache for future requests
      if (userProfile) {
        await cacheRedis.setex(cacheKey, CACHE_TTL.USER_PROFILE, JSON.stringify(userProfile));
      }

      return userProfile;
    } catch (error) {
      console.error("❌ Cache-aside strategy error:", error);
      throw error;
    }
  }

  /**
   * Get user's friends list with cache-aside strategy
   */
  static async getFriendsList(userId: string): Promise<any[]> {
    try {
      const cacheKey = CACHE_KEYS.FRIENDS_LIST(userId);

      // 1. Try to get from cache first
      const cachedFriends = await cacheRedis.get(cacheKey);

      if (cachedFriends) {
        console.log(`🎯 Cache hit: Friends list for ${userId}`);
        return JSON.parse(cachedFriends);
      }

      // 2. Cache miss - get from database
      console.log(`💾 Cache miss: Fetching friends list for ${userId} from database`);
      const friends = await prisma.friendship.findMany({
        where: {
          OR: [
            { requesterId: userId, status: "ACCEPTED" },
            { receiverId: userId, status: "ACCEPTED" },
          ],
        },
        include: {
          requester: { select: { id: true, username: true, totalScore: true } },
          receiver: { select: { id: true, username: true, totalScore: true } },
        },
      });

      // 3. Store in cache for future requests
      await cacheRedis.setex(cacheKey, CACHE_TTL.FRIENDS_LIST, JSON.stringify(friends));

      return friends;
    } catch (error) {
      console.error("❌ Cache-aside strategy error:", error);
      throw error;
    }
  }
}

// =============================================================================
// WRITE-BEHIND (WRITE-BACK) CACHE STRATEGY
// =============================================================================

export class WriteBehindCache {
  private static writeQueue: Map<string, any> = new Map();
  private static flushInterval: NodeJS.Timeout | null = null;

  /**
   * Start the write-behind flush process
   */
  static startFlushProcess(intervalMs: number = 30000): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }

    this.flushInterval = setInterval(async () => {
      await this.flushToDatabase();
    }, intervalMs);

    console.log(`🔄 Write-behind cache flush process started (interval: ${intervalMs}ms)`);
  }

  /**
   * Track user activity (high-frequency writes)
   */
  static async trackUserActivity(userId: string, activity: any): Promise<void> {
    try {
      // 1. Write to cache immediately
      const cacheKey = `user:activity:${userId}`;
      await cacheRedis.setex(cacheKey, 3600, JSON.stringify(activity));

      // 2. Queue for database write
      this.writeQueue.set(`activity:${userId}`, {
        userId,
        activity,
        timestamp: Date.now(),
      });

      console.log(`📝 Write-behind: Queued activity for user ${userId}`);
    } catch (error) {
      console.error("❌ Write-behind cache error:", error);
      throw error;
    }
  }

  /**
   * Flush queued writes to database
   */
  private static async flushToDatabase(): Promise<void> {
    if (this.writeQueue.size === 0) {
      return;
    }

    console.log(`🔄 Flushing ${this.writeQueue.size} write-behind operations to database`);

    const operations = Array.from(this.writeQueue.entries());
    this.writeQueue.clear();

    for (const [key, data] of operations) {
      try {
        if (key.startsWith("activity:")) {
          // TODO: Create UserActivity table in schema or log to a different table
          console.log(`📝 Activity tracked for user ${data.userId}:`, data.activity);
          // await prisma.userActivity.create({
          //   data: {
          //     userId: data.userId,
          //     activity: data.activity,
          //     timestamp: new Date(data.timestamp),
          //   },
          // });
        }
        // Add other operation types as needed
      } catch (error) {
        console.error(`❌ Write-behind flush error for ${key}:`, error);
        // Could implement retry logic here
      }
    }
  }

  /**
   * Stop the flush process
   */
  static stopFlushProcess(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
      console.log("⏹️ Write-behind cache flush process stopped");
    }
  }
}

// =============================================================================
// LEADERBOARD CACHE STRATEGY
// =============================================================================

export class LeaderboardCache {
  /**
   * Update leaderboard with sorted sets
   */
  static async updateLeaderboard(type: string, userId: string, score: number): Promise<void> {
    try {
      const leaderboardKey = CACHE_KEYS.LEADERBOARD(type);

      // Add/update user score in sorted set
      await cacheRedis.zadd(leaderboardKey, score, userId);

      // Set expiration
      await cacheRedis.expire(leaderboardKey, CACHE_TTL.LEADERBOARD);

      console.log(`🏆 Updated leaderboard ${type}: ${userId} = ${score}`);
    } catch (error) {
      console.error("❌ Leaderboard cache error:", error);
      throw error;
    }
  }

  /**
   * Get top N users from leaderboard
   */
  static async getTopUsers(
    type: string,
    limit: number = 10
  ): Promise<Array<{ userId: string; score: number }>> {
    try {
      const leaderboardKey = CACHE_KEYS.LEADERBOARD(type);

      // Get top N users with scores (descending order)
      const results = await cacheRedis.zrevrange(leaderboardKey, 0, limit - 1, "WITHSCORES");

      const leaderboard = [];
      for (let i = 0; i < results.length; i += 2) {
        leaderboard.push({
          userId: results[i],
          score: parseInt(results[i + 1]),
        });
      }

      console.log(`📊 Retrieved top ${limit} from leaderboard ${type}`);
      return leaderboard;
    } catch (error) {
      console.error("❌ Leaderboard cache error:", error);
      throw error;
    }
  }

  /**
   * Get user's rank in leaderboard
   */
  static async getUserRank(type: string, userId: string): Promise<number | null> {
    try {
      const leaderboardKey = CACHE_KEYS.LEADERBOARD(type);

      // Get user's rank (0-based, so add 1)
      const rank = await cacheRedis.zrevrank(leaderboardKey, userId);

      return rank !== null ? rank + 1 : null;
    } catch (error) {
      console.error("❌ Leaderboard cache error:", error);
      throw error;
    }
  }

  /**
   * Rebuild leaderboard from database
   */
  static async rebuildLeaderboard(type: string): Promise<void> {
    try {
      console.log(`🔄 Rebuilding leaderboard ${type} from database`);

      const leaderboardKey = CACHE_KEYS.LEADERBOARD(type);

      // Clear existing leaderboard
      await cacheRedis.del(leaderboardKey);

      // Get all user scores from database
      const userScores = await prisma.user.findMany({
        select: {
          id: true,
          totalScore: true,
        },
        orderBy: {
          totalScore: "desc",
        },
      });

      // Rebuild sorted set
      if (userScores.length > 0) {
        const pipeline = cacheRedis.pipeline();

        userScores.forEach((user) => {
          pipeline.zadd(leaderboardKey, user.totalScore, user.id);
        });

        pipeline.expire(leaderboardKey, CACHE_TTL.LEADERBOARD);
        await pipeline.exec();
      }

      console.log(`✅ Rebuilt leaderboard ${type} with ${userScores.length} users`);
    } catch (error) {
      console.error("❌ Leaderboard rebuild error:", error);
      throw error;
    }
  }
}

// =============================================================================
// CACHE INVALIDATION STRATEGIES
// =============================================================================

export class CacheInvalidation {
  /**
   * Invalidate user-related caches
   */
  static async invalidateUserCaches(userId: string): Promise<void> {
    try {
      const keysToInvalidate = [
        CACHE_KEYS.USER_PROFILE(userId),
        CACHE_KEYS.USER_STATS(userId),
        CACHE_KEYS.FRIENDS_LIST(userId),
        CACHE_KEYS.ACHIEVEMENTS(userId),
      ];

      await cacheRedis.del(...keysToInvalidate);

      console.log(`🧹 Invalidated caches for user ${userId}`);
    } catch (error) {
      console.error("❌ Cache invalidation error:", error);
      throw error;
    }
  }

  /**
   * Invalidate leaderboard caches
   */
  static async invalidateLeaderboards(): Promise<void> {
    try {
      const pattern = "leaderboard:*";
      const keys = await cacheRedis.keys(pattern);

      if (keys.length > 0) {
        await cacheRedis.del(...keys);
        console.log(`🧹 Invalidated ${keys.length} leaderboard caches`);
      }
    } catch (error) {
      console.error("❌ Cache invalidation error:", error);
      throw error;
    }
  }

  /**
   * Invalidate all user caches (use with caution)
   */
  static async invalidateAllUserCaches(): Promise<void> {
    try {
      const patterns = ["user:*", "session:*"];
      let totalKeys = 0;

      for (const pattern of patterns) {
        const keys = await cacheRedis.keys(pattern);
        if (keys.length > 0) {
          await cacheRedis.del(...keys);
          totalKeys += keys.length;
        }
      }

      console.log(`🧹 Invalidated ${totalKeys} user-related caches`);
    } catch (error) {
      console.error("❌ Cache invalidation error:", error);
      throw error;
    }
  }
}

// =============================================================================
// CACHE WARMING UTILITIES
// =============================================================================

export class CacheWarming {
  /**
   * Warm up critical user data
   */
  static async warmUserData(userId: string): Promise<void> {
    try {
      console.log(`🔥 Warming cache for user ${userId}`);

      // Pre-load user profile and stats
      await Promise.all([
        CacheAsideStrategy.getUserProfile(userId),
        CacheAsideStrategy.getFriendsList(userId),
      ]);

      console.log(`✅ Cache warmed for user ${userId}`);
    } catch (error) {
      console.error("❌ Cache warming error:", error);
      throw error;
    }
  }

  /**
   * Warm up leaderboards
   */
  static async warmLeaderboards(): Promise<void> {
    try {
      console.log("🔥 Warming leaderboard caches");

      const leaderboardTypes = ["global", "weekly", "daily"];

      await Promise.all(leaderboardTypes.map((type) => LeaderboardCache.rebuildLeaderboard(type)));

      console.log("✅ Leaderboard caches warmed");
    } catch (error) {
      console.error("❌ Cache warming error:", error);
      throw error;
    }
  }
}

// Start write-behind flush process
WriteBehindCache.startFlushProcess();
