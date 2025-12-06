import { Request, Response } from "express";
import { logger, isError } from "../utils/logger";
import { createError, VALIDATION_ERRORS } from "../constants/error";
import {
  uploadMedia,
  uploadMultipleMedia,
  getMediaById,
  queryMedia,
  deleteMedia,
  getMediaStats,
  generateSignedUrl,
  initializeMediaBuckets,
} from "../services/media.service";
import {
  fileUploadRequestSchema,
  multipleFileUploadSchema,
  mediaQuerySchema,
  mediaDeletionRequestSchema,
  avatarUploadSchema,
  projectImageUploadSchema,
  chatMediaUploadSchema,
} from "../schemas/media.schema";
import { MediaCategory } from "../types/media.types";
import { AuthRequest } from "../types/auth.types";

/**
 * =============================================================================
 * MEDIA CONTROLLER - COMPREHENSIVE MEDIA MANAGEMENT
 * =============================================================================
 *
 * Controller handling all media operations for the Labyrinth platform:
 *
 * - File uploads (single and multiple)
 * - Media retrieval and querying
 * - Media deletion and cleanup
 * - Statistics and analytics
 * - URL generation and access control
 *
 * All endpoints are protected and validate user permissions.
 *
 * =============================================================================
 */

/**
 * Initialize media storage buckets
 * POST /api/media/init
 */
