import z from "zod";

/**
 * =============================================================================
 * LEADERBOARD SCHEMAS - INPUT VALIDATION
 * =============================================================================
 *
 * These schemas validate incoming request data for leaderboard endpoints.
 * Using Zod for runtime type checking and validation.
 *
 * =============================================================================
 */

/**
 * LEADERBOARD QUERY SCHEMA
 *
 * Validates query parameters for leaderboard requests.
 * Used by: leaderboard controllers
 *
 * Optional fields:
 * - limit: Number of results to return (1-100, default: 10)
 * - offset: Number of results to skip (default: 0)
 */
export const leaderboardQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val >= 1 && val <= 100, {
      message: "Limit must be between 1 and 100",
    }),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .refine((val) => val >= 0, {
      message: "Offset must be greater than or equal to 0",
    }),
});

export type LeaderboardQueryInput = z.infer<typeof leaderboardQuerySchema>;

/**
 * UPDATE SCORE SCHEMA
 *
 * Validates score update requests.
 * Used by: score update endpoints
 *
 * Required fields:
 * - score: New score value (must be positive)
 * - gameType: Type of game played
 */
export const updateScoreSchema = z.object({
  score: z.number().int().min(0, "Score must be a positive integer"),
  gameType: z
    .enum(["DAILY_CHALLENGE", "PVP_MATCH", "PVP_COMPUTER", "PRACTICE"])
    .optional()
    .default("PVP_MATCH"),
  gamesWon: z.number().int().min(0, "Games won must be a positive integer").optional(),
  gamesPlayed: z.number().int().min(1, "Games played must be at least 1").optional(),
});

export type UpdateScoreInput = z.infer<typeof updateScoreSchema>;

/**
 * LEADERBOARD TYPE SCHEMA
 *
 * Validates leaderboard type parameters.
 * Used by: rank and rebuild endpoints
 */
export const leaderboardTypeSchema = z.enum(["global", "weekly", "daily"]);

export type LeaderboardType = z.infer<typeof leaderboardTypeSchema>;
