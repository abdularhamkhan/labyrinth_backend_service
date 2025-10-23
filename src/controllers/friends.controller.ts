import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/jwt.middleware";
import { ValidationError } from "../constants/error";
import {
  sendFriendRequestService,
  manageFriendshipService,
  blockUserService,
  getFriendsListService,
  getFriendRequestsService,
  searchUsersService,
  getFriendshipStatsService,
  getFriendActivityService,
} from "../services/friends.service";
import {
  sendFriendRequestSchema,
  manageFriendshipSchema,
  blockUserSchema,
  searchUsersSchema,
} from "../schemas/friends.schema";

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
export const sendFriendRequest = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  console.log("=== SEND FRIEND REQUEST CONTROLLER START ===");

  const userId = req.user!.id;
  console.log("Request details:", { userId, body: req.body });

  // Validate input
  const validatedData = sendFriendRequestSchema.parse(req.body);
  console.log("Validated input:", validatedData);

  // Delegate to service layer
  const result = await sendFriendRequestService(userId, validatedData);

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
export const manageFriendship = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  console.log("=== MANAGE FRIENDSHIP CONTROLLER START ===");

  const userId = req.user!.id;
  const { friendshipId } = req.params;
  console.log("Request details:", { userId, friendshipId, body: req.body });

  // Validate friendshipId parameter
  if (!friendshipId || typeof friendshipId !== "string") {
    throw new ValidationError("Invalid friendship ID provided");
  }

  // Validate input
  const validatedData = manageFriendshipSchema.parse(req.body);
  console.log("Validated input:", validatedData);

  // Delegate to service layer
  const result = await manageFriendshipService(userId, friendshipId, validatedData);

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
export const blockUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  console.log("=== BLOCK USER CONTROLLER START ===");

  const userId = req.user!.id;
  const { targetUserId } = req.params;
  console.log("Request details:", { userId, targetUserId, body: req.body });

  // Validate targetUserId parameter
  if (!targetUserId || typeof targetUserId !== "string") {
    throw new ValidationError("Invalid target user ID provided");
  }

  // Validate input
  const validatedData = blockUserSchema.parse(req.body);
  console.log("Validated input:", validatedData);

  // Delegate to service layer
  const result = await blockUserService(userId, targetUserId, validatedData);

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
export const getFriendsList = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  console.log("=== GET FRIENDS LIST CONTROLLER START ===");

  const userId = req.user!.id;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = parseInt(req.query.offset as string) || 0;

  console.log("Request details:", { userId, limit, offset });

  // Validate pagination parameters
  if (limit < 1 || limit > 100) {
    throw new ValidationError("Limit must be between 1 and 100");
  }
  if (offset < 0) {
    throw new ValidationError("Offset must be non-negative");
  }

  // Delegate to service layer
  const result = await getFriendsListService(userId, limit, offset);

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
export const getFriendRequests = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  console.log("=== GET FRIEND REQUESTS CONTROLLER START ===");

  const userId = req.user!.id;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = parseInt(req.query.offset as string) || 0;

  console.log("Request details:", { userId, limit, offset });

  // Validate pagination parameters
  if (limit < 1 || limit > 100) {
    throw new ValidationError("Limit must be between 1 and 100");
  }
  if (offset < 0) {
    throw new ValidationError("Offset must be non-negative");
  }

  // Delegate to service layer
  const result = await getFriendRequestsService(userId, limit, offset);

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
export const searchUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  console.log("=== SEARCH USERS CONTROLLER START ===");

  const userId = req.user!.id;
  console.log("Request details:", { userId, query: req.query });

  // Validate input using schema
  const validatedQuery = searchUsersSchema.parse(req.query);
  console.log("Validated query:", validatedQuery);

  // Delegate to service layer
  const result = await searchUsersService(userId, validatedQuery);

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
export const getFriendshipStats = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  console.log("=== GET FRIENDSHIP STATISTICS CONTROLLER START ===");

  const userId = req.user!.id;
  console.log("Request details:", { userId });

  // Delegate to service layer
  const result = await getFriendshipStatsService(userId);

  console.log("Friendship statistics retrieved successfully:", result);

  res.status(200).json({
    success: true,
    message: "Friendship statistics retrieved successfully",
    data: result,
  });
};

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
export const getFriendActivity = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  console.log("=== GET FRIEND ACTIVITY CONTROLLER START ===");

  const userId = req.user!.id;
  const friendIdsParam = req.query.friendIds as string;

  // Parse friend IDs if provided
  let friendIds: string[] | undefined;
  if (friendIdsParam) {
    friendIds = friendIdsParam.split(",").filter((id) => id.trim().length > 0);
    console.log("Specific friend IDs requested:", friendIds);
  }

  console.log("Request details:", { userId, friendIdsCount: friendIds?.length || "all" });

  // Delegate to service layer
  const result = await getFriendActivityService(userId, friendIds);

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
export const getUserProfileWithFriendshipStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  console.log("=== GET USER PROFILE WITH FRIENDSHIP STATUS CONTROLLER START ===");

  const currentUserId = req.user!.id;
  const { userId: targetUserId } = req.params;

  console.log("Request details:", { currentUserId, targetUserId });

  // Validate targetUserId parameter
  if (!targetUserId || typeof targetUserId !== "string") {
    throw new ValidationError("Invalid user ID provided");
  }

  // Use search service with specific user to get friendship status
  const searchResult = await searchUsersService(currentUserId, {
    query: targetUserId, // This will be used as an ID search
    limit: 1,
    offset: 0,
  });

  // Find the specific user in the search results
  const userProfile = searchResult.users.find((u) => u.id === targetUserId);

  if (!userProfile) {
    throw new ValidationError("User not found or not available");
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
