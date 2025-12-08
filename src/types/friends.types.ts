/**
 * =============================================================================
 * FRIENDS TYPES - COMPLEX INTERFACES AND RESPONSE STRUCTURES
 * =============================================================================
 *
 * These interfaces define complex types used in the friends module that are
 * not direct Zod schema derivatives. For Zod-based types, import from
 * schemas/friends.schema.ts
 *
 * =============================================================================
 */

import type { FriendshipStatus } from "@prisma/client";

/**
 * Friends List Response Structure
 */
export interface FriendsListResponse {
  friends: FriendItem[];
  totalCount: number;
}

/**
 * Enhanced Friend Item with Online Status and Rankings
 */
export interface FriendItem {
  // Basic friend information
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  totalScore: number;

  // Online/offline status
  isOnline: boolean;
  lastActive: string | null; // ISO string

  // Ranking information
  globalRank: number | null;
  weeklyRank: number | null;
  monthlyRank: number | null;

  // Friendship metadata
  friendshipId: string;
  friendsSince: string; // ISO string
  friendshipStatus: "ACCEPTED";
}

/**
 * Friend Requests Response Structure
 */
export interface FriendRequestsResponse {
  sent: FriendRequestItem[];
  received: FriendRequestItem[];
  totalSent: number;
  totalReceived: number;
}

/**
 * Individual Friend Request Item
 */
export interface FriendRequestItem {
  friendshipId: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  createdAt: Date;
  status: FriendshipStatus;
}

/**
 * Search Users Response Structure
 */
export interface SearchUsersResponse {
  users: SearchUserItem[];
  totalCount: number;
  query: string;
  hasMore: boolean;
}

/**
 * Individual Search Result User Item
 */
export interface SearchUserItem {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  totalScore: number;
  friendshipStatus: FriendshipRelationStatus;
}

/**
 * Friendship Relation Status
 * Represents the relationship status between the current user and another user
 */
export type FriendshipRelationStatus =
  | "NONE" // No relationship
  | "PENDING_SENT" // Current user sent friend request
  | "PENDING_RECEIVED" // Current user received friend request
  | "ACCEPTED" // Active friendship
  | "BLOCKED"; // User is blocked

/**
 * Friendship Statistics
 */
export interface FriendshipStats {
  totalFriends: number;
  pendingSent: number;
  pendingReceived: number;
  blockedUsers: number;
}

/**
 * Friend Activity Status
 */
export interface FriendActivityStatus {
  userId: string;
  username: string;
  isOnline: boolean;
  lastSeen: Date | null;
  currentGame?: {
    gameId: string;
    gameType: string;
    status: string;
  };
}
