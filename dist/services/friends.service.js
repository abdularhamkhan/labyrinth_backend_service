"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFriendActivityService = exports.getFriendshipStatsService = exports.searchUsersService = exports.getFriendRequestsService = exports.getFriendsListService = exports.blockUserService = exports.manageFriendshipService = exports.sendFriendRequestService = void 0;
const prisma_1 = require("../config/prisma");
const redis_1 = require("../config/redis");
const error_1 = require("../constants/error");
const prisma_2 = require("../../prisma/generated/prisma");
/**
 * =============================================================================
 * SEND FRIEND REQUEST SERVICE
 * =============================================================================
 *
 * Sends a friend request to another user.
 *
 * Business Rules:
 * - Cannot send request to yourself
 * - Cannot send duplicate requests
 * - Cannot send request to blocked users
 * - Cannot send request if already friends
 * - Reactivates rejected requests if they exist
 *
 * Usage: Used by sendFriendRequestController
 *
 * =============================================================================
 */
const sendFriendRequestService = async (requesterId, input) => {
    console.log("=== SEND FRIEND REQUEST SERVICE START ===");
    console.log("Input parameters:", { requesterId, recipientId: input.recipientId });
    try {
        const { recipientId } = input;
        // Step 1: Validate that user is not sending request to themselves
        if (requesterId === recipientId) {
            console.error("User attempted to send friend request to themselves");
            throw new error_1.BadRequestError(error_1.FRIENDSHIP_ERRORS.CANNOT_FRIEND_YOURSELF.message, error_1.FRIENDSHIP_ERRORS.CANNOT_FRIEND_YOURSELF.code);
        }
        // Step 2: Check if recipient user exists
        console.log("Step 2: Verifying recipient user exists...");
        const recipient = await prisma_1.prisma.user.findUnique({
            where: { id: recipientId },
            select: { id: true, username: true, status: true },
        });
        if (!recipient) {
            console.error("Recipient user not found:", { recipientId });
            throw new error_1.NotFoundError(error_1.USER_ERRORS.USER_NOT_FOUND.message, error_1.USER_ERRORS.USER_NOT_FOUND.code);
        }
        if (recipient.status !== "ACTIVE") {
            console.error("Recipient user is not active:", { recipientId, status: recipient.status });
            throw new error_1.BadRequestError(error_1.FRIENDSHIP_ERRORS.USER_NOT_AVAILABLE.message, error_1.FRIENDSHIP_ERRORS.USER_NOT_AVAILABLE.code);
        }
        console.log("Recipient user verified:", { recipientId, username: recipient.username });
        // Step 3: Check existing friendship status
        console.log("Step 3: Checking existing friendship status...");
        const existingFriendship = await prisma_1.prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId, receiverId: recipientId },
                    { requesterId: recipientId, receiverId: requesterId },
                ],
            },
        });
        if (existingFriendship) {
            console.log("Existing friendship found:", {
                friendshipId: existingFriendship.id,
                status: existingFriendship.status,
                requester: existingFriendship.requesterId,
                receiver: existingFriendship.receiverId,
            });
            // Handle different existing friendship statuses
            switch (existingFriendship.status) {
                case prisma_2.$Enums.FriendshipStatus.ACCEPTED:
                    throw new error_1.ConflictError(error_1.FRIENDSHIP_ERRORS.ALREADY_FRIENDS.message, error_1.FRIENDSHIP_ERRORS.ALREADY_FRIENDS.code);
                case prisma_2.$Enums.FriendshipStatus.PENDING:
                    if (existingFriendship.requesterId === requesterId) {
                        throw new error_1.ConflictError(error_1.FRIENDSHIP_ERRORS.REQUEST_ALREADY_SENT.message, error_1.FRIENDSHIP_ERRORS.REQUEST_ALREADY_SENT.code);
                    }
                    else {
                        throw new error_1.ConflictError(error_1.FRIENDSHIP_ERRORS.REQUEST_ALREADY_RECEIVED.message, error_1.FRIENDSHIP_ERRORS.REQUEST_ALREADY_RECEIVED.code);
                    }
                case prisma_2.$Enums.FriendshipStatus.BLOCKED:
                    const blocker = existingFriendship.requesterId === requesterId ? "you" : "them";
                    throw new error_1.BadRequestError(`Cannot send friend request - ${blocker === "you" ? "you have blocked this user" : "this user has blocked you"}`, error_1.FRIENDSHIP_ERRORS.USER_BLOCKED.code);
                case prisma_2.$Enums.FriendshipStatus.REJECTED:
                    // Allow reactivating rejected requests
                    console.log("Reactivating rejected friend request...");
                    const reactivatedFriendship = await prisma_1.prisma.friendship.update({
                        where: { id: existingFriendship.id },
                        data: {
                            status: prisma_2.$Enums.FriendshipStatus.PENDING,
                            requesterId,
                            receiverId: recipientId,
                            updatedAt: new Date(),
                        },
                    });
                    console.log("Friend request reactivated successfully");
                    return {
                        message: "Friend request sent successfully",
                        friendshipId: reactivatedFriendship.id,
                        status: "PENDING",
                        recipient: {
                            id: recipient.id,
                            username: recipient.username,
                        },
                    };
            }
        }
        // Step 4: Create new friend request
        console.log("Step 4: Creating new friend request...");
        const newFriendship = await prisma_1.prisma.friendship.create({
            data: {
                requesterId,
                receiverId: recipientId,
                status: prisma_2.FriendshipStatus.PENDING,
            },
        });
        console.log("Friend request created successfully:", {
            friendshipId: newFriendship.id,
            status: newFriendship.status,
        });
        return {
            message: "Friend request sent successfully",
            friendshipId: newFriendship.id,
            status: "PENDING",
            recipient: {
                id: recipient.id,
                username: recipient.username,
            },
        };
    }
    catch (error) {
        console.error("Send friend request service threw exception:", error);
        throw error;
    }
};
exports.sendFriendRequestService = sendFriendRequestService;
/**
 * =============================================================================
 * MANAGE FRIENDSHIP SERVICE
 * =============================================================================
 *
 * Manages friendship actions: accept, decline, or remove.
 *
 * Business Rules:
 * - Accept: Only pending requests can be accepted by receiver
 * - Decline: Only pending requests can be declined by receiver
 * - Remove: Only accepted friendships can be removed by either party
 *
 * Usage: Used by manageFriendshipController
 *
 * =============================================================================
 */
