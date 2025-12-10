import supabase, { supabaseAdmin } from "../config/supabase";
import { EXTERNAL_SERVICE_ERRORS, VALIDATION_ERRORS, createError } from "../constants/error";

/**
 * =============================================================================
 * AVATAR SERVICE - SUPABASE STORAGE OPERATIONS
 * =============================================================================
 *
 * This service handles all avatar-related operations using Supabase Storage.
 *
 * Bucket Structure:
 * - Bucket name: avatars
 * - File path: {userId}/{timestamp}-{filename}
 *
 * Features:
 * - Upload avatar to Supabase storage
 * - Update user profile with avatar URL
 * - Delete old avatar when uploading new one
 * - Generate public URLs for avatars
 *
 * =============================================================================
 */

import {
  ALLOWED_MIME_TYPES,
  ALLOWED_MIME_TYPES_MUTABLE,
  MAX_FILE_SIZE,
} from "../schemas/avatar.schema";

// Constants
const AVATAR_BUCKET = "avatars";

/**
 * Initialize avatars bucket if it doesn't exist
 */
export const initializeAvatarBucket = async () => {
  try {
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();

    if (listError) {
      throw createError(EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, { originalError: listError });
    }

    const avatarBucketExists = buckets?.some((bucket) => bucket.name === AVATAR_BUCKET);

    if (!avatarBucketExists) {
      const { data, error: createBucketError } = await supabaseAdmin.storage.createBucket(
        AVATAR_BUCKET,
        {
          public: true, // Make avatars publicly accessible
          fileSizeLimit: MAX_FILE_SIZE,
          allowedMimeTypes: ALLOWED_MIME_TYPES_MUTABLE,
        }
      );

      if (createBucketError) {
        throw createError(EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, {
          originalError: createBucketError,
        });
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error; // Re-throw our custom errors
    }
    throw createError(EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, { originalError: error });
  }
};

/**
 * Upload avatar to Supabase storage
 *
 * @param userId - User ID
 * @param file - File buffer or Blob
 * @param fileName - Original file name
 * @param mimeType - File MIME type
 * @returns Public URL of uploaded avatar
 */
export const uploadAvatar = async (
  userId: string,
  file: Buffer | Blob,
  fileName: string,
  mimeType: string
): Promise<string> => {
  try {
    // Validate file type
    if (!ALLOWED_MIME_TYPES_MUTABLE.includes(mimeType)) {
      throw createError(VALIDATION_ERRORS.INVALID_FILE_TYPE, {
        allowedTypes: ALLOWED_MIME_TYPES,
        providedType: mimeType,
      });
    }

    // Generate unique file path
    const timestamp = Date.now();
    const fileExtension = fileName.split(".").pop() || "jpg";
    const filePath = `${userId}/${timestamp}-avatar.${fileExtension}`;

    // Delete old avatar if exists
    await deleteUserAvatarFiles(userId);

    // Upload new avatar using admin client
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, file, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      throw createError(EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, { originalError: uploadError });
    }

    // Get public URL using admin client
    const { data: urlData } = supabaseAdmin.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;
    return publicUrl;
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error; // Re-throw our custom errors
    }
    throw createError(EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, { originalError: error });
  }
};

/**
 * Delete user's avatar files from storage
 * Note: This function no longer checks database, that's handled by user.service
 *
 * @param userId - User ID
 */
export const deleteUserAvatarFiles = async (userId: string): Promise<void> => {
  try {
    // List all files in user's directory using admin client
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from(AVATAR_BUCKET)
      .list(userId);

    if (listError) {
      // Silently fail for listing errors - avatar cleanup is not critical
      return;
    }

    // Delete all avatar files for this user
    if (files && files.length > 0) {
      const filePaths = files.map((file) => `${userId}/${file.name}`);

      const { error: deleteError } = await supabaseAdmin.storage
        .from(AVATAR_BUCKET)
        .remove(filePaths);

      if (deleteError) {
        throw createError(EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, { originalError: deleteError });
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error; // Re-throw our custom errors
    }
    throw createError(EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, { originalError: error });
  }
};

/**
 * Get avatar URL from storage path
 *
 * @param filePath - Storage file path
 * @returns Public URL
 */
export const getAvatarUrl = (filePath: string): string => {
  const { data } = supabaseAdmin.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

  return data.publicUrl;
};
