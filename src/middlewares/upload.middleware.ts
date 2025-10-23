import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { MediaCategory } from "../types/media.types";
import { MEDIA_VALIDATION_RULES } from "../types/media.types";

/**
 * =============================================================================
 * UPLOAD MIDDLEWARE - COMPREHENSIVE MEDIA UPLOAD HANDLING
 * =============================================================================
 *
 * Enhanced middleware for handling various media uploads using Multer.
 * Configured for Supabase Storage with category-based validation.
 *
 * Features:
 * - Memory storage (no local disk storage)
 * - Category-based file validation
 * - Dynamic file size and type limits
 * - Single and multiple file upload support
 * - Comprehensive error handling
 *
 * =============================================================================
 */

// Configure multer for memory storage
const storage = multer.memoryStorage();

// Dynamic file filter based on category
const createFileFilter = (category?: MediaCategory) => {
  return (req: any, file: any, cb: any) => {
    // If no category specified, allow common media types
    if (!category) {
      const commonTypes = [
        'image/jpeg', 'image/png', 'image/webp', 'image/gif',
        'video/mp4', 'video/webm',
        'audio/mp3', 'audio/wav',
        'application/pdf'
      ];
      if (commonTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type: ${file.mimetype}`), false);
      }
      return;
    }

    const rules = MEDIA_VALIDATION_RULES[category];
    const isAllowedType = rules.allowedTypes.some(allowedType => {
      if (allowedType.endsWith('/*')) {
        return file.mimetype.startsWith(allowedType.replace('/*', '/'));
      }
      return file.mimetype === allowedType;
    });

    if (isAllowedType) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${category}. Allowed: ${rules.allowedTypes.join(', ')}`), false);
    }
  };
};

// Create category-specific upload configurations
const createUploadMiddleware = (category?: MediaCategory, maxFiles = 1) => {
  const rules = category ? MEDIA_VALIDATION_RULES[category] : { maxSize: 10 * 1024 * 1024 }; // 10MB default
  
  return multer({
    storage: storage,
    fileFilter: createFileFilter(category),
    limits: {
      fileSize: rules.maxSize,
      files: maxFiles,
      fields: 10,
      parts: maxFiles + 10
    }
  });
};

// Category-specific upload middleware
export const uploadAvatar = createUploadMiddleware(MediaCategory.USER_AVATAR).single('avatar');
export const uploadProjectImage = createUploadMiddleware(MediaCategory.PROJECT_IMAGE).single('image');
export const uploadChatMedia = createUploadMiddleware(MediaCategory.CHAT_MEDIA, 5).array('media', 5);
export const uploadProjectFiles = createUploadMiddleware(MediaCategory.PROJECT_FILE, 10).array('files', 10);
export const uploadWorkspaceBanner = createUploadMiddleware(MediaCategory.WORKSPACE_BANNER).single('banner');
export const uploadSystemAsset = createUploadMiddleware(MediaCategory.SYSTEM_ASSET).single('asset');

// General purpose upload middleware
export const uploadSingleMedia = (fieldName = 'file', category?: MediaCategory) => {
  return createUploadMiddleware(category).single(fieldName);
};

export const uploadMultipleMedia = (fieldName = 'files', maxFiles = 5, category?: MediaCategory) => {
  return createUploadMiddleware(category, maxFiles).array(fieldName, maxFiles);
};

/**
 * Enhanced error handling wrapper for multer
 */
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "File too large. Check category limits.",
          error: "FILE_TOO_LARGE",
          details: { maxSize: (err as any).limit }
        });
        
      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          success: false,
          message: "Too many files uploaded.",
          error: "TOO_MANY_FILES",
          details: { maxFiles: (err as any).limit }
        });
        
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: "Unexpected field name in upload.",
          error: "INVALID_FIELD_NAME",
          details: { fieldName: err.field }
        });
        
      default:
        return res.status(400).json({
          success: false,
          message: "File upload error.",
          error: "UPLOAD_ERROR",
          details: { code: err.code }
        });
    }
  }

  if (err.message && err.message.includes("Invalid file type")) {
    return res.status(400).json({
      success: false,
      message: err.message,
      error: "INVALID_FILE_TYPE"
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    message: "File upload failed.",
    error: "UPLOAD_ERROR"
  });
};
