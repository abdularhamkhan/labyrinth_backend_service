"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaderBoard_controller_1 = require("../controllers/leaderBoard.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const error_middleware_1 = require("../middlewares/error.middleware");
const router = (0, express_1.Router)();
// =============================================================================
// LEADERBOARD ROUTES
// =============================================================================
// Public leaderboard endpoints (no authentication required)
router.get("/leaderboard/global", (0, error_middleware_1.asyncHandler)(leaderBoard_controller_1.getGlobalLeaderboardController));
router.get("/leaderboard/weekly", (0, error_middleware_1.asyncHandler)(leaderBoard_controller_1.getWeeklyLeaderboardController));
router.get("/leaderboard/daily", (0, error_middleware_1.asyncHandler)(leaderBoard_controller_1.getDailyLeaderboardController));
// Protected endpoints (authentication required)
router.get("/leaderboard/rank/:type", auth_middleware_1.authenticateUser, (0, error_middleware_1.asyncHandler)(leaderBoard_controller_1.getUserRankController));
router.post("/leaderboard/rebuild/:type", auth_middleware_1.authenticateUser, (0, error_middleware_1.asyncHandler)(leaderBoard_controller_1.rebuildLeaderboardController));
exports.default = router;
