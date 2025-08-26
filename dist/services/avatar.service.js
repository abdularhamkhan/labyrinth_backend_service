"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvatarUrl = exports.deleteUserAvatarFiles = exports.uploadAvatar = exports.initializeAvatarBucket = void 0;
const supabase_1 = require("../config/supabase");
const error_1 = require("../constants/error");
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
const avatar_schema_1 = require("../schemas/avatar.schema");
// Constants
const AVATAR_BUCKET = "avatars";
/**
 * Initialize avatars bucket if it doesn't exist
 */
const initializeAvatarBucket = async () => {
    try {
        const { data: buckets, error: listError } = await supabase_1.supabaseAdmin.storage.listBuckets();
        if (listError) {
            throw (0, error_1.createError)(error_1.EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, { originalError: listError });
        }
        const avatarBucketExists = buckets?.some((bucket) => bucket.name === AVATAR_BUCKET);
        if (!avatarBucketExists) {
            const { data, error: createBucketError } = await supabase_1.supabaseAdmin.storage.createBucket(AVATAR_BUCKET, {
                public: true, // Make avatars publicly accessible
                fileSizeLimit: avatar_schema_1.MAX_FILE_SIZE,
                allowedMimeTypes: avatar_schema_1.ALLOWED_MIME_TYPES_MUTABLE,
            });
            if (createBucketError) {
                throw (0, error_1.createError)(error_1.EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, {
                    originalError: createBucketError,
                });
            }
        }
    }
    catch (error) {
        if (error instanceof Error && error.name.includes("Error")) {
            throw error; // Re-throw our custom errors
        }
        throw (0, error_1.createError)(error_1.EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, { originalError: error });
    }
};
exports.initializeAvatarBucket = initializeAvatarBucket;
/**
 * Upload avatar to Supabase storage
 *
 * @param userId - User ID
 * @param file - File buffer or Blob
 * @param fileName - Original file name
 * @param mimeType - File MIME type
 * @returns Public URL of uploaded avatar
 */
const uploadAvatar = async (userId, file, fileName, mimeType) => {
    try {
        // Validate file type
        if (!avatar_schema_1.ALLOWED_MIME_TYPES_MUTABLE.includes(mimeType)) {
            throw (0, error_1.createError)(error_1.VALIDATION_ERRORS.INVALID_FILE_TYPE, {
                allowedTypes: avatar_schema_1.ALLOWED_MIME_TYPES,
                providedType: mimeType,
            });
        }
        // Generate unique file path
        const timestamp = Date.now();
        const fileExtension = fileName.split(".").pop() || "jpg";
        const filePath = `${userId}/${timestamp}-avatar.${fileExtension}`;
        // Delete old avatar if exists
        await (0, exports.deleteUserAvatarFiles)(userId);
        // Upload new avatar using admin client
        const { data, error: uploadError } = await supabase_1.supabaseAdmin.storage
            .from(AVATAR_BUCKET)
            .upload(filePath, file, {
            contentType: mimeType,
            upsert: true,
        });
        if (uploadError) {
            throw (0, error_1.createError)(error_1.EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, { originalError: uploadError });
        }
        // Get public URL using admin client
        const { data: urlData } = supabase_1.supabaseAdmin.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);
        const publicUrl = urlData.publicUrl;
        return publicUrl;
    }
    catch (error) {
        if (error instanceof Error && error.name.includes("Error")) {
            throw error; // Re-throw our custom errors
        }
        throw (0, error_1.createError)(error_1.EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, { originalError: error });
    }
};
exports.uploadAvatar = uploadAvatar;
/**
 * Delete user's avatar files from storage
 * Note: This function no longer checks database, that's handled by user.service
 *
 * @param userId - User ID
 */
const deleteUserAvatarFiles = async (userId) => {
    try {
        // List all files in user's directory using admin client
        const { data: files, error: listError } = await supabase_1.supabaseAdmin.storage
            .from(AVATAR_BUCKET)
            .list(userId);
        if (listError) {
            // Silently fail for listing errors - avatar cleanup is not critical
            return;
        }
        // Delete all avatar files for this user
        if (files && files.length > 0) {
            const filePaths = files.map((file) => `${userId}/${file.name}`);
            const { error: deleteError } = await supabase_1.supabaseAdmin.storage
                .from(AVATAR_BUCKET)
                .remove(filePaths);
            if (deleteError) {
                throw (0, error_1.createError)(error_1.EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, { originalError: deleteError });
            }
        }
    }
    catch (error) {
        if (error instanceof Error && error.name.includes("Error")) {
            throw error; // Re-throw our custom errors
        }
        throw (0, error_1.createError)(error_1.EXTERNAL_SERVICE_ERRORS.STORAGE_ERROR, { originalError: error });
    }
};
exports.deleteUserAvatarFiles = deleteUserAvatarFiles;
/**
 * Get avatar URL from storage path
 *
 * @param filePath - Storage file path
 * @returns Public URL
 */
const getAvatarUrl = (filePath) => {
    const { data } = supabase_1.supabaseAdmin.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
};
exports.getAvatarUrl = getAvatarUrl;
