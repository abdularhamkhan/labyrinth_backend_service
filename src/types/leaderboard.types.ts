/**
 * =============================================================================
 * LEADERBOARD TYPES - INTERNAL SERVICE INTERFACES
 * =============================================================================
 *
 * These interfaces define the internal structure of leaderboard service
 * responses and operations. These are separate from Zod schemas which
 * handle request validation.
 *
 * =============================================================================
 */

/**
 * Represents a player in leaderboard rankings
 */
export interface LeaderboardPlayer {
  rank: number;
  userId: string;
  username: string;
  score: number;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  avatar?: string;
}

/**
 * Complete leaderboard response with metadata
 */
export interface LeaderboardResponse {
  players: LeaderboardPlayer[];
  totalPlayers: number;
  fromCache: boolean;
  lastUpdated: string;
  weekStart?: string;
  weekEnd?: string;
  date?: string;
}

/**
 * User rank information with percentile
 */
export interface UserRankResponse {
  rank: number | null;
  score: number;
  totalPlayers: number;
  percentile?: number;
}

/**
 * Result of leaderboard rebuild operation
 */
export interface RebuildResult {
  success: boolean;
  playersProcessed: number;
  rebuildTime: number;
  type: "global" | "weekly" | "daily";
}

/**
 * Cache key configuration for different leaderboard types
 */
export interface LeaderboardCacheConfig {
  key: string;
  ttl: number;
  type: "global" | "weekly" | "daily";
}
