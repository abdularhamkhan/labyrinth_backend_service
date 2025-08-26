"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsersController = exports.getPresenceStatsController = exports.getMyPresenceController = exports.heartbeatController = exports.getOnlineCountController = exports.getUsersController = void 0;
const presence_service_1 = require("../services/presence.service");
const error_1 = require("../constants/error");
const zod_1 = require("zod");
/**
 * =============================================================================
 * PRESENCE CONTROLLER - HYBRID SMART PAGINATION APPROACH
 * =============================================================================
 *
 * Implements the recommended Approach 1: Hybrid Smart Pagination
 *
 * API Endpoints:
 * - GET /api/users?status=online&page=1&limit=50&include=stats
 * - GET /api/users?status=offline&page=1&limit=50
 * - GET /api/users?page=1&limit=50  // All users with online status
 *
 * Features:
 * ✅ Scalability: Handles millions of users via pagination
 * ✅ Performance: Redis + Database hybrid approach
 * ✅ Security: Rate-limited, authenticated, role-based access
 * ✅ Efficiency: Smart caching + selective field loading
 *
 * =============================================================================
 */
// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================
const PaginationSchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        const num = parseInt(val || "1", 10);
        return isNaN(num) || num < 1 ? 1 : num;
    }),
    limit: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        const num = parseInt(val || "50", 10);
        return isNaN(num) || num < 1 ? 50 : Math.min(num, 100); // Max 100 per page
    }),
});
const SearchQuerySchema = zod_1.z.object({
    query: zod_1.z.string().min(1, "Search query is required").max(50, "Search query too long"),
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional(),
    include: zod_1.z
        .string()
        .optional()
        .transform((val) => val === "stats"),
});
const UsersQuerySchema = zod_1.z.object({
    status: zod_1.z.enum(["online", "offline"]).optional(),
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional(),
    include: zod_1.z
        .string()
        .optional()
        .transform((val) => val === "stats"),
    hours_back: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        const num = parseInt(val || "24", 10);
        return isNaN(num) || num < 1 ? 24 : Math.min(num, 168); // Max 1 week
    }),
});
// =============================================================================
// MAIN UNIFIED ENDPOINT - HYBRID SMART PAGINATION
// =============================================================================
/**
 * Get Users with Smart Filtering - MAIN ENDPOINT
 * GET /api/users
 *
 * Query Parameters:
 * - status: "online" | "offline" (optional) - Filter by user status
 * - page: Page number (default: 1)
 * - limit: Results per page (default: 50, max: 100)
 * - include: "stats" - Include game statistics (default: false)
 * - hours_back: For offline users, how many hours back to look (default: 24, max: 168)
 *
 * Examples:
 * - GET /api/users?status=online&page=1&limit=50&include=stats
 * - GET /api/users?status=offline&page=1&limit=50
 * - GET /api/users?page=1&limit=50  // All users (defaults to online)
 *
 * Security: Requires authentication
 * Rate Limit: 60 requests per minute
 */
