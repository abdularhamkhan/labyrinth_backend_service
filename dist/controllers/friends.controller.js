"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileWithFriendshipStatus = exports.getFriendActivity = exports.getFriendshipStats = exports.searchUsers = exports.getFriendRequests = exports.getFriendsList = exports.blockUser = exports.manageFriendship = exports.sendFriendRequest = void 0;
const error_1 = require("../constants/error");
const friends_service_1 = require("../services/friends.service");
const friends_schema_1 = require("../schemas/friends.schema");
/**
 * =============================================================================
 * FRIENDS CONTROLLER - COMPREHENSIVE FRIENDSHIP MANAGEMENT
 * =============================================================================
 *
 * These controllers handle all friendship-related operations:
 * - Send friend requests
 * - Manage friendships (accept, decline, remove)
 * - Block/unblock users
 * - Retrieve friends lists and requests
 * - Search users with friendship context
 * - Get friendship statistics and activity
 *
 * All controllers follow consistent patterns:
 * - Input validation with Zod schemas
 * - Proper error handling and logging
 * - Standardized response format
 * - Authentication requirement
 *
 * =============================================================================
 */
/**
 * =============================================================================
 * SEND FRIEND REQUEST
 * =============================================================================
 *
 * Sends a friend request to another user.
 *
 * Route: POST /api/friends/request
 * Auth: Required (authenticateUser middleware)
 * Body: { recipientId: string }
 *
 * @param req - AuthenticatedRequest with user data and recipient ID
 * @param res - Express response object
 */
const sendFriendRequest = async (req, res) => {
    console.log("=== SEND FRIEND REQUEST CONTROLLER START ===");
    const userId = req.user.id;
    console.log("Request details:", { userId, body: req.body });
    // Validate input
    const validatedData = friends_schema_1.sendFriendRequestSchema.parse(req.body);
    console.log("Validated input:", validatedData);
    // Delegate to service layer
    const result = await (0, friends_service_1.sendFriendRequestService)(userId, validatedData);
    console.log("Friend request sent successfully:", {
        friendshipId: result.friendshipId,
        recipientId: result.recipient.id,
    });
    res.status(201).json({
        success: true,
        message: result.message,
        data: result,
    });
};
exports.sendFriendRequest = sendFriendRequest;
/**
 * =============================================================================
 * MANAGE FRIENDSHIP
 * =============================================================================
 *
 * Manages friendship actions: accept, decline, or remove friendships.
 *
 * Route: PUT /api/friends/:friendshipId
 * Auth: Required (authenticateUser middleware)
 * Params: friendshipId (UUID)
 * Body: { action: "accept" | "decline" | "remove" }
 *
 * @param req - AuthenticatedRequest with friendship ID and action
 * @param res - Express response object
 */
const manageFriendship = async (req, res) => {
    console.log("=== MANAGE FRIENDSHIP CONTROLLER START ===");
    const userId = req.user.id;
    const { friendshipId } = req.params;
    console.log("Request details:", { userId, friendshipId, body: req.body });
    // Validate friendshipId parameter
    if (!friendshipId || typeof friendshipId !== "string") {
        throw new error_1.ValidationError("Invalid friendship ID provided");
    }
    // Validate input
    const validatedData = friends_schema_1.manageFriendshipSchema.parse(req.body);
    console.log("Validated input:", validatedData);
    // Delegate to service layer
    const result = await (0, friends_service_1.manageFriendshipService)(userId, friendshipId, validatedData);
    console.log(`Friendship ${validatedData.action} completed successfully:`, {
        friendshipId,
        action: result.action,
    });
    res.status(200).json({
        success: true,
        message: result.message,
        data: result,
    });
};
exports.manageFriendship = manageFriendship;
/**
 * =============================================================================
 * BLOCK/UNBLOCK USER
 * =============================================================================
 *
 * Blocks or unblocks a user.
 *
 * Route: PUT /api/friends/block/:targetUserId
 * Auth: Required (authenticateUser middleware)
 * Params: targetUserId (UUID)
 * Body: { action: "block" | "unblock" }
 *
 * @param req - AuthenticatedRequest with target user ID and action
 * @param res - Express response object
 */
