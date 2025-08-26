"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockUserResponseSchema = exports.manageFriendshipResponseSchema = exports.sendFriendRequestResponseSchema = exports.searchUsersSchema = exports.blockUserSchema = exports.manageFriendshipSchema = exports.sendFriendRequestSchema = void 0;
const zod_1 = __importDefault(require("zod"));
/**
 * =============================================================================
 * FRIENDS SCHEMAS - INPUT VALIDATION
 * =============================================================================
 *
 * These schemas validate incoming request data for friends-related endpoints.
 * Using Zod for runtime type checking and validation.
 *
 * Note: Uses existing FriendshipStatus enum from Prisma schema:
 * - PENDING: Friend request sent but not yet accepted
 * - ACCEPTED: Active friendship
 * - BLOCKED: User blocked
 * - REJECTED: Friend request declined
 *
 * =============================================================================
 */
/**
 * SEND FRIEND REQUEST SCHEMA
 *
 * Validates friend request data.
 * Used by: sendFriendRequestController
 *
 * Required fields:
 * - recipientId: UUID of the user to send friend request to
 */
exports.sendFriendRequestSchema = zod_1.default.object({
    recipientId: zod_1.default
        .string()
        .uuid("Recipient ID must be a valid UUID")
        .min(1, "Recipient ID is required"),
});
/**
 * MANAGE FRIENDSHIP SCHEMA
 *
 * Validates friendship management actions.
 * Used by: manageFriendshipController
 *
 * Required fields:
 * - action: The action to perform (accept, decline, remove)
 */
exports.manageFriendshipSchema = zod_1.default.object({
    action: zod_1.default.enum(["accept", "decline", "remove"], {
        message: "Action must be accept, decline, or remove",
    }),
});
/**
 * BLOCK USER SCHEMA
 *
 * Validates user blocking/unblocking actions.
 * Used by: blockUserController
 *
 * Required fields:
 * - action: The action to perform (block or unblock)
 */
exports.blockUserSchema = zod_1.default.object({
    action: zod_1.default.enum(["block", "unblock"], {
        message: "Action must be block or unblock",
    }),
});
/**
 * SEARCH USERS SCHEMA
 *
 * Validates user search query parameters.
 * Used by: searchUsersController
 *
 * Query parameters:
 * - query: Search term for username/name
 * - limit: Maximum number of results (default 10, max 50)
 * - offset: Number of results to skip (default 0)
 */
exports.searchUsersSchema = zod_1.default.object({
    query: zod_1.default
        .string()
        .min(1, "Search query is required")
        .max(50, "Search query must be less than 50 characters")
        .regex(/^[a-zA-Z0-9_\s]+$/, "Search query can only contain letters, numbers, underscores, and spaces"),
    limit: zod_1.default
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10))
        .pipe(zod_1.default.number().min(1, "Limit must be at least 1").max(50, "Limit must be at most 50")),
    offset: zod_1.default
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 0))
        .pipe(zod_1.default.number().min(0, "Offset must be at least 0")),
});
/**
 * SEND FRIEND REQUEST RESPONSE SCHEMA
 *
 * Schema for friend request API response.
 * Used by: sendFriendRequestController
 */
exports.sendFriendRequestResponseSchema = zod_1.default.object({
    message: zod_1.default.string(),
    friendshipId: zod_1.default.string().uuid(),
    status: zod_1.default.literal("PENDING"),
    recipient: zod_1.default.object({
        id: zod_1.default.string().uuid(),
        username: zod_1.default.string(),
    }),
});
/**
 * MANAGE FRIENDSHIP RESPONSE SCHEMA
 *
 * Schema for friendship management API response.
 * Used by: manageFriendshipController
 */
exports.manageFriendshipResponseSchema = zod_1.default.object({
    message: zod_1.default.string(),
    friendshipId: zod_1.default.string().uuid(),
    action: zod_1.default.enum(["accept", "decline", "remove"]),
    status: zod_1.default.enum(["ACCEPTED", "REJECTED"]).nullable().optional(),
    friend: zod_1.default
        .object({
        id: zod_1.default.string().uuid(),
        username: zod_1.default.string(),
        avatar: zod_1.default.string().url().nullable(),
    })
        .optional(),
});
/**
 * BLOCK USER RESPONSE SCHEMA
 *
 * Schema for block user API response.
 * Used by: blockUserController
 */
exports.blockUserResponseSchema = zod_1.default.object({
    message: zod_1.default.string(),
    action: zod_1.default.enum(["block", "unblock"]),
    targetUser: zod_1.default.object({
        id: zod_1.default.string().uuid(),
        username: zod_1.default.string(),
    }),
    status: zod_1.default.literal("BLOCKED").nullable().optional(),
});
