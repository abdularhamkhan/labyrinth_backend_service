import { Redis } from "ioredis";
import { prisma } from "../config/prisma";
import { redis } from "../config/redis";
import { NotFoundError, ValidationError, DatabaseError, USER_ERRORS } from "../constants/error";

/**
 * =============================================================================
 * PRESENCE SERVICE - REDIS-BASED USER ONLINE/OFFLINE TRACKING
 * =============================================================================
 *
 * Enterprise-grade presence tracking system with:
 * - Redis-based real-time presence management
 * - TTL-based automatic cleanup
 * - Heartbeat mechanism for accurate status
 * - Performance-optimized batch operations
 * - Comprehensive error handling and monitoring
 *
 * Architecture:
 * - Redis Keys: "presence:online", "presence:user:{userId}"
 * - TTL: 5 minutes (auto-cleanup offline users)
 * - Heartbeat: Every 2 minutes from client
 * - Fallback: Database sessions for reliability
 *
 * =============================================================================
 */

// Constants for presence management
const PRESENCE_KEYS = {
  ONLINE_SET: "presence:online",
  USER_PREFIX: "presence:user:",
  HEARTBEAT_PREFIX: "heartbeat:",
} as const;

const PRESENCE_CONFIG = {
  ONLINE_TTL: 300, // 5 minutes
  HEARTBEAT_TTL: 120, // 2 minutes
  BATCH_SIZE: 100,
  MAX_RETRIES: 3,
} as const;

export interface UserPresence {
  userId: string;
  isOnline: boolean;
  lastSeen: Date;
  deviceInfo?: any;
  connectionCount?: number;
}

export interface OnlineUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gitHubProfile?: string;
  education?: string;
  lastActive: Date;
  isOnline?: boolean;
}

export interface PresenceStats {
  totalOnline: number;
  totalRegistered: number;
  onlinePercentage: number;
  lastUpdated: Date;
}

/**
 * =============================================================================
 * CORE PRESENCE TRACKING FUNCTIONS
 * =============================================================================
 */

/**
 * Mark user as online and update presence data
 */
export const markUserOnline = async (userId: string, deviceInfo?: any): Promise<void> => {
  console.log("=== MARK USER ONLINE START ===");
  console.log("Input:", { userId, hasDeviceInfo: !!deviceInfo });

  try {
    const pipeline = redis.pipeline();
    const timestamp = Date.now();

    // Add to online users set with TTL
    pipeline.zadd(PRESENCE_KEYS.ONLINE_SET, timestamp, userId);
    pipeline.expire(PRESENCE_KEYS.ONLINE_SET, PRESENCE_CONFIG.ONLINE_TTL);

    // Set individual user presence with detailed info
    const presenceData = JSON.stringify({
      userId,
      isOnline: true,
      lastSeen: new Date().toISOString(),
      deviceInfo: deviceInfo || null,
      timestamp,
    });

    pipeline.setex(
      `${PRESENCE_KEYS.USER_PREFIX}${userId}`,
      PRESENCE_CONFIG.ONLINE_TTL,
      presenceData
    );

    // Set heartbeat key
    pipeline.setex(
      `${PRESENCE_KEYS.HEARTBEAT_PREFIX}${userId}`,
      PRESENCE_CONFIG.HEARTBEAT_TTL,
      timestamp.toString()
    );

    await pipeline.exec();

    // Update database lastActive (async, non-blocking)
    prisma.user
      .update({
        where: { id: userId },
        data: { lastActive: new Date() },
      })
      .catch((error) => {
        console.error("Failed to update lastActive in database:", error);
      });

    console.log("User marked online successfully");
  } catch (error) {
    console.error("Mark user online failed:", error);
    throw new DatabaseError("Failed to update user presence");
  }
};

/**
 * Mark user as offline and cleanup presence data
 */
export const markUserOffline = async (userId: string): Promise<void> => {
  console.log("=== MARK USER OFFLINE START ===");
  console.log("Input:", { userId });

  try {
    const pipeline = redis.pipeline();

    // Remove from online users set
    pipeline.zrem(PRESENCE_KEYS.ONLINE_SET, userId);

    // Remove individual presence data
    pipeline.del(`${PRESENCE_KEYS.USER_PREFIX}${userId}`);
    pipeline.del(`${PRESENCE_KEYS.HEARTBEAT_PREFIX}${userId}`);

    await pipeline.exec();

    // Update database lastActive (async, non-blocking)
    prisma.user
      .update({
        where: { id: userId },
        data: { lastActive: new Date() },
      })
      .catch((error) => {
        console.error("Failed to update lastActive in database:", error);
      });

    console.log("User marked offline successfully");
  } catch (error) {
    console.error("Mark user offline failed:", error);
    throw new DatabaseError("Failed to update user presence");
  }
};

/**
 * Update heartbeat for online user
 */