const blockUser = async (req, res) => {
    console.log("=== BLOCK USER CONTROLLER START ===");
    const userId = req.user.id;
    const { targetUserId } = req.params;
    console.log("Request details:", { userId, targetUserId, body: req.body });
    // Validate targetUserId parameter
    if (!targetUserId || typeof targetUserId !== "string") {
        throw new error_1.ValidationError("Invalid target user ID provided");
    }
    // Validate input
    const validatedData = friends_schema_1.blockUserSchema.parse(req.body);
    console.log("Validated input:", validatedData);
    // Delegate to service layer
    const result = await (0, friends_service_1.blockUserService)(userId, targetUserId, validatedData);
    console.log(`User ${validatedData.action} completed successfully:`, {
        targetUserId,
        action: result.action,
    });
    res.status(200).json({
        success: true,
        message: result.message,
        data: result,
    });
};
exports.blockUser = blockUser;
/**
 * =============================================================================
 * GET FRIENDS LIST
 * =============================================================================
 *
 * Retrieves user's friends list with pagination.
 *
 * Route: GET /api/friends/list
 * Auth: Required (authenticateUser middleware)
 * Query: ?limit=20&offset=0
 *
 * @param req - AuthenticatedRequest with pagination params
 * @param res - Express response object
 */
const getFriendsList = async (req, res) => {
    console.log("=== GET FRIENDS LIST CONTROLLER START ===");
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    console.log("Request details:", { userId, limit, offset });
    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
        throw new error_1.ValidationError("Limit must be between 1 and 100");
    }
    if (offset < 0) {
        throw new error_1.ValidationError("Offset must be non-negative");
    }
    // Delegate to service layer
    const result = await (0, friends_service_1.getFriendsListService)(userId, limit, offset);
    console.log(`Friends list retrieved successfully:`, {
        friendsCount: result.friends.length,
        totalCount: result.totalCount,
    });
    res.status(200).json({
        success: true,
        message: "Friends list retrieved successfully",
        data: result,
        pagination: {
            limit,
            offset,
            hasMore: offset + limit < result.totalCount,
        },
    });
};
exports.getFriendsList = getFriendsList;
/**
 * =============================================================================
 * GET FRIEND REQUESTS
 * =============================================================================
 *
 * Retrieves user's sent and received friend requests.
 *
 * Route: GET /api/friends/requests
 * Auth: Required (authenticateUser middleware)
 * Query: ?limit=20&offset=0
 *
 * @param req - AuthenticatedRequest with pagination params
 * @param res - Express response object
 */
const getFriendRequests = async (req, res) => {
    console.log("=== GET FRIEND REQUESTS CONTROLLER START ===");
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    console.log("Request details:", { userId, limit, offset });
    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
        throw new error_1.ValidationError("Limit must be between 1 and 100");
    }
    if (offset < 0) {
        throw new error_1.ValidationError("Offset must be non-negative");
    }
    // Delegate to service layer
    const result = await (0, friends_service_1.getFriendRequestsService)(userId, limit, offset);
    console.log(`Friend requests retrieved successfully:`, {
        sentCount: result.sent.length,
        receivedCount: result.received.length,
        totalSent: result.totalSent,
        totalReceived: result.totalReceived,
    });
    res.status(200).json({
        success: true,
        message: "Friend requests retrieved successfully",
        data: result,
        pagination: {
            limit,
            offset,
            hasMoreSent: offset + limit < result.totalSent,
            hasMoreReceived: offset + limit < result.totalReceived,
        },
    });
};
exports.getFriendRequests = getFriendRequests;
/**
 * =============================================================================
 * SEARCH USERS
 * =============================================================================
 *
 * Searches for users by username/name with friendship status context.
 *
 * Route: GET /api/friends/search
 * Auth: Required (authenticateUser middleware)
 * Query: ?query=search_term&limit=10&offset=0
 *
 * @param req - AuthenticatedRequest with search parameters
 * @param res - Express response object
 */
const searchUsers = async (req, res) => {
    console.log("=== SEARCH USERS CONTROLLER START ===");
    const userId = req.user.id;
    console.log("Request details:", { userId, query: req.query });
    // Validate input using schema
    const validatedQuery = friends_schema_1.searchUsersSchema.parse(req.query);
    console.log("Validated query:", validatedQuery);
    // Delegate to service layer
    const result = await (0, friends_service_1.searchUsersService)(userId, validatedQuery);
    console.log(`User search completed successfully:`, {
        query: result.query,
        resultsCount: result.users.length,
        totalCount: result.totalCount,
        hasMore: result.hasMore,
    });
    res.status(200).json({
        success: true,
        message: "User search completed successfully",
        data: result,
        pagination: {
            limit: validatedQuery.limit,
            offset: validatedQuery.offset,
            hasMore: result.hasMore,
        },
    });
};
exports.searchUsers = searchUsers;
/**
 * =============================================================================
 * GET FRIENDSHIP STATISTICS
 * =============================================================================
 *
 * Retrieves comprehensive friendship statistics for the authenticated user.
 *
 * Route: GET /api/friends/stats
 * Auth: Required (authenticateUser middleware)
 *
 * @param req - AuthenticatedRequest with user data
 * @param res - Express response object
 */
