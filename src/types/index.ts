/**
 * =============================================================================
 * TYPES INDEX - CENTRALIZED TYPE EXPORTS
 * =============================================================================
 *
 * This file provides centralized access to all type definitions used
 * throughout the application. Import types from here rather than
 * individual files for better maintainability.
 *
 * =============================================================================
 */

// Common application types
export * from "./common.types";

// Leaderboard service types
export * from "./leaderboard.types";

// Redis service types
export * from "./redis.types";

// Re-export commonly used Zod-generated types for convenience
export type {
  LeaderboardQueryInput,
  LeaderboardType,
  UpdateScoreInput,
} from "../schemas/leaderboard.schema";

export type {
  UserProfile,
  UpdateProfileInput,
  GetProfileResponse,
  UpdateProfileResponse,
  DeleteUserResponse,
} from "../schemas/user.schema";

export type {
  signupInputTypes,
  loginInputTypes,
  verifyOtpInputTypes,
} from "../schemas/auth.schema";
