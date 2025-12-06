import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { asyncHandler } from "../middlewares/error.middleware";
import {
  getUserRecommendationsController,
  getProjectRecommendationsController,
  handleSwipeController,
  getUserMatchesController,
  getDailySwipeCountController,
  getMatchmakingDashboard,
} from "../controllers/matchmaking.controller";

// =============================================================================
// MATCHMAKING ROUTES - LABYRINTH COLLABORATION PLATFORM
// =============================================================================

const router = Router();

// All matchmaking routes require authentication
router.use(authenticateUser);

// =============================================================================
// USER RECOMMENDATIONS AND MATCHING
// =============================================================================

// Get user recommendations for collaboration
// Usage: GET /api/matchmaking/user-recommendations?limit=20
// Headers: Authorization: Bearer <jwt_token>
router.get("/user-recommendations", asyncHandler(getUserRecommendationsController));

// Get project recommendations for user to join
// Usage: GET /api/matchmaking/project-recommendations?limit=10
// Headers: Authorization: Bearer <jwt_token>
router.get("/project-recommendations", asyncHandler(getProjectRecommendationsController));

// Handle swipe action (like/dislike user or project)
// Usage: POST /api/matchmaking/swipe
// Headers: Authorization: Bearer <jwt_token>
// Body: { targetType: 'user' | 'project', targetId: string, isRightSwipe: boolean }
router.post("/swipe", asyncHandler(handleSwipeController));

// Get user's matches (mutual likes)
// Usage: GET /api/matchmaking/matches
// Headers: Authorization: Bearer <jwt_token>
router.get("/matches", asyncHandler(getUserMatchesController));

// Get daily swipe count and limit
// Usage: GET /api/matchmaking/swipe-count
// Headers: Authorization: Bearer <jwt_token>
router.get("/swipe-count", asyncHandler(getDailySwipeCountController));

// =============================================================================
// MATCHMAKING DASHBOARD
// =============================================================================

// Get comprehensive matchmaking dashboard data
// Usage: GET /api/matchmaking/dashboard
// Headers: Authorization: Bearer <jwt_token>
router.get("/dashboard", asyncHandler(getMatchmakingDashboard));

export default router;
