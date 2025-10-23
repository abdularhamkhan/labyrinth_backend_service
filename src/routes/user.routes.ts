import { Router } from "express";
import {
  authenticateUser,
  optionalAuth,
  requireRole,
} from "../middlewares/auth.middleware";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  uploadUserAvatar,
  removeUserAvatar,
  getLabyrinthProfile,
  updateLabyrinthProfile,
  updateUserTechStack,
  updateUserDemographic,
  updatePreferences,
  getWorkspaces,
  getCollaborationStats,
  getFullUserProfile,
} from "../controllers/user.controller";
import { uploadAvatar, handleUploadError } from "../middlewares/upload.middleware";
import { asyncHandler } from "../middlewares/error.middleware";

/**
 * =============================================================================
 * USER ROUTES - PROTECTED ENDPOINTS
 * =============================================================================
 *
 * These routes demonstrate different authentication patterns:
 * 1. Required authentication (authenticateUser)
 * 2. Optional authentication (optionalAuth)
 * 3. Role-based authentication (requireRole)
 *
 * =============================================================================
 */

const router = Router();

// =============================================================================
// REQUIRED AUTHENTICATION ROUTES
// =============================================================================
// These routes require a valid JWT token to access

// Get current user's profile
// Usage: GET /api/user/profile
// Headers: Authorization: Bearer <jwt_token>
router.get("/profile", authenticateUser, asyncHandler(getUserProfile));

// Update current user's profile
// Usage: PUT /api/user/profile
// Headers: Authorization: Bearer <jwt_token>
// Body: { firstName: 'John', lastName: 'Doe' }
router.put("/profile", authenticateUser, asyncHandler(updateUserProfile));

// Delete user account (requires authentication)
// Usage: DELETE /api/user/account
// Headers: Authorization: Bearer <jwt_token>
router.delete("/account", authenticateUser, asyncHandler(deleteUserAccount));

// Upload user avatar
// Usage: POST /api/user/avatar
// Headers: Authorization: Bearer <jwt_token>
// Body: multipart/form-data with 'avatar' field
router.post(
  "/avatar",
  authenticateUser,
  uploadAvatar,
  handleUploadError,
  asyncHandler(uploadUserAvatar)
);

// Remove user avatar
// Usage: DELETE /api/user/avatar
// Headers: Authorization: Bearer <jwt_token>
router.delete("/avatar", authenticateUser, asyncHandler(removeUserAvatar));

// =============================================================================
// LABYRINTH COLLABORATION PLATFORM ROUTES
// =============================================================================

// Get comprehensive Labyrinth user profile
// Usage: GET /api/user/labyrinth-profile
// Headers: Authorization: Bearer <jwt_token>
router.get("/labyrinth-profile", authenticateUser, asyncHandler(getLabyrinthProfile));

// Update Labyrinth user profile
// Usage: PUT /api/user/labyrinth-profile
// Headers: Authorization: Bearer <jwt_token>
// Body: { firstName?, lastName?, dateOfBirth?, gitHubProfile?, education?, maxDailySwipes? }
router.put("/labyrinth-profile", authenticateUser, asyncHandler(updateLabyrinthProfile));

// Update user tech stack
// Usage: PUT /api/user/tech-stack
// Headers: Authorization: Bearer <jwt_token>
// Body: { frameworks: string[], languages: string[], tools?: string[] }
router.put("/tech-stack", authenticateUser, asyncHandler(updateUserTechStack));

// Update user demographic information
// Usage: PUT /api/user/demographic
// Headers: Authorization: Bearer <jwt_token>
// Body: { country: string, languages: string[] }
router.put("/demographic", authenticateUser, asyncHandler(updateUserDemographic));

// Update user preferences (matchmaking preferences)
// Usage: PUT /api/user/preferences
// Headers: Authorization: Bearer <jwt_token>
// Body: { preferredTechStackId?: string, preferredDemographicId?: string }
router.put("/preferences", authenticateUser, asyncHandler(updatePreferences));

// Get user workspaces and projects
// Usage: GET /api/user/workspaces
// Headers: Authorization: Bearer <jwt_token>
router.get("/workspaces", authenticateUser, asyncHandler(getWorkspaces));

// Get user collaboration statistics
// Usage: GET /api/user/collaboration-stats
// Headers: Authorization: Bearer <jwt_token>
router.get("/collaboration-stats", authenticateUser, asyncHandler(getCollaborationStats));

// Get full user profile with all related data
// Usage: GET /api/user/full-profile
// Headers: Authorization: Bearer <jwt_token>
router.get("/full-profile", authenticateUser, asyncHandler(getFullUserProfile));

// =============================================================================
// ROLE-BASED AUTHENTICATION ROUTES
// =============================================================================
// These routes require specific roles to access

// Admin only route (example)
// Usage: GET /api/user/admin/dashboard
// Headers: Authorization: Bearer <jwt_token>
// Note: User must have 'admin' role
// router.get('/admin/dashboard', authenticateUser, requireRole(['admin']), adminDashboard);

// Admin or moderator route (example)
// Usage: GET /api/user/moderation/reports
// Headers: Authorization: Bearer <jwt_token>
// Note: User must have 'admin' or 'moderator' role
// router.get('/moderation/reports', authenticateUser, requireRole(['admin', 'moderator']), getModerationReports);

export default router;
