import z from "zod";

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
export const sendFriendRequestSchema = z.object({
  recipientId: z
    .string()
    .uuid("Recipient ID must be a valid UUID")
    .min(1, "Recipient ID is required"),
});

export type SendFriendRequestInput = z.infer<typeof sendFriendRequestSchema>;

/**
 * MANAGE FRIENDSHIP SCHEMA
 *
 * Validates friendship management actions.
 * Used by: manageFriendshipController
 *
 * Required fields:
 * - action: The action to perform (accept, decline, remove)
 */
export const manageFriendshipSchema = z.object({
  action: z.enum(["accept", "decline", "remove"], {
    message: "Action must be accept, decline, or remove",
  }),
});

export type ManageFriendshipInput = z.infer<typeof manageFriendshipSchema>;

/**
 * BLOCK USER SCHEMA
 *
 * Validates user blocking/unblocking actions.
 * Used by: blockUserController
 *
 * Required fields:
 * - action: The action to perform (block or unblock)
 */
export const blockUserSchema = z.object({
  action: z.enum(["block", "unblock"], {
    message: "Action must be block or unblock",
  }),
});

export type BlockUserInput = z.infer<typeof blockUserSchema>;

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
export const searchUsersSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(50, "Search query must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9_\s]+$/,
      "Search query can only contain letters, numbers, underscores, and spaces"
    ),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().min(1, "Limit must be at least 1").max(50, "Limit must be at most 50")),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .pipe(z.number().min(0, "Offset must be at least 0")),
});

export type SearchUsersInput = z.infer<typeof searchUsersSchema>;

/**
 * SEND FRIEND REQUEST RESPONSE SCHEMA
 *
 * Schema for friend request API response.
 * Used by: sendFriendRequestController
 */
export const sendFriendRequestResponseSchema = z.object({
  message: z.string(),
  friendshipId: z.string().uuid(),
  status: z.literal("PENDING"),
  recipient: z.object({
    id: z.string().uuid(),
    username: z.string(),
  }),
});

export type SendFriendRequestResponse = z.infer<typeof sendFriendRequestResponseSchema>;

/**
 * MANAGE FRIENDSHIP RESPONSE SCHEMA
 *
 * Schema for friendship management API response.
 * Used by: manageFriendshipController
 */
export const manageFriendshipResponseSchema = z.object({
  message: z.string(),
  friendshipId: z.string().uuid(),
  action: z.enum(["accept", "decline", "remove"]),
  status: z.enum(["ACCEPTED", "REJECTED"]).nullable().optional(),
  friend: z
    .object({
      id: z.string().uuid(),
      username: z.string(),
      avatar: z.string().url().nullable(),
    })
    .optional(),
});

export type ManageFriendshipResponse = z.infer<typeof manageFriendshipResponseSchema>;

/**
 * BLOCK USER RESPONSE SCHEMA
 *
 * Schema for block user API response.
 * Used by: blockUserController
 */
export const blockUserResponseSchema = z.object({
  message: z.string(),
  action: z.enum(["block", "unblock"]),
  targetUser: z.object({
    id: z.string().uuid(),
    username: z.string(),
  }),
  status: z.literal("BLOCKED").nullable().optional(),
});

export type BlockUserResponse = z.infer<typeof blockUserResponseSchema>;
