"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const error_middleware_1 = require("../middlewares/error.middleware");
const friends_controller_1 = require("../controllers/friends.controller");
/**
 * =============================================================================
 * FRIENDS ROUTES - COMPREHENSIVE FRIENDSHIP MANAGEMENT API
 * =============================================================================
 *
 * This module defines all friendship-related API endpoints.
 * All routes require authentication and follow RESTful conventions.
 *
 * Features:
 * - Friend request management
 * - Friendship lifecycle (accept, decline, remove)
 * - User blocking/unblocking
 * - User search with friendship context
 * - Friends list with pagination
 * - Friendship statistics and activity tracking
 *
 * Security:
 * - All routes require valid JWT authentication
 * - Input validation with Zod schemas
 * - Proper error handling with asyncHandler
 * - Rate limiting recommended (to be added at API gateway level)
 *
 * =============================================================================
 */
const router = (0, express_1.Router)();
// =============================================================================
// FRIEND REQUEST MANAGEMENT
// =============================================================================
/**
 * Send Friend Request
 * POST /api/friends/request
 *
 * Sends a friend request to another user.
 *
 * Headers: Authorization: Bearer <jwt_token>
 * Body: { recipientId: string }
 *
 * Response: {
 *   success: true,
 *   message: "Friend request sent successfully",
 *   data: {
 *     friendshipId: string,
 *     status: "PENDING",
 *     recipient: { id: string, username: string }
 *   }
 * }
 */
router.post("/request", auth_middleware_1.authenticateUser, (0, error_middleware_1.asyncHandler)(friends_controller_1.sendFriendRequest));
/**
 * Get Friend Requests
 * GET /api/friends/requests
 *
 * Retrieves user's sent and received friend requests with pagination.
 *
 * Headers: Authorization: Bearer <jwt_token>
 * Query: ?limit=20&offset=0
 *
 * Response: {
 *   success: true,
 *   message: "Friend requests retrieved successfully",
 *   data: {
 *     sent: FriendRequestItem[],
 *     received: FriendRequestItem[],
 *     totalSent: number,
 *     totalReceived: number
 *   },
 *   pagination: {
 *     limit: number,
 *     offset: number,
 *     hasMoreSent: boolean,
 *     hasMoreReceived: boolean
 *   }
 * }
 */
router.get("/requests", auth_middleware_1.authenticateUser, (0, error_middleware_1.asyncHandler)(friends_controller_1.getFriendRequests));
// =============================================================================
// FRIENDSHIP MANAGEMENT
// =============================================================================
/**
 * Manage Friendship
 * PUT /api/friends/:friendshipId
 *
 * Accepts, declines, or removes a friendship.
 *
 * Headers: Authorization: Bearer <jwt_token>
 * Params: friendshipId (UUID)
 * Body: { action: "accept" | "decline" | "remove" }
 *
 * Response: {
 *   success: true,
 *   message: "Friend request accepted successfully",
 *   data: {
 *     friendshipId: string,
 *     action: string,
 *     status?: "ACCEPTED" | "REJECTED",
 *     friend?: { id: string, username: string, avatar: string }
 *   }
 * }
 */
router.put("/:friendshipId", auth_middleware_1.authenticateUser, (0, error_middleware_1.asyncHandler)(friends_controller_1.manageFriendship));
/**
 * Get Friends List
 * GET /api/friends/list
 *
 * Retrieves user's friends list with pagination.
 *
 * Headers: Authorization: Bearer <jwt_token>
 * Query: ?limit=20&offset=0
 *
 * Response: {
 *   success: true,
 *   message: "Friends list retrieved successfully",
 *   data: {
 *     friends: FriendItem[],
 *     totalCount: number
 *   },
 *   pagination: {
 *     limit: number,
 *     offset: number,
 *     hasMore: boolean
 *   }
 * }
 */
router.get("/list", auth_middleware_1.authenticateUser, (0, error_middleware_1.asyncHandler)(friends_controller_1.getFriendsList));
// =============================================================================
// USER BLOCKING
// =============================================================================
/**
 * Block/Unblock User
 * PUT /api/friends/block/:targetUserId
 *
 * Blocks or unblocks a user.
 *
 * Headers: Authorization: Bearer <jwt_token>
 * Params: targetUserId (UUID)
 * Body: { action: "block" | "unblock" }
 *
 * Response: {
 *   success: true,
 *   message: "User blocked successfully",
 *   data: {
 *     action: "block" | "unblock",
 *     targetUser: { id: string, username: string },
 *     status?: "BLOCKED"
 *   }
 * }
 */
router.put("/block/:targetUserId", auth_middleware_1.authenticateUser, (0, error_middleware_1.asyncHandler)(friends_controller_1.blockUser));
// =============================================================================
// USER DISCOVERY
// =============================================================================
/**
 * Search Users
 * GET /api/friends/search
 *
 * Searches for users by username/name with friendship status context.
 *
 * Headers: Authorization: Bearer <jwt_token>
 * Query: ?query=search_term&limit=10&offset=0
 *
 * Response: {
 *   success: true,
 *   message: "User search completed successfully",
 *   data: {
 *     users: SearchUserItem[],
 *     totalCount: number,
 *     query: string,
 *     hasMore: boolean
 *   },
 *   pagination: {
 *     limit: number,
 *     offset: number,
 *     hasMore: boolean
 *   }
 * }
 */
