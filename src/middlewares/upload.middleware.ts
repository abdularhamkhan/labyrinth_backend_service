import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "../schemas/avatar.schema";

/**
 * =============================================================================
 * UPLOAD MIDDLEWARE - FILE UPLOAD HANDLING
 * =============================================================================
 *
 * This middleware handles file uploads using Multer.
 * Configured to store files in memory for direct upload to Supabase.
 *
 * Features:
 * - Memory storage (no local disk storage)
 * - File size limits
 * - File type validation
 * - Single file upload support
 *
 * =============================================================================
 */

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for image uploads
const imageFileFilter = (req: any, file: any, cb: any) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1, // Only allow 1 file per upload
    fields: 1, // Limit form fields
    parts: 2, // Limit total parts
  },
});

/**
 * Middleware for single avatar upload
 * Field name: 'avatar'
 */
export const uploadAvatar = upload.single("avatar");

/**
 * Error handling wrapper for multer
 */
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File too large. Maximum size is 5MB.",
        error: "FILE_TOO_LARGE",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "Too many files. Only one file allowed.",
        error: "TOO_MANY_FILES",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: 'Unexpected field name. Use "avatar" as field name.',
        error: "INVALID_FIELD_NAME",
      });
    }
  }

  if (err.message && err.message.includes("Invalid file type")) {
    return res.status(400).json({
      message: err.message,
      error: "INVALID_FILE_TYPE",
    });
  }

  // Default error
  return res.status(500).json({
    message: "File upload failed.",
    error: "UPLOAD_ERROR",
  });
};