const manageFriendshipService = async (userId, friendshipId, input) => {
    console.log("=== MANAGE FRIENDSHIP SERVICE START ===");
    console.log("Input parameters:", { userId, friendshipId, action: input.action });
    try {
        const { action } = input;
        // Step 1: Find and validate friendship
        console.log("Step 1: Finding and validating friendship...");
        const friendship = await prisma_1.prisma.friendship.findUnique({
            where: { id: friendshipId },
            include: {
                requester: { select: { id: true, username: true, avatar: true } },
                receiver: { select: { id: true, username: true, avatar: true } },
            },
        });
        if (!friendship) {
            console.error("Friendship not found:", { friendshipId });
            throw new error_1.NotFoundError(error_1.FRIENDSHIP_ERRORS.FRIENDSHIP_NOT_FOUND.message, error_1.FRIENDSHIP_ERRORS.FRIENDSHIP_NOT_FOUND.code);
        }
        console.log("Friendship found:", {
            friendshipId: friendship.id,
            status: friendship.status,
            requester: friendship.requester.username,
            receiver: friendship.receiver.username,
        });
        // Step 2: Validate user permissions for action
        console.log("Step 2: Validating user permissions...");
        const isRequester = friendship.requesterId === userId;
        const isReceiver = friendship.receiverId === userId;
        if (!isRequester && !isReceiver) {
            console.error("User not part of this friendship:", { userId, friendshipId });
            throw new error_1.BadRequestError(error_1.FRIENDSHIP_ERRORS.NOT_AUTHORIZED.message, error_1.FRIENDSHIP_ERRORS.NOT_AUTHORIZED.code);
        }
        // Step 3: Handle different actions
        console.log(`Step 3: Processing ${action} action...`);
        switch (action) {
            case "accept":
                // Only receiver can accept pending requests
                if (friendship.status !== prisma_2.FriendshipStatus.PENDING) {
                    throw new error_1.BadRequestError(error_1.FRIENDSHIP_ERRORS.INVALID_STATUS_TRANSITION.message, error_1.FRIENDSHIP_ERRORS.INVALID_STATUS_TRANSITION.code);
                }
                if (!isReceiver) {
                    throw new error_1.BadRequestError("Only the request receiver can accept friend requests", error_1.FRIENDSHIP_ERRORS.NOT_AUTHORIZED.code);
                }
                const acceptedFriendship = await prisma_1.prisma.friendship.update({
                    where: { id: friendshipId },
                    data: { status: prisma_2.FriendshipStatus.ACCEPTED, updatedAt: new Date() },
                });
                console.log("Friend request accepted successfully");
                return {
                    message: "Friend request accepted successfully",
                    friendshipId,
                    action: "accept",
                    status: "ACCEPTED",
                    friend: isReceiver ? friendship.requester : friendship.receiver,
                };
            case "decline":
                // Only receiver can decline pending requests
                if (friendship.status !== prisma_2.FriendshipStatus.PENDING) {
                    throw new error_1.BadRequestError(error_1.FRIENDSHIP_ERRORS.INVALID_STATUS_TRANSITION.message, error_1.FRIENDSHIP_ERRORS.INVALID_STATUS_TRANSITION.code);
                }
                if (!isReceiver) {
                    throw new error_1.BadRequestError("Only the request receiver can decline friend requests", error_1.FRIENDSHIP_ERRORS.NOT_AUTHORIZED.code);
                }
                const declinedFriendship = await prisma_1.prisma.friendship.update({
                    where: { id: friendshipId },
                    data: { status: prisma_2.FriendshipStatus.REJECTED, updatedAt: new Date() },
                });
                console.log("Friend request declined successfully");
                return {
                    message: "Friend request declined successfully",
                    friendshipId,
                    action: "decline",
                    status: "REJECTED",
                };
            case "remove":
                // Only accepted friendships can be removed
                if (friendship.status !== prisma_2.FriendshipStatus.ACCEPTED) {
                    throw new error_1.BadRequestError("Can only remove active friendships", error_1.FRIENDSHIP_ERRORS.INVALID_STATUS_TRANSITION.code);
                }
                // Delete the friendship record
                await prisma_1.prisma.friendship.delete({
                    where: { id: friendshipId },
                });
                console.log("Friendship removed successfully");
                return {
                    message: "Friendship removed successfully",
                    friendshipId,
                    action: "remove",
                };
            default:
                throw new error_1.ValidationError("Invalid action. Must be accept, decline, or remove", error_1.VALIDATION_ERRORS.INVALID_INPUT.code);
        }
    }
    catch (error) {
        console.error("Manage friendship service threw exception:", error);
        throw error;
    }
};
exports.manageFriendshipService = manageFriendshipService;
/**
 * =============================================================================
 * BLOCK USER SERVICE
 * =============================================================================
 *
 * Blocks or unblocks a user.
 *
 * Business Rules:
 * - Block: Creates/updates friendship record with BLOCKED status
 * - Unblock: Updates BLOCKED status to REJECTED (soft unblock)
 * - Removes any active friendship when blocking
 *
 * Usage: Used by blockUserController
 *
 * =============================================================================
 */