router.get("/search", auth_middleware_1.authenticateUser, (0, error_middleware_1.asyncHandler)(friends_controller_1.searchUsers));
/**
 * Get User Profile with Friendship Status
 * GET /api/friends/profile/:userId
 *
 * Retrieves another user's public profile with friendship relationship status.
 *
 * Headers: Authorization: Bearer <jwt_token>
 * Params: userId (UUID)
 *
 * Response: {
 *   success: true,
 *   message: "User profile retrieved successfully",
 *   data: {
 *     user: {
 *       id: string,
 *       username: string,
 *       firstName: string,
 *       lastName: string,
 *       avatar: string | null,
 *       totalScore: number,
 *       friendshipStatus: "NONE" | "PENDING_SENT" | "PENDING_RECEIVED" | "ACCEPTED" | "BLOCKED"
 *     }
 *   }
 * }
 */
router.get("/profile/:userId", auth_middleware_1.authenticateUser, (0, error_middleware_1.asyncHandler)(friends_controller_1.getUserProfileWithFriendshipStatus));
// =============================================================================
// FRIENDSHIP ANALYTICS
// =============================================================================
/**
 * Get Friendship Statistics
 * GET /api/friends/stats
 *
 * Retrieves comprehensive friendship statistics for the authenticated user.
 *
 * Headers: Authorization: Bearer <jwt_token>
 *
 * Response: {
 *   success: true,
 *   message: "Friendship statistics retrieved successfully",
 *   data: {
 *     totalFriends: number,
 *     pendingSent: number,
 *     pendingReceived: number,
 *     blockedUsers: number
 *   }
 * }
 */
router.get("/stats", auth_middleware_1.authenticateUser, (0, error_middleware_1.asyncHandler)(friends_controller_1.getFriendshipStats));
/**
 * Get Friend Activity Status
 * GET /api/friends/activity
 *
 * Retrieves activity status for user's friends (online status, current games).
 *
 * Headers: Authorization: Bearer <jwt_token>
 * Query: ?friendIds=uuid1,uuid2,uuid3 (optional - if not provided, gets all friends)
 *
 * Response: {
 *   success: true,
 *   message: "Friend activity status retrieved successfully",
 *   data: {
 *     friends: FriendActivityStatus[],
 *     summary: {
 *       totalFriends: number,
 *       onlineFriends: number,
 *       friendsInGame: number
 *     }
 *   }
 * }
 */
router.get("/activity", auth_middleware_1.authenticateUser, (0, error_middleware_1.asyncHandler)(friends_controller_1.getFriendActivity));
// =============================================================================
// ROUTE EXPORT
// =============================================================================
exports.default = router;
/**
 * =============================================================================
 * API DOCUMENTATION SUMMARY
 * =============================================================================
 *
 * ENDPOINT OVERVIEW:
 *
 * Friend Requests:
 * - POST   /api/friends/request          - Send friend request
 * - GET    /api/friends/requests         - Get friend requests (sent/received)
 *
 * Friendship Management:
 * - PUT    /api/friends/:friendshipId    - Accept/decline/remove friendship
 * - GET    /api/friends/list            - Get friends list
 *
 * User Blocking:
 * - PUT    /api/friends/block/:userId    - Block/unblock user
 *
 * User Discovery:
 * - GET    /api/friends/search           - Search users with friendship context
 * - GET    /api/friends/profile/:userId  - Get user profile with friendship status
 *
 * Analytics:
 * - GET    /api/friends/stats            - Get friendship statistics
 * - GET    /api/friends/activity         - Get friend activity status
 *
 * =============================================================================
 * PAYLOAD EXAMPLES FOR FRONTEND DEVELOPERS
 * =============================================================================
 *
 * 1. Send Friend Request:
 * POST /api/friends/request
 * {
 *   "recipientId": "550e8400-e29b-41d4-a716-446655440000"
 * }
 *
 * 2. Accept Friend Request:
 * PUT /api/friends/550e8400-e29b-41d4-a716-446655440001
 * {
 *   "action": "accept"
 * }
 *
 * 3. Block User:
 * PUT /api/friends/block/550e8400-e29b-41d4-a716-446655440002
 * {
 *   "action": "block"
 * }
 *
 * 4. Search Users:
 * GET /api/friends/search?query=john&limit=10&offset=0
 *
 * 5. Get Friends List:
 * GET /api/friends/list?limit=20&offset=0
 *
 * 6. Get Friend Requests:
 * GET /api/friends/requests?limit=20&offset=0
 *
 * 7. Get Friendship Stats:
 * GET /api/friends/stats
 *
 * 8. Get Friend Activity:
 * GET /api/friends/activity
 * GET /api/friends/activity?friendIds=uuid1,uuid2,uuid3
 *
 * =============================================================================
 */
