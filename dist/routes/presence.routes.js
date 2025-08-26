"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const error_middleware_1 = require("../middlewares/error.middleware");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const presence_controller_1 = require("../controllers/presence.controller");
/**
 * =============================================================================
 * PRESENCE ROUTES - HYBRID SMART PAGINATION APPROACH
 * =============================================================================
 *
 * Implements the recommended Approach 1: Hybrid Smart Pagination
 *
 * Main Endpoints (Approach 1):
 * - GET /api/users?status=online&page=1&limit=50&include=stats
 * - GET /api/users?status=offline&page=1&limit=50
 * - GET /api/users?page=1&limit=50  // All users with online status
 *
 * Additional Endpoints:
 * - GET /api/users/online/count     - Lightweight count endpoint
 * - POST /api/users/heartbeat       - Keep-alive mechanism
 * - GET /api/users/me/presence      - Own presence status
 * - GET /api/users/presence/stats   - Platform statistics
 *
 * Security Features:
 * ✅ Authentication required for all endpoints
 * ✅ Rate limiting per endpoint based on usage patterns
 * ✅ Input validation and sanitization
 * ✅ Error handling with proper HTTP status codes
 *
 * =============================================================================
 */
const router = (0, express_1.Router)();
// =============================================================================
// RATE LIMITING CONFIGURATIONS
// =============================================================================
// Standard rate limiting for main endpoints
const standardLimit = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: {
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
        retryAfter: 60,
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Higher limit for lightweight endpoints
const lightweightLimit = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 120, // 120 requests per minute
    message: {
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
        retryAfter: 60,
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Lower limit for heavy analytics endpoints
const analyticsLimit = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute
    message: {
        error: "Too many requests",
        message: "Rate limit exceeded for analytics endpoint. Please try again later.",
        retryAfter: 60,
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// =============================================================================
// MAIN HYBRID SMART PAGINATION ENDPOINTS
// =============================================================================
/**
 * Main Users Endpoint - Hybrid Smart Pagination
 *
 * This is THE main endpoint implementing your preferred approach:
 *
 * GET /api/users?status=online&page=1&limit=50&include=stats
 * GET /api/users?status=offline&page=1&limit=50
 * GET /api/users?page=1&limit=50  // Defaults to online users
 *
 * Features:
 * - Unified endpoint for both online and offline users
 * - Smart pagination with configurable limits
 * - Optional stats inclusion for performance optimization
 * - Redis + Database hybrid architecture
 * - Comprehensive filtering and sorting
 */
router.get("/", auth_middleware_1.authenticateUser, standardLimit, (0, error_middleware_1.asyncHandler)(presence_controller_1.getUsersController));
// =============================================================================
// SPECIALIZED ENDPOINTS FOR SPECIFIC USE CASES
// =============================================================================
/**
 * Online Users Count - Lightweight Dashboard Endpoint
 *
 * GET /api/users/online/count
 *
 * Fast endpoint for dashboards and real-time status displays
 * Returns only counts without user data for optimal performance
 *
 * Rate Limit: Higher (120/min) due to lightweight nature
 */
router.get("/online/count", auth_middleware_1.authenticateUser, lightweightLimit, (0, error_middleware_1.asyncHandler)(presence_controller_1.getOnlineCountController));
/**
 * User Heartbeat - Keep Alive Mechanism
 *
 * POST /api/users/heartbeat
 * Body: { device_info?: any }
 *
 * Clients should call this endpoint every 2 minutes to maintain online status
 * Essential for accurate presence tracking in real-time applications
 *
 * Rate Limit: Standard (60/min) to prevent abuse while allowing frequent updates
 */
router.post("/heartbeat", auth_middleware_1.authenticateUser, standardLimit, (0, error_middleware_1.asyncHandler)(presence_controller_1.heartbeatController));
/**
 * My Presence Status - Personal Status Check
 *
 * GET /api/users/me/presence
 *
 * Returns the authenticated user's current presence information
 * Useful for client-side presence indicators and status synchronization
 *
 * Rate Limit: Higher (120/min) for responsive UI updates
 */
router.get("/me/presence", auth_middleware_1.authenticateUser, lightweightLimit, (0, error_middleware_1.asyncHandler)(presence_controller_1.getMyPresenceController));
/**
 * Presence Statistics - Platform Analytics
 *
 * GET /api/users/presence/stats
 *
 * Returns comprehensive presence statistics for the platform
 * Intended for admin dashboards and analytics systems
 *
 * Rate Limit: Lower (30/min) due to computational intensity
 */
router.get("/presence/stats", auth_middleware_1.authenticateUser, analyticsLimit, (0, error_middleware_1.asyncHandler)(presence_controller_1.getPresenceStatsController));
/**
 * Search Users by Username
 *
 * GET /api/users/search?query=abdul&page=1&limit=10&include=stats
 *
 * Search for users by username with case-insensitive matching
 * Returns paginated results with online/offline status
 *
 * Query Parameters:
 * - query: Search term for username (required, 1-50 characters)
 * - page: Page number (default: 1)
 * - limit: Results per page (default: 10, max: 50)
 * - include: "stats" to include game statistics (optional)
 *
 * Rate Limit: Standard (60/min) for search functionality
 */
router.get("/search", auth_middleware_1.authenticateUser, standardLimit, (0, error_middleware_1.asyncHandler)(presence_controller_1.searchUsersController));
// =============================================================================
// ROUTE DOCUMENTATION AND EXAMPLES
// =============================================================================
/**
 * =============================================================================
 * API USAGE EXAMPLES
 * =============================================================================
 *
 * 1. Get Online Users with Stats:
 *    GET /api/users?status=online&page=1&limit=50&include=stats
 *
 * 2. Get Offline Users (last 24 hours):
 *    GET /api/users?status=offline&page=1&limit=50
 *
 * 3. Get All Users (defaults to online):
 *    GET /api/users?page=1&limit=50
 *
 * 4. Get Offline Users (last week):
 *    GET /api/users?status=offline&page=1&limit=50&hours_back=168
 *
 * 5. Get Online Count for Dashboard:
 *    GET /api/users/online/count
 *
 * 6. Update Heartbeat (client keep-alive):
 *    POST /api/users/heartbeat
 *    Body: { "device_info": { "platform": "mobile", "version": "1.0" } }
 *
 * 7. Get My Presence:
 *    GET /api/users/me/presence
 *
 * 8. Get Platform Statistics:
 *    GET /api/users/presence/stats
 *
 * =============================================================================
 */
exports.default = router;