const getUsersController = async (req, res) => {
    console.log("=== GET USERS CONTROLLER START ===");
    console.log("Query params:", req.query);
    console.log("Authenticated user:", req.user?.id);
    try {
        // Validate and sanitize query parameters
        const validatedQuery = UsersQuerySchema.parse(req.query);
        const { page, limit } = PaginationSchema.parse(req.query);
        const { status, include: includeStats = false, hours_back: hoursBack = 24 } = validatedQuery;
        console.log("Validated parameters:", {
            status,
            page,
            limit,
            includeStats,
            hoursBack,
        });
        let result;
        let responseMessage;
        // Route to appropriate service based on status filter
        if (status === "online") {
            result = await (0, presence_service_1.getOnlineUsers)(page, limit, includeStats);
            responseMessage = "Online users retrieved successfully";
            // Add online status to each user
            result.users = result.users.map((user) => ({
                ...user,
                status: "online",
                isOnline: true,
            }));
        }
        else if (status === "offline") {
            result = await (0, presence_service_1.getOfflineUsers)(page, limit, hoursBack);
            responseMessage = "Offline users retrieved successfully";
            // Add offline status to each user
            result.users = result.users.map((user) => ({
                ...user,
                status: "offline",
                isOnline: false,
            }));
        }
        else {
            // Default: return online users when no status filter
            result = await (0, presence_service_1.getOnlineUsers)(page, limit, includeStats);
            responseMessage = "Users retrieved successfully (showing online users)";
            // Add online status to each user
            result.users = result.users.map((user) => ({
                ...user,
                status: "online",
                isOnline: true,
            }));
        }
        console.log("Service response:", {
            usersReturned: result.users.length,
            total: result.pagination.total,
            currentPage: result.pagination.page,
            statusFilter: status || "online (default)",
        });
        // Enhanced response with metadata
        res.status(200).json({
            success: true,
            message: responseMessage,
            data: {
                users: result.users,
                pagination: result.pagination,
                metadata: {
                    retrievedAt: new Date().toISOString(),
                    statusFilter: status || "online",
                    includesStats: includeStats,
                    ...(status === "offline" && { recentlyActiveWithin: `${hoursBack} hours` }),
                },
            },
        });
    }
    catch (error) {
        console.error("Get users controller error:", error);
        if (error instanceof zod_1.z.ZodError) {
            throw new error_1.ValidationError(`Invalid query parameters: ${error.issues.map((i) => i.message).join(", ")}`);
        }
        throw error;
    }
};
exports.getUsersController = getUsersController;
// =============================================================================
// SPECIALIZED ENDPOINTS
// =============================================================================
/**
 * Get Online Users Count Only - Lightweight
 * GET /api/users/online/count
 *
 * Returns just the count of online users for dashboards
 *
 * Security: Requires authentication
 * Rate Limit: 120 requests per minute
 */
const getOnlineCountController = async (req, res) => {
    console.log("=== GET ONLINE COUNT CONTROLLER START ===");
    console.log("Authenticated user:", req.user?.id);
    try {
        const stats = await (0, presence_service_1.getPresenceStats)();
        console.log("Presence stats retrieved:", {
            onlineCount: stats.totalOnline,
            totalUsers: stats.totalRegistered,
        });
        res.status(200).json({
            success: true,
            message: "Online count retrieved successfully",
            data: {
                onlineCount: stats.totalOnline,
                totalRegistered: stats.totalRegistered,
                onlinePercentage: stats.onlinePercentage,
                lastUpdated: stats.lastUpdated,
            },
        });
    }
    catch (error) {
        console.error("Get online count controller error:", error);
        throw error;
    }
};
exports.getOnlineCountController = getOnlineCountController;
/**
 * Update User Heartbeat - Keep Alive
 * POST /api/users/heartbeat
 *
 * Body: { device_info?: any }
 *
 * Clients should call this every 2 minutes to maintain online status
 *
 * Security: Requires authentication
 * Rate Limit: 60 requests per minute
 */