const getFriendshipStats = async (req, res) => {
    console.log("=== GET FRIENDSHIP STATISTICS CONTROLLER START ===");
    const userId = req.user.id;
    console.log("Request details:", { userId });
    // Delegate to service layer
    const result = await (0, friends_service_1.getFriendshipStatsService)(userId);
    console.log("Friendship statistics retrieved successfully:", result);
    res.status(200).json({
        success: true,
        message: "Friendship statistics retrieved successfully",
        data: result,
    });
};
exports.getFriendshipStats = getFriendshipStats;
/**
 * =============================================================================
 * GET FRIEND ACTIVITY STATUS
 * =============================================================================
 *
 * Retrieves activity status for user's friends (online status, current games).
 *
 * Route: GET /api/friends/activity
 * Auth: Required (authenticateUser middleware)
 * Query: ?friendIds=uuid1,uuid2,uuid3 (optional - if not provided, gets all friends)
 *
 * @param req - AuthenticatedRequest with optional friend IDs
 * @param res - Express response object
 */
const getFriendActivity = async (req, res) => {
    console.log("=== GET FRIEND ACTIVITY CONTROLLER START ===");
    const userId = req.user.id;
    const friendIdsParam = req.query.friendIds;
    // Parse friend IDs if provided
    let friendIds;
    if (friendIdsParam) {
        friendIds = friendIdsParam.split(",").filter((id) => id.trim().length > 0);
        console.log("Specific friend IDs requested:", friendIds);
    }
    console.log("Request details:", { userId, friendIdsCount: friendIds?.length || "all" });
    // Delegate to service layer
    const result = await (0, friends_service_1.getFriendActivityService)(userId, friendIds);
    console.log(`Friend activity status retrieved successfully:`, {
        friendsCount: result.length,
        onlineFriends: result.filter((f) => f.isOnline).length,
        friendsInGame: result.filter((f) => f.currentGame).length,
    });
    res.status(200).json({
        success: true,
        message: "Friend activity status retrieved successfully",
        data: {
            friends: result,
            summary: {
                totalFriends: result.length,
                onlineFriends: result.filter((f) => f.isOnline).length,
                friendsInGame: result.filter((f) => f.currentGame).length,
            },
        },
    });
};
exports.getFriendActivity = getFriendActivity;
/**
 * =============================================================================
 * GET USER PROFILE FOR FRIENDSHIP CONTEXT
 * =============================================================================
 *
 * Retrieves another user's public profile with friendship relationship status.
 * This is useful for displaying user profiles in search results or friend lists.
 *
 * Route: GET /api/friends/profile/:userId
 * Auth: Required (authenticateUser middleware)
 * Params: userId (UUID of the user to view)
 *
 * @param req - AuthenticatedRequest with target user ID
 * @param res - Express response object
 */
const getUserProfileWithFriendshipStatus = async (req, res) => {
    console.log("=== GET USER PROFILE WITH FRIENDSHIP STATUS CONTROLLER START ===");
    const currentUserId = req.user.id;
    const { userId: targetUserId } = req.params;
    console.log("Request details:", { currentUserId, targetUserId });
    // Validate targetUserId parameter
    if (!targetUserId || typeof targetUserId !== "string") {
        throw new error_1.ValidationError("Invalid user ID provided");
    }
    // Use search service with specific user to get friendship status
    const searchResult = await (0, friends_service_1.searchUsersService)(currentUserId, {
        query: targetUserId, // This will be used as an ID search
        limit: 1,
        offset: 0,
    });
    // Find the specific user in the search results
    const userProfile = searchResult.users.find((u) => u.id === targetUserId);
    if (!userProfile) {
        throw new error_1.ValidationError("User not found or not available");
    }
    console.log("User profile with friendship status retrieved successfully:", {
        targetUserId,
        friendshipStatus: userProfile.friendshipStatus,
    });
    res.status(200).json({
        success: true,
        message: "User profile retrieved successfully",
        data: {
            user: userProfile,
        },
    });
};
exports.getUserProfileWithFriendshipStatus = getUserProfileWithFriendshipStatus;