export const initializeStorage = async (req: Request, res: Response): Promise<void> => {
  try {
    await initializeMediaBuckets();

    res.status(200).json({
      success: true,
      message: "Media storage initialized successfully",
    });
  } catch (error) {
    logger.error("Failed to initialize media storage:", error instanceof Error ? error : undefined);
    res.status(500).json({
      success: false,
      message: "Failed to initialize media storage",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Upload single avatar
 * POST /api/media/avatar
 */
export const uploadAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No file provided",
        error: "MISSING_FILE",
      });
      return;
    }

    const validation = avatarUploadSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request data",
        error: "VALIDATION_ERROR",
        details: validation.error.issues,
      });
      return;
    }

    const userId = req.user!.id;
    const { generateThumbnail, quality, size } = validation.data;

    const result = await uploadMedia(
      userId,
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      MediaCategory.USER_AVATAR,
      {
        generateThumbnail,
        quality,
        tags: [`avatar:${size}`],
      }
    );

    res.status(201).json({
      success: true,
      message: "Avatar uploaded successfully",
      data: { media: result },
    });
  } catch (error) {
    logger.error("Avatar upload failed:", error instanceof Error ? error : undefined);
    res.status(500).json({
      success: false,
      message: "Avatar upload failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Upload project image
 * POST /api/media/project-image
 */
export const uploadProjectImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No file provided",
        error: "MISSING_FILE",
      });
      return;
    }

    const validation = projectImageUploadSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request data",
        error: "VALIDATION_ERROR",
        details: validation.error.issues,
      });
      return;
    }

    const userId = req.user!.id;
    const { projectId, generateThumbnail, quality, tags } = validation.data;

    const result = await uploadMedia(
      userId,
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      MediaCategory.PROJECT_IMAGE,
      {
        generateThumbnail,
        quality,
        tags: [...(tags || []), `project:${projectId}`],
      }
    );

    res.status(201).json({
      success: true,
      message: "Project image uploaded successfully",
      data: { media: result },
    });
  } catch (error) {
    logger.error("Project image upload failed:", isError(error) ? error : new Error(String(error)));
    res.status(500).json({
      success: false,
      message: "Project image upload failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Upload chat media (supports multiple files)
 * POST /api/media/chat
 */
export const uploadChatMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: "No files provided",
        error: "MISSING_FILES",
      });
      return;
    }

    const validation = chatMediaUploadSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request data",
        error: "VALIDATION_ERROR",
        details: validation.error.issues,
      });
      return;
    }

    const userId = req.user!.id;
    const { chatId, messageType, generateThumbnail, quality } = validation.data;

    const fileData = files.map((file) => ({
      buffer: file.buffer,
      filename: file.originalname,
      mimeType: file.mimetype,
    }));

    const result = await uploadMultipleMedia(userId, fileData, MediaCategory.CHAT_MEDIA, {
      generateThumbnail,
      quality,
      tags: [`chat:${chatId}`, `type:${messageType}`],
    });

    res.status(201).json({
      success: true,
      message: "Chat media uploaded successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Chat media upload failed:", isError(error) ? error : new Error(String(error)));
    res.status(500).json({
      success: false,
      message: "Chat media upload failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Upload project files (supports multiple files)
 * POST /api/media/project-files
 */
export const uploadProjectFiles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: "No files provided",
        error: "MISSING_FILES",
      });
      return;
    }

    const validation = fileUploadRequestSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request data",
        error: "VALIDATION_ERROR",
        details: validation.error.issues,
      });
      return;
    }

    const userId = req.user!.id;
    const { folder, generateThumbnail, quality, tags } = validation.data;

    const fileData = files.map((file) => ({
      buffer: file.buffer,
      filename: file.originalname,
      mimeType: file.mimetype,
    }));

    const result = await uploadMultipleMedia(userId, fileData, MediaCategory.PROJECT_FILE, {
      folder,
      generateThumbnail,
      quality,
      tags,
    });

    res.status(201).json({
      success: true,
      message: "Project files uploaded successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Project files upload failed:", isError(error) ? error : new Error(String(error)));
    res.status(500).json({
      success: false,
      message: "Project files upload failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Upload workspace banner
 * POST /api/media/workspace-banner
 */
export const uploadWorkspaceBanner = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No file provided",
        error: "MISSING_FILE",
      });
      return;
    }

    const validation = fileUploadRequestSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request data",
        error: "VALIDATION_ERROR",
        details: validation.error.issues,
      });
      return;
    }

    const userId = req.user!.id;
    const { generateThumbnail, quality, tags } = validation.data;

    const result = await uploadMedia(
      userId,
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      MediaCategory.WORKSPACE_BANNER,
      {
        generateThumbnail,
        quality,
        tags: [...(tags || []), "workspace:banner"],
      }
    );

    res.status(201).json({
      success: true,
      message: "Workspace banner uploaded successfully",
      data: { media: result },
    });
  } catch (error) {
    logger.error(
      "Workspace banner upload failed:",
      isError(error) ? error : new Error(String(error))
    );
    res.status(500).json({
      success: false,
      message: "Workspace banner upload failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Get media by ID
 * GET /api/media/:id
 */
export const getMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const media = await getMediaById(id);

    if (!media) {
      res.status(404).json({
        success: false,
        message: "Media not found",
        error: "MEDIA_NOT_FOUND",
      });
      return;
    }

    // Check if user has access to this media
    // For now, users can only access their own media
    // TODO: Add project-based access control
    if (media.uploadedBy !== userId) {
      res.status(403).json({
        success: false,
        message: "Access denied",
        error: "ACCESS_DENIED",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Media retrieved successfully",
      data: { media },
    });
  } catch (error) {
    logger.error("Failed to get media:", isError(error) ? error : new Error(String(error)));
    res.status(500).json({
      success: false,
      message: "Failed to retrieve media",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Query media with filters
 * GET /api/media
 */
export const getMediaList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const validation = mediaQuerySchema.safeParse({
      ...req.query,
      userId, // Always filter by current user
    });

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        error: "VALIDATION_ERROR",
        details: validation.error.issues,
      });
      return;
    }

    const result = await queryMedia(validation.data);

    res.status(200).json({
      success: true,
      message: "Media list retrieved successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Failed to get media list:", isError(error) ? error : new Error(String(error)));
    res.status(500).json({
      success: false,
      message: "Failed to retrieve media list",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Delete media files
 * DELETE /api/media
 */
export const deleteMediaFiles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validation = mediaDeletionRequestSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request data",
        error: "VALIDATION_ERROR",
        details: validation.error.issues,
      });
      return;
    }

    const userId = req.user!.id;
    const { mediaIds, deleteFromStorage } = validation.data;

    // Verify user owns all media files
    for (const mediaId of mediaIds) {
      const media = await getMediaById(mediaId);
      if (!media || media.uploadedBy !== userId) {
        res.status(403).json({
          success: false,
          message: "Access denied to one or more media files",
          error: "ACCESS_DENIED",
        });
        return;
      }
    }

    const result = await deleteMedia({ mediaIds, deleteFromStorage });

    res.status(200).json({
      success: true,
      message: "Media deletion completed",
      data: result,
    });
  } catch (error) {
    logger.error("Failed to delete media:", isError(error) ? error : new Error(String(error)));
    res.status(500).json({
      success: false,
      message: "Failed to delete media",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Get media statistics for current user
 * GET /api/media/stats
 */
export const getMediaStatistics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const stats = await getMediaStats(userId);

    res.status(200).json({
      success: true,
      message: "Media statistics retrieved successfully",
      data: { stats },
    });
  } catch (error) {
    logger.error("Failed to get media stats:", isError(error) ? error : new Error(String(error)));
    res.status(500).json({
      success: false,
      message: "Failed to retrieve media statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Generate signed URL for media access
 * POST /api/media/:id/signed-url
 */
export const getSignedUrl = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { expiresIn = 3600 } = req.body;
    const userId = req.user!.id;

    // Verify user has access to media
    const media = await getMediaById(id);
    if (!media || media.uploadedBy !== userId) {
      res.status(403).json({
        success: false,
        message: "Access denied",
        error: "ACCESS_DENIED",
      });
      return;
    }

    const signedUrl = await generateSignedUrl(id, expiresIn);

    res.status(200).json({
      success: true,
      message: "Signed URL generated successfully",
      data: {
        signedUrl,
        expiresIn,
        expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      },
    });
  } catch (error) {
    logger.error(
      "Failed to generate signed URL:",
      isError(error) ? error : new Error(String(error))
    );
    res.status(500).json({
      success: false,
      message: "Failed to generate signed URL",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
