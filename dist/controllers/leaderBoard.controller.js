"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rebuildLeaderboardController = exports.getUserRankController = exports.getDailyLeaderboardController = exports.getWeeklyLeaderboardController = exports.getGlobalLeaderboardController = void 0;
const leaderboard_service_1 = require("../services/leaderboard.service");
const leaderboard_schema_1 = require("../schemas/leaderboard.schema");
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
const getGlobalLeaderboardController = async (req, res) => {
    const validatedQuery = leaderboard_schema_1.leaderboardQuerySchema.parse(req.query);
    const leaderboardData = await (0, leaderboard_service_1.getGlobalLeaderboard)(validatedQuery);
    res.status(200).json({
        success: true,
        message: "Global leaderboard retrieved successfully",
        data: leaderboardData,
    });
};
exports.getGlobalLeaderboardController = getGlobalLeaderboardController;
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
const getWeeklyLeaderboardController = async (req, res) => {
    const validatedQuery = leaderboard_schema_1.leaderboardQuerySchema.parse(req.query);
    const leaderboardData = await (0, leaderboard_service_1.getWeeklyLeaderboard)(validatedQuery);
    res.status(200).json({
        success: true,
        message: "Weekly leaderboard retrieved successfully",
        data: leaderboardData,
    });
};
exports.getWeeklyLeaderboardController = getWeeklyLeaderboardController;
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
const getDailyLeaderboardController = async (req, res) => {
    const validatedQuery = leaderboard_schema_1.leaderboardQuerySchema.parse(req.query);
    const leaderboardData = await (0, leaderboard_service_1.getDailyLeaderboard)(validatedQuery);
    res.status(200).json({
        success: true,
        message: "Daily leaderboard retrieved successfully",
        data: leaderboardData,
    });
};
exports.getDailyLeaderboardController = getDailyLeaderboardController;
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
const getUserRankController = async (req, res) => {
    const { type } = req.params;
    const userId = req.user.id;
    const validatedType = leaderboard_schema_1.leaderboardTypeSchema.parse(type);
    const rankData = await (0, leaderboard_service_1.getUserRank)(userId, validatedType);
    res.status(200).json({
        success: true,
        message: "User rank retrieved successfully",
        data: rankData,
    });
};
exports.getUserRankController = getUserRankController;
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
const rebuildLeaderboardController = async (req, res) => {
    const { type } = req.params;
    const validatedType = leaderboard_schema_1.leaderboardTypeSchema.parse(type);
    const result = await (0, leaderboard_service_1.rebuildLeaderboard)(validatedType);
    res.status(200).json({
        success: true,
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} leaderboard rebuilt successfully`,
        data: result,
    });
};
exports.rebuildLeaderboardController = rebuildLeaderboardController;
