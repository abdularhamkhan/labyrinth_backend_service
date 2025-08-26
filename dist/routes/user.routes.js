"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const error_middleware_1 = require("../middlewares/error.middleware");
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
const router = (0, express_1.Router)();
// =============================================================================
// REQUIRED AUTHENTICATION ROUTES
// =============================================================================
// These routes require a valid JWT token to access
// Get current user's profile
// Usage: GET /api/user/profile
// Headers: Authorization: Bearer <jwt_token>
router.get("/profile", auth_middleware_1.authenticateUser, (0, error_middleware_1.asyncHandler)(user_controller_1.getUserProfile));
// Update current user's profile
// Usage: PUT /api/user/profile
// Headers: Authorization: Bearer <jwt_token>
// Body: { firstName: 'John', lastName: 'Doe' }
router.put("/profile", auth_middleware_1.authenticateUser, (0, error_middleware_1.asyncHandler)(user_controller_1.updateUserProfile));
// Delete user account (requires authentication)
// Usage: DELETE /api/user/account
// Headers: Authorization: Bearer <jwt_token>
router.delete("/account", auth_middleware_1.authenticateUser, (0, error_middleware_1.asyncHandler)(user_controller_1.deleteUserAccount));
// Upload user avatar
// Usage: POST /api/user/avatar
// Headers: Authorization: Bearer <jwt_token>
// Body: multipart/form-data with 'avatar' field
router.post("/avatar", auth_middleware_1.authenticateUser, upload_middleware_1.uploadAvatar, upload_middleware_1.handleUploadError, (0, error_middleware_1.asyncHandler)(user_controller_1.uploadUserAvatar));
// Remove user avatar
// Usage: DELETE /api/user/avatar
// Headers: Authorization: Bearer <jwt_token>
router.delete("/avatar", auth_middleware_1.authenticateUser, (0, error_middleware_1.asyncHandler)(user_controller_1.removeUserAvatar));
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
exports.default = router;
