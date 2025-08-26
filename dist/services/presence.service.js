"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupStalePresence = exports.searchUsersByUsername = exports.getPresenceStats = exports.getUserPresence = exports.getOfflineUsers = exports.getOnlineUsers = exports.updateHeartbeat = exports.markUserOffline = exports.markUserOnline = void 0;
const prisma_1 = require("../config/prisma");
const redis_1 = require("../config/redis");
const error_1 = require("../constants/error");
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
};
const PRESENCE_CONFIG = {
    ONLINE_TTL: 300, // 5 minutes
    HEARTBEAT_TTL: 120, // 2 minutes
    BATCH_SIZE: 100,
    MAX_RETRIES: 3,
};
/**
 * =============================================================================
 * CORE PRESENCE TRACKING FUNCTIONS
 * =============================================================================
 */
/**
 * Mark user as online and update presence data
 */
const markUserOnline = async (userId, deviceInfo) => {
    console.log("=== MARK USER ONLINE START ===");
    console.log("Input:", { userId, hasDeviceInfo: !!deviceInfo });
    try {
        const pipeline = redis_1.redis.pipeline();
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
        pipeline.setex(`${PRESENCE_KEYS.USER_PREFIX}${userId}`, PRESENCE_CONFIG.ONLINE_TTL, presenceData);
        // Set heartbeat key
        pipeline.setex(`${PRESENCE_KEYS.HEARTBEAT_PREFIX}${userId}`, PRESENCE_CONFIG.HEARTBEAT_TTL, timestamp.toString());
        await pipeline.exec();
        // Update database lastActive (async, non-blocking)
        prisma_1.prisma.user
            .update({
            where: { id: userId },
            data: { lastActive: new Date() },
        })
            .catch((error) => {
            console.error("Failed to update lastActive in database:", error);
        });
        console.log("User marked online successfully");
    }
    catch (error) {
        console.error("Mark user online failed:", error);
        throw new error_1.DatabaseError("Failed to update user presence");
    }
};
exports.markUserOnline = markUserOnline;
/**
 * Mark user as offline and cleanup presence data
 */
const markUserOffline = async (userId) => {
    console.log("=== MARK USER OFFLINE START ===");
    console.log("Input:", { userId });
    try {
        const pipeline = redis_1.redis.pipeline();
        // Remove from online users set
        pipeline.zrem(PRESENCE_KEYS.ONLINE_SET, userId);
        // Remove individual presence data
        pipeline.del(`${PRESENCE_KEYS.USER_PREFIX}${userId}`);
        pipeline.del(`${PRESENCE_KEYS.HEARTBEAT_PREFIX}${userId}`);
        await pipeline.exec();
        // Update database lastActive (async, non-blocking)
        prisma_1.prisma.user
            .update({
            where: { id: userId },
            data: { lastActive: new Date() },
        })
            .catch((error) => {
            console.error("Failed to update lastActive in database:", error);
        });
        console.log("User marked offline successfully");
    }
    catch (error) {
        console.error("Mark user offline failed:", error);
        throw new error_1.DatabaseError("Failed to update user presence");
    }
};
exports.markUserOffline = markUserOffline;
/**
 * Update heartbeat for online user
 */
const updateHeartbeat = async (userId, deviceInfo) => {
    try {
        const timestamp = Date.now();
        const pipeline = redis_1.redis.pipeline();
        // Update heartbeat
        pipeline.setex(`${PRESENCE_KEYS.HEARTBEAT_PREFIX}${userId}`, PRESENCE_CONFIG.HEARTBEAT_TTL, timestamp.toString());
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
        pipeline.setex(`${PRESENCE_KEYS.USER_PREFIX}${userId}`, PRESENCE_CONFIG.ONLINE_TTL, presenceData);
        await pipeline.exec();
    }
    catch (error) {
        console.error("Update heartbeat failed:", error);
        // Don't throw - heartbeat failures should be graceful
    }
};
exports.updateHeartbeat = updateHeartbeat;
/**
 * =============================================================================
 * QUERY FUNCTIONS
 * =============================================================================
 */
/**
 * Get all online users with full profile data (paginated)
 */