const heartbeatController = async (req, res) => {
    console.log("=== HEARTBEAT CONTROLLER START ===");
    console.log("Authenticated user:", req.user?.id);
    try {
        const userId = req.user.id;
        const { device_info } = req.body || {};
        await (0, presence_service_1.updateHeartbeat)(userId, device_info);
        console.log("Heartbeat updated successfully for user:", userId);
        res.status(200).json({
            success: true,
            message: "Heartbeat updated successfully",
            data: {
                userId,
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        console.error("Heartbeat controller error:", error);
        throw error;
    }
};
exports.heartbeatController = heartbeatController;
/**
 * Get My Presence Status
 * GET /api/users/me/presence
 *
 * Returns current user's presence information
 *
 * Security: Requires authentication
 * Rate Limit: 120 requests per minute
 */
const getMyPresenceController = async (req, res) => {
    console.log("=== GET MY PRESENCE CONTROLLER START ===");
    console.log("Authenticated user:", req.user?.id);
    try {
        const userId = req.user.id;
        const presence = await (0, presence_service_1.getUserPresence)(userId);
        console.log("Presence retrieved for user:", userId, presence ? "found" : "not found");
        res.status(200).json({
            success: true,
            message: "User presence retrieved successfully",
            data: {
                presence: presence || { isOnline: false, userId },
                retrievedAt: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        console.error("Get my presence controller error:", error);
        throw error;
    }
};
exports.getMyPresenceController = getMyPresenceController;
/**
 * Get Presence Statistics - Admin/Analytics
 * GET /api/users/presence/stats
 *
 * Returns overall platform presence statistics
 *
 * Security: Requires authentication
 * Rate Limit: 30 requests per minute
 */
const getPresenceStatsController = async (req, res) => {
    console.log("=== GET PRESENCE STATS CONTROLLER START ===");
    console.log("Authenticated user:", req.user?.id);
    try {
        const stats = await (0, presence_service_1.getPresenceStats)();
        console.log("Presence statistics retrieved:", stats);
        res.status(200).json({
            success: true,
            message: "Presence statistics retrieved successfully",
            data: {
                statistics: stats,
                retrievedAt: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        console.error("Get presence stats controller error:", error);
        throw error;
    }
};
exports.getPresenceStatsController = getPresenceStatsController;
/**
 * Search Users by Username
 * GET /api/users/search?query=abdul&page=1&limit=10
 *
 * Query Parameters:
 * - query: Search term for username (required, min 1 char, max 50 chars)
 * - page: Page number (default: 1)
 * - limit: Results per page (default: 10, max: 50)
 * - include: "stats" - Include game statistics (default: false)
 *
 * Examples:
 * - GET /api/users/search?query=abdul&page=1&limit=10
 * - GET /api/users/search?query=john&include=stats
 *
 * Security: Requires authentication
 * Rate Limit: 60 requests per minute
 */
const searchUsersController = async (req, res) => {
    console.log("=== SEARCH USERS CONTROLLER START ===");
    console.log("Query params:", req.query);
    console.log("Authenticated user:", req.user?.id);
    try {
        // Validate and sanitize query parameters
        const validatedQuery = SearchQuerySchema.parse(req.query);
        const { page, limit } = PaginationSchema.parse(req.query);
        const { query: searchQuery, include: includeStats = false } = validatedQuery;
        // Ensure reasonable limit for search (max 50)
        const searchLimit = Math.min(limit, 50);
        console.log("Validated search parameters:", {
            searchQuery,
            page,
            limit: searchLimit,
            includeStats,
        });
        const result = await (0, presence_service_1.searchUsersByUsername)(searchQuery, page, searchLimit, includeStats);
        console.log("Search service response:", {
            usersFound: result.users.length,
            total: result.pagination.total,
            currentPage: result.pagination.page,
            searchQuery,
        });
        res.status(200).json({
            success: true,
            message: `Users found for query: "${searchQuery}"`,
            data: {
                users: result.users,
                pagination: result.pagination,
                metadata: {
                    retrievedAt: new Date().toISOString(),
                    searchQuery,
                    includeStats,
                },
            },
        });
    }
    catch (error) {
        console.error("Search users controller error:", error);
        if (error instanceof zod_1.z.ZodError) {
            throw new error_1.ValidationError(`Invalid search parameters: ${error.issues.map((i) => i.message).join(", ")}`);
        }
        throw error;
    }
};
exports.searchUsersController = searchUsersController;
exports.default = {
    getUsersController: exports.getUsersController,
    getOnlineCountController: exports.getOnlineCountController,
    heartbeatController: exports.heartbeatController,
    getMyPresenceController: exports.getMyPresenceController,
    getPresenceStatsController: exports.getPresenceStatsController,
    searchUsersController: exports.searchUsersController,
};
