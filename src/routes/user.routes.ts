import { Router } from "express";
import {
  authenticateUser,
  optionalAuth,
  requireRole,
  AuthenticatedRequest,
} from "../middlewares/auth.middleware";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  uploadUserAvatar,
  removeUserAvatar,
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