const blockUserService = async (blockerId, targetUserId, input) => {
    console.log("=== BLOCK USER SERVICE START ===");
    console.log("Input parameters:", { blockerId, targetUserId, action: input.action });
    try {
        const { action } = input;
        // Step 1: Validate that user is not blocking themselves
        if (blockerId === targetUserId) {
            console.error("User attempted to block themselves");
            throw new error_1.BadRequestError("Cannot block yourself", error_1.FRIENDSHIP_ERRORS.CANNOT_FRIEND_YOURSELF.code);
        }
        // Step 2: Check if target user exists
        console.log("Step 2: Verifying target user exists...");
        const targetUser = await prisma_1.prisma.user.findUnique({
            where: { id: targetUserId },
            select: { id: true, username: true, status: true },
        });
        if (!targetUser) {
            console.error("Target user not found:", { targetUserId });
            throw new error_1.NotFoundError(error_1.USER_ERRORS.USER_NOT_FOUND.message, error_1.USER_ERRORS.USER_NOT_FOUND.code);
        }
        console.log("Target user verified:", { targetUserId, username: targetUser.username });
        // Step 3: Check existing friendship
        console.log("Step 3: Checking existing friendship...");
        const existingFriendship = await prisma_1.prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId: blockerId, receiverId: targetUserId },
                    { requesterId: targetUserId, receiverId: blockerId },
                ],
            },
        });
        if (action === "block") {
            console.log("Processing block action...");
            if (existingFriendship) {
                // Update existing friendship to blocked
                await prisma_1.prisma.friendship.update({
                    where: { id: existingFriendship.id },
                    data: {
                        status: prisma_2.FriendshipStatus.BLOCKED,
                        requesterId: blockerId, // Ensure blocker is the requester
                        receiverId: targetUserId,
                        updatedAt: new Date(),
                    },
                });
                console.log("Updated existing friendship to blocked status");
            }
            else {
                // Create new blocked relationship
                await prisma_1.prisma.friendship.create({
                    data: {
                        requesterId: blockerId,
                        receiverId: targetUserId,
                        status: prisma_2.FriendshipStatus.BLOCKED,
                    },
                });
                console.log("Created new blocked relationship");
            }
            return {
                message: "User blocked successfully",
                action: "block",
                targetUser: {
                    id: targetUser.id,
                    username: targetUser.username,
                },
                status: "BLOCKED",
            };
        }
        else if (action === "unblock") {
            console.log("Processing unblock action...");
            if (!existingFriendship || existingFriendship.status !== prisma_2.FriendshipStatus.BLOCKED) {
                throw new error_1.BadRequestError("User is not currently blocked", error_1.FRIENDSHIP_ERRORS.USER_NOT_BLOCKED.code);
            }
            // Check if current user is the one who blocked
            if (existingFriendship.requesterId !== blockerId) {
                throw new error_1.BadRequestError("You can only unblock users you have blocked", error_1.FRIENDSHIP_ERRORS.NOT_AUTHORIZED.code);
            }
            // Update to rejected status (soft unblock)
            await prisma_1.prisma.friendship.update({
                where: { id: existingFriendship.id },
                data: {
                    status: prisma_2.FriendshipStatus.REJECTED,
                    updatedAt: new Date(),
                },
            });
            console.log("User unblocked successfully");
            return {
                message: "User unblocked successfully",
                action: "unblock",
                targetUser: {
                    id: targetUser.id,
                    username: targetUser.username,
                },
            };
        }
        throw new error_1.ValidationError("Invalid action. Must be block or unblock", error_1.VALIDATION_ERRORS.INVALID_INPUT.code);
    }
    catch (error) {
        console.error("Block user service threw exception:", error);
        throw error;
    }
};
exports.blockUserService = blockUserService;
/**
 * =============================================================================
 * GET FRIENDS LIST SERVICE - ENHANCED WITH ONLINE STATUS & RANKS
 * =============================================================================
 *
 * Retrieves user's friends list with pagination, including:
 * - Online/offline status from Redis presence system
 * - Global ranking from leaderboard system
 * - Complete friend profile information
 *
 * Returns: List of accepted friendships with comprehensive friend details
 *
 * Usage: Used by getFriendsListController
 *
 * =============================================================================
 */