const getOnlineUsers = async (page = 1, limit = 50, includeStats = true) => {
    console.log("=== GET ONLINE USERS START ===");
    console.log("Input:", { page, limit, includeStats });
    try {
        // Step 1: Get online user IDs from Redis (with pagination)
        const offset = (page - 1) * limit;
        const onlineUserIds = await redis_1.redis.zrevrange(PRESENCE_KEYS.ONLINE_SET, offset, offset + limit - 1);
        const totalOnline = await redis_1.redis.zcard(PRESENCE_KEYS.ONLINE_SET);
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
        const selectFields = {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            lastActive: true,
            ...(includeStats && {
                totalScore: true,
                gamesPlayed: true,
                gamesWon: true,
                winRate: true,
                currentStreak: true,
                leaderboardEntry: {
                    select: {
                        globalRank: true,
                    },
                },
            }),
        };
        const users = await prisma_1.prisma.user.findMany({
            where: {
                id: { in: onlineUserIds },
                status: "ACTIVE",
            },
            select: selectFields,
            orderBy: { totalScore: "desc" },
        });
        console.log("Database query results:", { usersFound: users.length });
        // Step 3: Format response data
        const formattedUsers = users.map((user) => ({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar || undefined,
            lastActive: user.lastActive || new Date(),
            ...(includeStats && {
                totalScore: user.totalScore || 0,
                gamesPlayed: user.gamesPlayed || 0,
                gamesWon: user.gamesWon || 0,
                winRate: user.winRate || 0,
                currentStreak: user.currentStreak || 0,
                globalRank: user.leaderboardEntry?.globalRank || undefined,
            }),
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
    }
    catch (error) {
        console.error("Get online users failed:", error);
        throw new error_1.DatabaseError("Failed to retrieve online users");
    }
};
exports.getOnlineUsers = getOnlineUsers;
/**
 * Get offline users (recently active) with pagination
 */
const getOfflineUsers = async (page = 1, limit = 50, hoursBack = 24) => {
    console.log("=== GET OFFLINE USERS START ===");
    console.log("Input:", { page, limit, hoursBack });
    try {
        // Step 1: Get online user IDs to exclude
        const onlineUserIds = await redis_1.redis.zrange(PRESENCE_KEYS.ONLINE_SET, 0, -1);
        // Step 2: Query database for offline users
        const recentlyActiveThreshold = new Date();
        recentlyActiveThreshold.setHours(recentlyActiveThreshold.getHours() - hoursBack);
        const whereClause = {
            status: "ACTIVE",
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
        const totalOffline = await prisma_1.prisma.user.count({
            where: whereClause,
        });
        // Get paginated results
        const users = await prisma_1.prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                totalScore: true,
                gamesPlayed: true,
                gamesWon: true,
                winRate: true,
                currentStreak: true,
                lastActive: true,
                leaderboardEntry: {
                    select: {
                        globalRank: true,
                    },
                },
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
        const formattedUsers = users.map((user) => ({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar || undefined,
            totalScore: user.totalScore,
            gamesPlayed: user.gamesPlayed,
            gamesWon: user.gamesWon,
            winRate: user.winRate,
            currentStreak: user.currentStreak,
            globalRank: user.leaderboardEntry?.globalRank || undefined,
            lastActive: user.lastActive || new Date(),
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
    }
    catch (error) {
        console.error("Get offline users failed:", error);
        throw new error_1.DatabaseError("Failed to retrieve offline users");
    }
};
exports.getOfflineUsers = getOfflineUsers;
/**
 * Get user presence status
 */
const getUserPresence = async (userId) => {
    try {
        // First try to get presence data from USER_PREFIX key
        const presenceData = await redis_1.redis.get(`${PRESENCE_KEYS.USER_PREFIX}${userId}`);
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
        const isInOnlineSet = await redis_1.redis.zscore(PRESENCE_KEYS.ONLINE_SET, userId);
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
    }
    catch (error) {
        console.error("Get user presence failed:", error);
        return null;
    }
};
exports.getUserPresence = getUserPresence;
/**
 * Get presence statistics
 */
const getPresenceStats = async () => {
    try {
        const [totalOnline, totalRegistered] = await Promise.all([
            redis_1.redis.zcard(PRESENCE_KEYS.ONLINE_SET),
            prisma_1.prisma.user.count({ where: { status: "ACTIVE" } }),
        ]);
        const onlinePercentage = totalRegistered > 0 ? Math.round((totalOnline / totalRegistered) * 100 * 100) / 100 : 0;
        return {
            totalOnline,
            totalRegistered,
            onlinePercentage,
            lastUpdated: new Date(),
        };
    }
    catch (error) {
        console.error("Get presence stats failed:", error);
        throw new error_1.DatabaseError("Failed to retrieve presence statistics");
    }
};
exports.getPresenceStats = getPresenceStats;
/**
 * Search users by username with pagination
 */
const searchUsersByUsername = async (searchQuery, page = 1, limit = 10, includeStats = false) => {
    console.log("=== SEARCH USERS BY USERNAME START ===");
    console.log("Input:", { searchQuery, page, limit, includeStats });
    try {
        // Prepare search pattern for case-insensitive search
        const searchPattern = `%${searchQuery.toLowerCase()}%`;
        // Base where clause for active users with username search
        const whereClause = {
            status: "ACTIVE",
            username: {
                contains: searchQuery,
                mode: "insensitive",
            },
        };
        // Get total count of matching users
        const total = await prisma_1.prisma.user.count({
            where: whereClause,
        });
        // Prepare select fields based on includeStats parameter
        const selectFields = {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            lastActive: true,
            ...(includeStats && {
                totalScore: true,
                gamesPlayed: true,
                gamesWon: true,
                winRate: true,
                currentStreak: true,
                leaderboardEntry: {
                    select: {
                        globalRank: true,
                    },
                },
            }),
        };
        // Get paginated search results
        const users = await prisma_1.prisma.user.findMany({
            where: whereClause,
            select: selectFields,
            orderBy: [{ totalScore: "desc" }, { username: "asc" }],
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
        const onlineStatuses = await Promise.all(userIds.map(async (userId) => {
            const isOnline = await redis_1.redis.zscore(PRESENCE_KEYS.ONLINE_SET, userId);
            return { userId, isOnline: isOnline !== null };
        }));
        // Create lookup map for online status
        const onlineStatusMap = new Map(onlineStatuses.map((status) => [status.userId, status.isOnline]));
        // Format response data with online status
        const formattedUsers = users.map((user) => {
            const isOnline = onlineStatusMap.get(user.id) || false;
            return {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar || undefined,
                lastActive: user.lastActive || new Date(),
                status: isOnline ? "online" : "offline",
                isOnline,
                ...(includeStats && {
                    totalScore: user.totalScore || 0,
                    gamesPlayed: user.gamesPlayed || 0,
                    gamesWon: user.gamesWon || 0,
                    winRate: user.winRate || 0,
                    currentStreak: user.currentStreak || 0,
                    globalRank: user.leaderboardEntry?.globalRank || undefined,
                }),
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
    }
    catch (error) {
        console.error("Search users by username failed:", error);
        throw new error_1.DatabaseError("Failed to search users by username");
    }
};
exports.searchUsersByUsername = searchUsersByUsername;
/**
 * =============================================================================
 * CLEANUP AND MAINTENANCE FUNCTIONS
 * =============================================================================
 */
/**
 * Cleanup stale presence data (run periodically)
 */
const cleanupStalePresence = async () => {
    console.log("=== CLEANUP STALE PRESENCE START ===");
    try {
        const cutoffTime = Date.now() - PRESENCE_CONFIG.ONLINE_TTL * 1000;
        // Remove old entries from online set
        const removedCount = await redis_1.redis.zremrangebyscore(PRESENCE_KEYS.ONLINE_SET, 0, cutoffTime);
        console.log("Cleanup completed:", { removedStaleUsers: removedCount });
    }
    catch (error) {
        console.error("Cleanup stale presence failed:", error);
    }
};
exports.cleanupStalePresence = cleanupStalePresence;
exports.default = {
    markUserOnline: exports.markUserOnline,
    markUserOffline: exports.markUserOffline,
    updateHeartbeat: exports.updateHeartbeat,
    getOnlineUsers: exports.getOnlineUsers,
    getOfflineUsers: exports.getOfflineUsers,
    getUserPresence: exports.getUserPresence,
    getPresenceStats: exports.getPresenceStats,
    searchUsersByUsername: exports.searchUsersByUsername,
    cleanupStalePresence: exports.cleanupStalePresence,
};