export const updateHeartbeat = async (userId: string, deviceInfo?: any): Promise<void> => {
  try {
    const timestamp = Date.now();
    const pipeline = redis.pipeline();

    // Update heartbeat
    pipeline.setex(
      `${PRESENCE_KEYS.HEARTBEAT_PREFIX}${userId}`,
      PRESENCE_CONFIG.HEARTBEAT_TTL,
      timestamp.toString()
    );

    // Update timestamp in online set
    pipeline.zadd(PRESENCE_KEYS.ONLINE_SET, timestamp, userId);

    // Update or create user presence data
    const presenceData = JSON.stringify({
      userId,
      isOnline: true,
      lastSeen: new Date().toISOString(),
      deviceInfo: deviceInfo || null,
      timestamp,
    });

    pipeline.setex(
      `${PRESENCE_KEYS.USER_PREFIX}${userId}`,
      PRESENCE_CONFIG.ONLINE_TTL,
      presenceData
    );

    await pipeline.exec();
  } catch (error) {
    console.error("Update heartbeat failed:", error);
    // Don't throw - heartbeat failures should be graceful
  }
};

/**
 * =============================================================================
 * QUERY FUNCTIONS
 * =============================================================================
 */

/**
 * Get all online users with full profile data (paginated)
 */
export const getOnlineUsers = async (
  page: number = 1,
  limit: number = 50,
  includeStats: boolean = true
): Promise<{
  users: OnlineUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  console.log("=== GET ONLINE USERS START ===");
  console.log("Input:", { page, limit, includeStats });

  try {
    // Step 1: Get online user IDs from Redis (with pagination)
    const offset = (page - 1) * limit;
    const onlineUserIds = await redis.zrevrange(
      PRESENCE_KEYS.ONLINE_SET,
      offset,
      offset + limit - 1
    );

    const totalOnline = await redis.zcard(PRESENCE_KEYS.ONLINE_SET);

    console.log("Redis query results:", {
      onlineUserIds: onlineUserIds.length,
      totalOnline,
    });

    if (onlineUserIds.length === 0) {
      return {
        users: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }

    // Step 2: Get user profile data from database
    const users = await prisma.user.findMany({
      where: {
        id: { in: onlineUserIds },
        deletedAt: null, // Only active users
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        lastActive: true,
        email: true,
        gitHubProfile: true,
        education: true,
        createdAt: true,
      },
      orderBy: { lastActive: "desc" },
    });

    console.log("Database query results:", { usersFound: users.length });

    // Step 3: Format response data
    const formattedUsers: OnlineUser[] = users.map((user) => ({
      id: user.id,
      username: user.username,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      lastActive: user.lastActive || new Date(),
      email: user.email,
      gitHubProfile: user.gitHubProfile || undefined,
      education: user.education || undefined,
      isOnline: true,
    }));

    return {
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total: totalOnline,
        totalPages: Math.ceil(totalOnline / limit),
      },
    };
  } catch (error) {
    console.error("Get online users failed:", error);
    throw new DatabaseError("Failed to retrieve online users");
  }
};

/**
 * Get offline users (recently active) with pagination
 */
export const getOfflineUsers = async (
  page: number = 1,
  limit: number = 50,
  hoursBack: number = 24
): Promise<{
  users: OnlineUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  console.log("=== GET OFFLINE USERS START ===");
  console.log("Input:", { page, limit, hoursBack });

  try {
    // Step 1: Get online user IDs to exclude
    const onlineUserIds = await redis.zrange(PRESENCE_KEYS.ONLINE_SET, 0, -1);

    // Step 2: Query database for offline users
    const recentlyActiveThreshold = new Date();
    recentlyActiveThreshold.setHours(recentlyActiveThreshold.getHours() - hoursBack);

    const whereClause: any = {
      deletedAt: null, // Only active users
      OR: [
        {
          lastActive: {
            gte: recentlyActiveThreshold,
          },
        },
        {
          lastActive: null, // Include users who have never been active
        },
      ],
    };

    // Exclude online users if any exist
    if (onlineUserIds.length > 0) {
      whereClause.id = {
        notIn: onlineUserIds,
      };
    }

    // Get total count
    const totalOffline = await prisma.user.count({
      where: whereClause,
    });

    // Get paginated results
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        gitHubProfile: true,
        education: true,
        lastActive: true,
      },
      orderBy: { lastActive: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    console.log("Offline users query results:", {
      totalOffline,
      usersReturned: users.length,
      excludedOnlineUsers: onlineUserIds.length,
    });

    const formattedUsers: OnlineUser[] = users.map((user) => ({
      id: user.id,
      username: user.username,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      gitHubProfile: user.gitHubProfile || undefined,
      education: user.education || undefined,
      lastActive: user.lastActive || new Date(),
      isOnline: false,
    }));

    return {
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total: totalOffline,
        totalPages: Math.ceil(totalOffline / limit),
      },
    };
  } catch (error) {
    console.error("Get offline users failed:", error);
    throw new DatabaseError("Failed to retrieve offline users");
  }
};

