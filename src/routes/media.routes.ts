import { NextFunction, Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  uploadAvatar,
  uploadProjectImage,
  uploadChatMedia,
  uploadProjectFiles,
  uploadWorkspaceBanner,
  uploadSingleMedia,
  uploadMultipleMedia,
  handleUploadError
} from "../middlewares/upload.middleware";
import {
  initializeStorage,
  uploadAvatar as uploadAvatarController,
  uploadProjectImage as uploadProjectImageController,
  uploadChatMedia as uploadChatMediaController,
  uploadProjectFiles as uploadProjectFilesController,
  uploadWorkspaceBanner as uploadWorkspaceBannerController,
  getMedia,
  getMediaList,
  deleteMediaFiles,
  getMediaStatistics,
  getSignedUrl
} from "../controllers/media.controller";

/**
 * =============================================================================
 * MEDIA ROUTES - COMPREHENSIVE MEDIA MANAGEMENT API
 * =============================================================================
 * 
 * Complete media management routes for the Labyrinth collaboration platform.
 * 
 * Features:
 * - Category-specific upload endpoints
 * - Media retrieval and querying
 * - File management and deletion
 * - Statistics and analytics
 * - Access control and signed URLs
 * 
 * All routes are protected with authentication middleware.
 * Upload routes include appropriate file handling middleware.
 * 
 * =============================================================================
 */

const router = Router();

// =============================================================================
// INITIALIZATION ROUTES
// =============================================================================

/**
 * Initialize media storage buckets
 * POST /api/media/init
 * 
 * Admin endpoint to initialize all required storage buckets
 */
router.post("/init", authMiddleware, initializeStorage);

// =============================================================================
// UPLOAD ROUTES - CATEGORY SPECIFIC
// =============================================================================

/**
 * Upload user avatar
 * POST /api/media/avatar
 * 
 * Single file upload for user profile avatars
 * Supports: JPG, PNG, WebP
 * Max size: 5MB
 * Generates thumbnails automatically
 */
router.post(
  "/avatar",
  authMiddleware,
  uploadAvatar,
  handleUploadError,
  uploadAvatarController
);

/**
 * Upload project image
 * POST /api/media/project-image
 * 
 * Single file upload for project cover images
 * Supports: JPG, PNG, WebP, GIF
 * Max size: 10MB
 * Requires projectId in request body
 */
router.post(
  "/project-image",
  authMiddleware,
  uploadProjectImage,
  handleUploadError,
  uploadProjectImageController
);

/**
 * Upload chat media
 * POST /api/media/chat
 * 
 * Multiple file upload for chat messages
 * Supports: Images, Videos, Audio files
 * Max files: 5
 * Max size per file: 20MB
 * Requires chatId in request body
 */
router.post(
  "/chat",
  authMiddleware,
  uploadChatMedia,
  handleUploadError,
  uploadChatMediaController
);

/**
 * Upload project files
 * POST /api/media/project-files
 * 
 * Multiple file upload for project documents and assets
 * Supports: All common file types
 * Max files: 10
 * Max size per file: 100MB
 */
router.post(
  "/project-files",
  authMiddleware,
  uploadProjectFiles,
  handleUploadError,
  uploadProjectFilesController
);

/**
 * Upload workspace banner
 * POST /api/media/workspace-banner
 * 
 * Single file upload for workspace banner images
 * Supports: JPG, PNG, WebP
 * Max size: 8MB
 * Minimum dimensions: 800x300
 */
router.post(
  "/workspace-banner",
  authMiddleware,
  uploadWorkspaceBanner,
  handleUploadError,
  uploadWorkspaceBannerController
);

// =============================================================================
// RETRIEVAL ROUTES
// =============================================================================

/**
 * Get media statistics
 * GET /api/media/stats
 * 
 * Returns comprehensive media statistics for the current user:
 * - Total files and storage usage
 * - Files by category and type
 * - Storage quotas and limits
 */
router.get("/stats", authMiddleware, getMediaStatistics);

/**
 * Get media list with filtering
 * GET /api/media
 * 
 * Query parameters:
 * - category: Filter by media category
 * - type: Filter by MIME type prefix (image/, video/, etc.)
 * - tags: Filter by tags (comma-separated)
 * - dateFrom, dateTo: Date range filtering
 * - limit, offset: Pagination
 * - sortBy: Sort field (createdAt, size, filename)
 * - sortOrder: Sort direction (asc, desc)
 * 
 * Returns paginated list with metadata
 */
router.get("/", authMiddleware, getMediaList);

/**
 * Get specific media by ID
 * GET /api/media/:id
 * 
 * Returns detailed media metadata including:
 * - File information and URLs
 * - Upload and processing status
 * - Associated tags and metadata
 * 
 * Access control: Users can only access their own media
 */
router.get("/:id", authMiddleware, getMedia);

// =============================================================================
// MANAGEMENT ROUTES
// =============================================================================

/**
 * Delete media files
 * DELETE /api/media
 * 
 * Request body:
 * - mediaIds: Array of media IDs to delete
 * - deleteFromStorage: Whether to delete from storage (default: true)
 * 
 * Returns:
 * - deleted: Successfully deleted media IDs
 * - failed: Failed deletions with error messages
 * 
 * Access control: Users can only delete their own media
 */
router.delete("/", authMiddleware, deleteMediaFiles);

/**
 * Generate signed URL for media access
 * POST /api/media/:id/signed-url
 * 
 * Request body:
 * - expiresIn: Expiration time in seconds (default: 3600)
 * 
 * Returns temporary signed URL for secure media access
 * Useful for private media or controlled access scenarios
 */
router.post("/:id/signed-url", authMiddleware, getSignedUrl);

// =============================================================================
// GENERIC UPLOAD ROUTES (for custom implementations)
// =============================================================================

/**
 * Upload single file (generic)
 * POST /api/media/upload/single
 * 
 * Generic single file upload endpoint
 * Requires category parameter to determine validation rules
 * Useful for custom upload implementations
 */
router.post(
  "/upload/single",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    const category = req.body.category;
    const fieldName = req.body.fieldName || 'file';
    return uploadSingleMedia(fieldName, category)(req, res, next);
  },
  handleUploadError,
  async (req: Request, res: Response) => {
    // This would need to be implemented in the controller
    res.status(501).json({
      success: false,
      message: "Generic upload endpoint not implemented",
      error: "NOT_IMPLEMENTED"
    });
  }
);

/**
 * Upload multiple files (generic)
 * POST /api/media/upload/multiple
 * 
 * Generic multiple file upload endpoint
 * Requires category parameter to determine validation rules
 * Useful for custom upload implementations
 */
router.post(
  "/upload/multiple",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    const category = req.body.category;
    const fieldName = req.body.fieldName || 'files';
    const maxFiles = parseInt(req.body.maxFiles) || 5;
    return uploadMultipleMedia(fieldName, maxFiles, category)(req, res, next);
  },
  handleUploadError,
  async (req: Request, res: Response) => {
    // This would need to be implemented in the controller
    res.status(501).json({
      success: false,
      message: "Generic multiple upload endpoint not implemented",
      error: "NOT_IMPLEMENTED"
    });
  }
);

export default router;