const getFriendsListService = async (userId, limit = 20, offset = 0) => {
    console.log("=== GET FRIENDS LIST SERVICE START ===");
    console.log("Input parameters:", { userId, limit, offset });
    try {
        // Get total count
        const totalCount = await prisma_1.prisma.friendship.count({
            where: {
                OR: [
                    { requesterId: userId, status: prisma_2.FriendshipStatus.ACCEPTED },
                    { receiverId: userId, status: prisma_2.FriendshipStatus.ACCEPTED },
                ],
            },
        });
        // Get friends with pagination and enhanced profile data
        const friendships = await prisma_1.prisma.friendship.findMany({
            where: {
                OR: [
                    { requesterId: userId, status: prisma_2.FriendshipStatus.ACCEPTED },
                    { receiverId: userId, status: prisma_2.FriendshipStatus.ACCEPTED },
                ],
            },
            include: {
                requester: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        totalScore: true,
                        lastActive: true,
                        // Include leaderboard data for ranking
                        leaderboardEntry: {
                            select: {
                                globalRank: true,
                                weeklyRank: true,
                                monthlyRank: true,
                            },
                        },
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        totalScore: true,
                        lastActive: true,
                        // Include leaderboard data for ranking
                        leaderboardEntry: {
                            select: {
                                globalRank: true,
                                weeklyRank: true,
                                monthlyRank: true,
                            },
                        },
                    },
                },
            },
            orderBy: { updatedAt: "desc" },
            take: limit,
            skip: offset,
        });
        // Extract friend user IDs for presence checking
        const friendUserIds = friendships.map((friendship) => {
            return friendship.requesterId === userId ? friendship.receiverId : friendship.requesterId;
        });
        // Get online status for all friends from Redis
        const onlineStatuses = await Promise.all(friendUserIds.map(async (friendUserId) => {
            try {
                const isOnlineScore = await redis_1.redis.zscore("presence:online", friendUserId);
                return {
                    userId: friendUserId,
                    isOnline: isOnlineScore !== null,
                    lastOnlineTimestamp: isOnlineScore ? parseInt(isOnlineScore.toString()) : null,
                };
            }
            catch (error) {
                console.error(`Failed to check online status for user ${friendUserId}:`, error);
                return {
                    userId: friendUserId,
                    isOnline: false,
                    lastOnlineTimestamp: null,
                };
            }
        }));
        // Create lookup map for online status
        const onlineStatusMap = new Map(onlineStatuses.map((status) => [status.userId, status]));
        // Build enhanced friends list with online status and ranks
        const friends = friendships.map((friendship) => {
            const friend = friendship.requesterId === userId ? friendship.receiver : friendship.requester;
            const onlineStatus = onlineStatusMap.get(friend.id);
            return {
                id: friend.id,
                username: friend.username,
                firstName: friend.firstName,
                lastName: friend.lastName,
                avatar: friend.avatar,
                totalScore: friend.totalScore,
                // Online/offline status with detailed information
                isOnline: onlineStatus?.isOnline || false,
                lastActive: friend.lastActive?.toISOString() || null,
                // Ranking information
                globalRank: friend.leaderboardEntry?.globalRank || null,
                weeklyRank: friend.leaderboardEntry?.weeklyRank || null,
                monthlyRank: friend.leaderboardEntry?.monthlyRank || null,
                // Friendship metadata
                friendshipId: friendship.id,
                friendsSince: friendship.updatedAt.toISOString(),
                friendshipStatus: "ACCEPTED",
            };
        });
        console.log(`Retrieved ${friends.length} friends out of ${totalCount} total`);
        console.log("Online status summary:", {
            totalFriends: friends.length,
            onlineFriends: friends.filter((f) => f.isOnline).length,
            offlineFriends: friends.filter((f) => !f.isOnline).length,
        });
        return {
            friends,
            totalCount,
        };
    }
    catch (error) {
        console.error("Get friends list service threw exception:", error);
        throw error;
    }
};
exports.getFriendsListService = getFriendsListService;
/**
 * =============================================================================
 * GET FRIEND REQUESTS SERVICE
 * =============================================================================
 *
 * Retrieves user's sent and received friend requests.
 *
 * Returns: Separate lists for sent and received pending requests
 *
 * Usage: Used by getFriendRequestsController
 *
 * =============================================================================
 */