/**
 * Get user presence status
 */
export const getUserPresence = async (userId: string): Promise<UserPresence | null> => {
  try {
    // First try to get presence data from USER_PREFIX key
    const presenceData = await redis.get(`${PRESENCE_KEYS.USER_PREFIX}${userId}`);

    if (presenceData) {
      const parsed = JSON.parse(presenceData);
      return {
        userId: parsed.userId,
        isOnline: true,
        lastSeen: new Date(parsed.lastSeen),
        deviceInfo: parsed.deviceInfo,
      };
    }

    // Fallback: Check if user is in online set (in case presence data is missing)
    const isInOnlineSet = await redis.zscore(PRESENCE_KEYS.ONLINE_SET, userId);

    if (isInOnlineSet !== null) {
      // User is online but missing presence data, return basic online presence
      return {
        userId,
        isOnline: true,
        lastSeen: new Date(parseInt(isInOnlineSet.toString())),
      };
    }

    // User is not online, return null
    return null;
  } catch (error) {
    console.error("Get user presence failed:", error);
    return null;
  }
};

/**
 * Get presence statistics
 */
export const getPresenceStats = async (): Promise<PresenceStats> => {
  try {
    const [totalOnline, totalRegistered] = await Promise.all([
      redis.zcard(PRESENCE_KEYS.ONLINE_SET),
      prisma.user.count({ where: { deletedAt: null } }),
    ]);

    const onlinePercentage =
      totalRegistered > 0 ? Math.round((totalOnline / totalRegistered) * 100 * 100) / 100 : 0;

    return {
      totalOnline,
      totalRegistered,
      onlinePercentage,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("Get presence stats failed:", error);
    throw new DatabaseError("Failed to retrieve presence statistics");
  }
};

/**
 * Search users by username with pagination
 */
export const searchUsersByUsername = async (
  searchQuery: string,
  page: number = 1,
  limit: number = 10,
  includeStats: boolean = false
): Promise<{
  users: OnlineUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  console.log("=== SEARCH USERS BY USERNAME START ===");
  console.log("Input:", { searchQuery, page, limit, includeStats });

  try {
    // Prepare search pattern for case-insensitive search
    const searchPattern = `%${searchQuery.toLowerCase()}%`;

    // Base where clause for active users with username search
    const whereClause = {
      deletedAt: null,
      username: {
        contains: searchQuery,
        mode: "insensitive" as const,
      },
    };

    // Get total count of matching users
    const total = await prisma.user.count({
      where: whereClause,
    });

    // Get paginated search results
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        gitHubProfile: true,
        education: true,
        lastActive: true,
      },
      orderBy: [{ username: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    });

    console.log("Search results:", {
      searchQuery,
      total,
      usersReturned: users.length,
      includeStats,
    });

    // Get online status for found users from Redis
    const userIds = users.map((user) => user.id);
    const onlineStatuses = await Promise.all(
      userIds.map(async (userId) => {
        const isOnline = await redis.zscore(PRESENCE_KEYS.ONLINE_SET, userId);
        return { userId, isOnline: isOnline !== null };
      })
    );

    // Create lookup map for online status
    const onlineStatusMap = new Map(
      onlineStatuses.map((status) => [status.userId, status.isOnline])
    );

    // Format response data with online status
    const formattedUsers: OnlineUser[] = users.map((user) => {
      const isOnline = onlineStatusMap.get(user.id) || false;

      return {
        id: user.id,
        username: user.username,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
        gitHubProfile: user.gitHubProfile || undefined,
        education: user.education || undefined,
        lastActive: user.lastActive || new Date(),
        isOnline,
      };
    });

    return {
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Search users by username failed:", error);
    throw new DatabaseError("Failed to search users by username");
  }
};

/**
 * =============================================================================
 * CLEANUP AND MAINTENANCE FUNCTIONS
 * =============================================================================
 */

/**
 * Cleanup stale presence data (run periodically)
 */
export const cleanupStalePresence = async (): Promise<void> => {
  console.log("=== CLEANUP STALE PRESENCE START ===");

  try {
    const cutoffTime = Date.now() - PRESENCE_CONFIG.ONLINE_TTL * 1000;

    // Remove old entries from online set
    const removedCount = await redis.zremrangebyscore(PRESENCE_KEYS.ONLINE_SET, 0, cutoffTime);

    console.log("Cleanup completed:", { removedStaleUsers: removedCount });
  } catch (error) {
    console.error("Cleanup stale presence failed:", error);
  }
};

export default {
  markUserOnline,
  markUserOffline,
  updateHeartbeat,
  getOnlineUsers,
  getOfflineUsers,
  getUserPresence,
  getPresenceStats,
  searchUsersByUsername,
  cleanupStalePresence,
};
