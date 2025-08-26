"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardTypeSchema = exports.updateScoreSchema = exports.leaderboardQuerySchema = void 0;
const zod_1 = __importDefault(require("zod"));
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
exports.leaderboardQuerySchema = zod_1.default.object({
    limit: zod_1.default
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10))
        .refine((val) => val >= 1 && val <= 100, {
        message: "Limit must be between 1 and 100",
    }),
    offset: zod_1.default
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 0))
        .refine((val) => val >= 0, {
        message: "Offset must be greater than or equal to 0",
    }),
});
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
exports.updateScoreSchema = zod_1.default.object({
    score: zod_1.default.number().int().min(0, "Score must be a positive integer"),
    gameType: zod_1.default
        .enum(["DAILY_CHALLENGE", "PVP_MATCH", "PVP_COMPUTER", "PRACTICE"])
        .optional()
        .default("PVP_MATCH"),
    gamesWon: zod_1.default.number().int().min(0, "Games won must be a positive integer").optional(),
    gamesPlayed: zod_1.default.number().int().min(1, "Games played must be at least 1").optional(),
});
/**
 * LEADERBOARD TYPE SCHEMA
 *
 * Validates leaderboard type parameters.
 * Used by: rank and rebuild endpoints
 */
exports.leaderboardTypeSchema = zod_1.default.enum(["global", "weekly", "daily"]);