const getFriendRequestsService = async (userId, limit = 20, offset = 0) => {
    console.log("=== GET FRIEND REQUESTS SERVICE START ===");
    console.log("Input parameters:", { userId, limit, offset });
    try {
        // Get sent requests
        const [sentRequests, totalSent] = await Promise.all([
            prisma_1.prisma.friendship.findMany({
                where: {
                    requesterId: userId,
                    status: prisma_2.FriendshipStatus.PENDING,
                },
                include: {
                    receiver: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            avatar: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: limit,
                skip: offset,
            }),
            prisma_1.prisma.friendship.count({
                where: {
                    requesterId: userId,
                    status: prisma_2.FriendshipStatus.PENDING,
                },
            }),
        ]);
        // Get received requests
        const [receivedRequests, totalReceived] = await Promise.all([
            prisma_1.prisma.friendship.findMany({
                where: {
                    receiverId: userId,
                    status: prisma_2.FriendshipStatus.PENDING,
                },
                include: {
                    requester: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            avatar: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: limit,
                skip: offset,
            }),
            prisma_1.prisma.friendship.count({
                where: {
                    receiverId: userId,
                    status: prisma_2.FriendshipStatus.PENDING,
                },
            }),
        ]);
        const sent = sentRequests.map((request) => ({
            friendshipId: request.id,
            user: request.receiver,
            createdAt: request.createdAt,
            status: "PENDING",
        }));
        const received = receivedRequests.map((request) => ({
            friendshipId: request.id,
            user: request.requester,
            createdAt: request.createdAt,
            status: "PENDING",
        }));
        console.log(`Retrieved ${sent.length} sent and ${received.length} received requests`);
        return {
            sent,
            received,
            totalSent,
            totalReceived,
        };
    }
    catch (error) {
        console.error("Get friend requests service threw exception:", error);
        throw error;
    }
};
exports.getFriendRequestsService = getFriendRequestsService;
/**
 * =============================================================================
 * SEARCH USERS SERVICE
 * =============================================================================
 *
 * Searches for users by username/name with friendship status.
 *
 * Returns: Users matching search with their relationship status to current user
 *
 * Usage: Used by searchUsersController
 *
 * =============================================================================
 */
const searchUsersService = async (currentUserId, input) => {
    console.log("=== SEARCH USERS SERVICE START ===");
    console.log("Input parameters:", { currentUserId, input });
    try {
        const { query, limit, offset } = input;
        // Search users (excluding current user)
        const users = await prisma_1.prisma.user.findMany({
            where: {
                AND: [
                    { id: { not: currentUserId } },
                    { status: "ACTIVE" },
                    {
                        OR: [
                            { username: { contains: query, mode: "insensitive" } },
                            { firstName: { contains: query, mode: "insensitive" } },
                            { lastName: { contains: query, mode: "insensitive" } },
                        ],
                    },
                ],
            },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                totalScore: true,
            },
            orderBy: [{ username: "asc" }, { totalScore: "desc" }],
            take: limit,
            skip: offset,
        });
        // Get friendship statuses for all found users
        const userIds = users.map((user) => user.id);
        const friendships = await prisma_1.prisma.friendship.findMany({
            where: {
                OR: [
                    { requesterId: currentUserId, receiverId: { in: userIds } },
                    { requesterId: { in: userIds }, receiverId: currentUserId },
                ],
            },
            select: {
                requesterId: true,
                receiverId: true,
                status: true,
            },
        });
        // Map friendship statuses
        const friendshipMap = new Map();
        friendships.forEach((friendship) => {
            const otherUserId = friendship.requesterId === currentUserId ? friendship.receiverId : friendship.requesterId;
            let relationStatus;
            switch (friendship.status) {
                case prisma_2.FriendshipStatus.ACCEPTED:
                    relationStatus = "ACCEPTED";
                    break;
                case prisma_2.FriendshipStatus.BLOCKED:
                    relationStatus = "BLOCKED";
                    break;
                case prisma_2.FriendshipStatus.PENDING:
                    relationStatus =
                        friendship.requesterId === currentUserId ? "PENDING_SENT" : "PENDING_RECEIVED";
                    break;
                default:
                    relationStatus = "NONE";
            }
            friendshipMap.set(otherUserId, relationStatus);
        });
        // Build response
        const searchResults = users.map((user) => ({
            ...user,
            friendshipStatus: friendshipMap.get(user.id) || "NONE",
        }));
        // Get total count for pagination
        const totalCount = await prisma_1.prisma.user.count({
            where: {
                AND: [
                    { id: { not: currentUserId } },
                    { status: "ACTIVE" },
                    {
                        OR: [
                            { username: { contains: query, mode: "insensitive" } },
                            { firstName: { contains: query, mode: "insensitive" } },
                            { lastName: { contains: query, mode: "insensitive" } },
                        ],
                    },
                ],
            },
        });
        console.log(`Found ${searchResults.length} users out of ${totalCount} total`);
        return {
            users: searchResults,
            totalCount,
            query,
            hasMore: offset + limit < totalCount,
        };
    }
    catch (error) {
        console.error("Search users service threw exception:", error);
        throw error;
    }
};
exports.searchUsersService = searchUsersService;
/**
 * =============================================================================
 * GET FRIENDSHIP STATISTICS SERVICE
 * =============================================================================
 *
 * Retrieves friendship statistics for a user.
 *
 * Returns: Counts of friends, pending requests, blocked users
 *
 * Usage: Used by getFriendshipStatsController
 *
 * =============================================================================
 */
const getFriendshipStatsService = async (userId) => {
    console.log("=== GET FRIENDSHIP STATISTICS SERVICE START ===");
    console.log("Input parameters:", { userId });
    try {
        const [totalFriends, pendingSent, pendingReceived, blockedUsers] = await Promise.all([
            // Total friends (accepted friendships)
            prisma_1.prisma.friendship.count({
                where: {
                    OR: [
                        { requesterId: userId, status: prisma_2.FriendshipStatus.ACCEPTED },
                        { receiverId: userId, status: prisma_2.FriendshipStatus.ACCEPTED },
                    ],
                },
            }),
            // Pending requests sent by user
            prisma_1.prisma.friendship.count({
                where: {
                    requesterId: userId,
                    status: prisma_2.FriendshipStatus.PENDING,
                },
            }),
            // Pending requests received by user
            prisma_1.prisma.friendship.count({
                where: {
                    receiverId: userId,
                    status: prisma_2.FriendshipStatus.PENDING,
                },
            }),
            // Users blocked by this user
            prisma_1.prisma.friendship.count({
                where: {
                    requesterId: userId,
                    status: prisma_2.FriendshipStatus.BLOCKED,
                },
            }),
        ]);
        const stats = {
            totalFriends,
            pendingSent,
            pendingReceived,
            blockedUsers,
        };
        console.log("Friendship statistics retrieved:", stats);
        return stats;
    }
    catch (error) {
        console.error("Get friendship statistics service threw exception:", error);
        throw error;
    }
};
exports.getFriendshipStatsService = getFriendshipStatsService;
/**
 * =============================================================================
 * GET FRIEND ACTIVITY STATUS SERVICE
 * =============================================================================
 *
 * Retrieves activity status for user's friends.
 *
 * Returns: Online status and current game information for friends
 *
 * Usage: Used by getFriendActivityController
 *
 * =============================================================================
 */
const getFriendActivityService = async (userId, friendIds) => {
    console.log("=== GET FRIEND ACTIVITY SERVICE START ===");
    console.log("Input parameters:", { userId, friendIdsCount: friendIds?.length || "all" });
    try {
        // Get friend IDs if not provided
        let targetFriendIds = friendIds;
        if (!friendIds || friendIds.length === 0) {
            const friendships = await prisma_1.prisma.friendship.findMany({
                where: {
                    OR: [
                        { requesterId: userId, status: prisma_2.FriendshipStatus.ACCEPTED },
                        { receiverId: userId, status: prisma_2.FriendshipStatus.ACCEPTED },
                    ],
                },
                select: {
                    requesterId: true,
                    receiverId: true,
                },
            });
            targetFriendIds = friendships.map((friendship) => friendship.requesterId === userId ? friendship.receiverId : friendship.requesterId);
        }
        if (!targetFriendIds || targetFriendIds.length === 0) {
            console.log("No friends found for activity check");
            return [];
        }
        // Get friend basic info and last activity
        const friends = await prisma_1.prisma.user.findMany({
            where: {
                id: { in: targetFriendIds },
                status: "ACTIVE",
            },
            select: {
                id: true,
                username: true,
                lastActive: true,
            },
        });
        // Get current game sessions for friends
        const currentGames = await prisma_1.prisma.gameParticipant.findMany({
            where: {
                userId: { in: targetFriendIds },
                gameSession: {
                    status: { in: ["WAITING", "IN_PROGRESS"] },
                },
            },
            include: {
                gameSession: {
                    select: {
                        id: true,
                        gameType: true,
                        status: true,
                    },
                },
            },
        });
        // Build activity status response
        const activityStatus = friends.map((friend) => {
            const currentGame = currentGames.find((game) => game.userId === friend.id);
            const lastSeenThreshold = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes
            const isOnline = friend.lastActive && friend.lastActive > lastSeenThreshold;
            return {
                userId: friend.id,
                username: friend.username,
                isOnline: !!isOnline,
                lastSeen: friend.lastActive,
                currentGame: currentGame
                    ? {
                        gameId: currentGame.gameSession.id,
                        gameType: currentGame.gameSession.gameType,
                        status: currentGame.gameSession.status,
                    }
                    : undefined,
            };
        });
        console.log(`Retrieved activity status for ${activityStatus.length} friends`);
        return activityStatus;
    }
    catch (error) {
        console.error("Get friend activity service threw exception:", error);
        throw error;
    }
};
exports.getFriendActivityService = getFriendActivityService;
