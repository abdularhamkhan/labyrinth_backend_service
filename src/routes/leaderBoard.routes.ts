import { Router } from "express";
import {
  getGlobalLeaderboardController,
  getWeeklyLeaderboardController,
  getDailyLeaderboardController,
  getUserRankController,
  rebuildLeaderboardController,
} from "../controllers/leaderBoard.controller";
import { authenticateUser } from "../middlewares/auth.middleware";
import { asyncHandler } from "../middlewares/error.middleware";

const router = Router();

// =============================================================================
// LEADERBOARD ROUTES
// =============================================================================

// Public leaderboard endpoints (no authentication required)
router.get("/leaderboard/global", asyncHandler(getGlobalLeaderboardController));
router.get("/leaderboard/weekly", asyncHandler(getWeeklyLeaderboardController));
router.get("/leaderboard/daily", asyncHandler(getDailyLeaderboardController));

// Protected endpoints (authentication required)
router.get("/leaderboard/rank/:type", authenticateUser, asyncHandler(getUserRankController));
router.post(
  "/leaderboard/rebuild/:type",
  authenticateUser,
  asyncHandler(rebuildLeaderboardController)
);

export default router;
