import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  getGlobalLeaderboard,
  getWeeklyLeaderboard,
  getDailyLeaderboard,
  getUserRank,
  rebuildLeaderboard,
} from "../services/leaderboard.service";
import { leaderboardQuerySchema, leaderboardTypeSchema } from "../schemas/leaderboard.schema";

/**
 * =============================================================================
 * LEADERBOARD CONTROLLERS - RANKING AND STATS
 * =============================================================================
 *
 * These controllers handle leaderboard operations with Redis caching
 * for optimal performance. Supports global, weekly, and daily rankings.
 *
 * =============================================================================
 */

/**
 * =============================================================================
 * GET GLOBAL LEADERBOARD CONTROLLER
 * =============================================================================
 *
 * Retrieves the global leaderboard with top players and their scores.
 * Uses Redis sorted sets for fast retrieval and caching.
 *
 * Route: GET /api/app/leaderboard/global
 * Auth: Optional
 * Query: ?limit=10&offset=0
 *
 * =============================================================================
 */
export const getGlobalLeaderboardController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validatedQuery = leaderboardQuerySchema.parse(req.query);
  const leaderboardData = await getGlobalLeaderboard(validatedQuery);

  res.status(200).json({
    success: true,
    message: "Global leaderboard retrieved successfully",
    data: leaderboardData,
  });
};

/**
 * =============================================================================
 * GET WEEKLY LEADERBOARD CONTROLLER
 * =============================================================================
 *
 * Retrieves the weekly leaderboard for current week.
 * Resets every Monday at midnight UTC.
 *
 * Route: GET /api/app/leaderboard/weekly
 * Auth: Optional
 *
 * =============================================================================
 */
export const getWeeklyLeaderboardController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validatedQuery = leaderboardQuerySchema.parse(req.query);
  const leaderboardData = await getWeeklyLeaderboard(validatedQuery);

  res.status(200).json({
    success: true,
    message: "Weekly leaderboard retrieved successfully",
    data: leaderboardData,
  });
};

/**
 * =============================================================================
 * GET DAILY LEADERBOARD CONTROLLER
 * =============================================================================
 *
 * Retrieves the daily leaderboard for today.
 * Resets every day at midnight UTC.
 *
 * Route: GET /api/app/leaderboard/daily
 * Auth: Optional
 *
 * =============================================================================
 */
export const getDailyLeaderboardController = async (req: Request, res: Response): Promise<void> => {
  const validatedQuery = leaderboardQuerySchema.parse(req.query);
  const leaderboardData = await getDailyLeaderboard(validatedQuery);

  res.status(200).json({
    success: true,
    message: "Daily leaderboard retrieved successfully",
    data: leaderboardData,
  });
};

/**
 * =============================================================================
 * GET USER RANK CONTROLLER
 * =============================================================================
 *
 * Retrieves a specific user's rank in different leaderboard types.
 * Requires authentication to get user ID.
 *
 * Route: GET /api/app/leaderboard/rank/:type
 * Auth: Required
 *
 * =============================================================================
 */
export const getUserRankController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { type } = req.params;
  const userId = req.user!.id;

  const validatedType = leaderboardTypeSchema.parse(type);
  const rankData = await getUserRank(userId, validatedType);

  res.status(200).json({
    success: true,
    message: "User rank retrieved successfully",
    data: rankData,
  });
};

/**
 * =============================================================================
 * REBUILD LEADERBOARD CONTROLLER
 * =============================================================================
 *
 * Rebuilds leaderboard cache from database.
 * Admin-only endpoint for maintenance.
 *
 * Route: POST /api/app/leaderboard/rebuild/:type
 * Auth: Required (Admin only)
 *
 * =============================================================================
 */
export const rebuildLeaderboardController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { type } = req.params;

  const validatedType = leaderboardTypeSchema.parse(type);
  const result = await rebuildLeaderboard(validatedType);

  res.status(200).json({
    success: true,
    message: `${type.charAt(0).toUpperCase() + type.slice(1)} leaderboard rebuilt successfully`,
    data: result,
  });
};
