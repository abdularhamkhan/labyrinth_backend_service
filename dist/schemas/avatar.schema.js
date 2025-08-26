"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadSchema = exports.uploadAvatarInputSchema = exports.avatarRemoveResponseSchema = exports.avatarUploadResponseSchema = exports.ALLOWED_MIME_TYPES_MUTABLE = exports.MAX_FILE_SIZE = exports.ALLOWED_MIME_TYPES = void 0;
const zod_1 = __importDefault(require("zod"));
const user_schema_1 = require("./user.schema");
/**
 * =============================================================================
 * AVATAR SCHEMAS - INPUT VALIDATION
 * =============================================================================
 *
 * These schemas validate avatar-related request data.
 * Using Zod for runtime type checking and validation.
 *
 * Related schemas:
 * - User schemas: src/schemas/user.schema.ts
 *
 * =============================================================================
 */
/**
 * ALLOWED MIME TYPES
 */
exports.ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
exports.MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// Create a mutable version for Supabase config (needs string[])
exports.ALLOWED_MIME_TYPES_MUTABLE = [...exports.ALLOWED_MIME_TYPES];
/**
 * AVATAR UPLOAD RESPONSE SCHEMA
 *
 * Schema for avatar upload API response.
 * Used by: uploadUserAvatar controller
 */
exports.avatarUploadResponseSchema = zod_1.default.object({
    message: zod_1.default.string(),
    avatarUrl: zod_1.default.string().url(),
    user: user_schema_1.userProfileSchema,
});
/**
 * AVATAR REMOVE RESPONSE SCHEMA
 *
 * Schema for avatar removal API response.
 * Used by: removeUserAvatar controller
 */
exports.avatarRemoveResponseSchema = zod_1.default.object({
    message: zod_1.default.string(),
    user: user_schema_1.userProfileSchema,
});
/**
 * UPLOAD AVATAR INPUT SCHEMA
 *
 * Schema for uploadAvatar function input parameters.
 * Used by: avatar.service.ts uploadAvatar function
 */
exports.uploadAvatarInputSchema = zod_1.default.object({
    userId: zod_1.default.string().uuid(),
    file: zod_1.default.custom((val) => {
        return (val instanceof Buffer ||
            (typeof Blob !== "undefined" && val instanceof Blob) ||
            (val && typeof val === "object" && "buffer" in val));
    }, "Must be a Buffer or Blob"),
    fileName: zod_1.default.string().min(1, "File name cannot be empty"),
    mimeType: zod_1.default.enum(exports.ALLOWED_MIME_TYPES, {
        message: `Invalid file type. Allowed types: ${exports.ALLOWED_MIME_TYPES.join(", ")}`,
    }),
});
/**
 * FILE UPLOAD INTERFACE
 *
 * Interface for multer file uploads
 * Matches the FileUpload interface used in user.service.ts
 */
exports.fileUploadSchema = zod_1.default.object({
    buffer: zod_1.default.custom((val) => val instanceof Buffer, "Must be a Buffer"),
    originalname: zod_1.default.string(),
    mimetype: zod_1.default.string(),
    size: zod_1.default.number(),
});
