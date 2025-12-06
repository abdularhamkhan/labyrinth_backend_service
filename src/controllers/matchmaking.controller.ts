import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/jwt.middleware";
import {
  getUserRecommendations,
  getProjectRecommendations,
  handleSwipeAction,
  getUserMatches,
  getDailySwipeCount,
} from "../services/matchmaking.service";
import { ValidationError } from "../constants/error";

// =============================================================================
// MATCHMAKING CONTROLLERS - LABYRINTH COLLABORATION PLATFORM
// =============================================================================

/**
 * GET USER RECOMMENDATIONS
 * Route: GET /api/matchmaking/user-recommendations
 * Auth: Required
 * Query: ?limit=20
 */
export const getUserRecommendationsController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const limit = parseInt(req.query.limit as string) || 20;

  if (limit < 1 || limit > 50) {
    throw new ValidationError("Limit must be between 1 and 50");
  }

  const recommendations = await getUserRecommendations(userId, limit);

  res.status(200).json({
    success: true,
    message: "User recommendations retrieved successfully",
    data: {
      recommendations,
      count: recommendations.length,
    },
  });
};

/**
 * GET PROJECT RECOMMENDATIONS
 * Route: GET /api/matchmaking/project-recommendations
 * Auth: Required
 * Query: ?limit=10
 */
export const getProjectRecommendationsController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const limit = parseInt(req.query.limit as string) || 10;

  if (limit < 1 || limit > 30) {
    throw new ValidationError("Limit must be between 1 and 30");
  }

  const recommendations = await getProjectRecommendations(userId, limit);

  res.status(200).json({
    success: true,
    message: "Project recommendations retrieved successfully",
    data: {
      recommendations,
      count: recommendations.length,
    },
  });
};

/**
 * HANDLE SWIPE ACTION
 * Route: POST /api/matchmaking/swipe
 * Auth: Required
 * Body: { targetType: 'user' | 'project', targetId: string, isRightSwipe: boolean }
 */
export const handleSwipeController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { targetType, targetId, isRightSwipe } = req.body;

  if (!targetType || !targetId || typeof isRightSwipe !== "boolean") {
    throw new ValidationError("targetType, targetId, and isRightSwipe are required");
  }

  if (targetType !== "user" && targetType !== "project") {
    throw new ValidationError("targetType must be 'user' or 'project'");
  }

  if (typeof targetId !== "string" || targetId.length === 0) {
    throw new ValidationError("targetId must be a valid string");
  }

  const result = await handleSwipeAction(userId, targetType, targetId, isRightSwipe);

  res.status(200).json({
    success: true,
    message: result.matched ? "Swipe successful - Match created!" : "Swipe recorded successfully",
    data: {
      swiped: true,
      matched: result.matched,
      matchId: result.matchId,
      targetType,
      targetId,
      isRightSwipe,
    },
  });
};

/**
 * GET USER MATCHES
 * Route: GET /api/matchmaking/matches
 * Auth: Required
 */
export const getUserMatchesController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  const matches = await getUserMatches(userId);

  res.status(200).json({
    success: true,
    message: "User matches retrieved successfully",
    data: {
      matches,
      count: matches.length,
    },
  });
};

/**
 * GET DAILY SWIPE COUNT
 * Route: GET /api/matchmaking/swipe-count
 * Auth: Required
 */
export const getDailySwipeCountController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  const swipeData = await getDailySwipeCount(userId);

  res.status(200).json({
    success: true,
    message: "Daily swipe count retrieved successfully",
    data: {
      dailyCount: swipeData.count,
      dailyLimit: swipeData.limit,
      remaining: swipeData.limit - swipeData.count,
      canSwipe: swipeData.count < swipeData.limit,
    },
  });
};

/**
 * GET MATCHMAKING DASHBOARD
 * Route: GET /api/matchmaking/dashboard
 * Auth: Required
 */
export const getMatchmakingDashboard = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  // Get all matchmaking data in parallel
  const [userRecommendations, projectRecommendations, matches, swipeData] = await Promise.all([
    getUserRecommendations(userId, 10),
    getProjectRecommendations(userId, 5),
    getUserMatches(userId),
    getDailySwipeCount(userId),
  ]);

  res.status(200).json({
    success: true,
    message: "Matchmaking dashboard data retrieved successfully",
    data: {
      userRecommendations: {
        users: userRecommendations,
        count: userRecommendations.length,
      },
      projectRecommendations: {
        projects: projectRecommendations,
        count: projectRecommendations.length,
      },
      matches: {
        matches,
        count: matches.length,
      },
      swipeStatus: {
        dailyCount: swipeData.count,
        dailyLimit: swipeData.limit,
        remaining: swipeData.limit - swipeData.count,
        canSwipe: swipeData.count < swipeData.limit,
      },
    },
  });
};
