import z from "zod";
import { userProfileSchema } from "./user.schema";

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
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"] as const;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Create a mutable version for Supabase config (needs string[])
export const ALLOWED_MIME_TYPES_MUTABLE: string[] = [...ALLOWED_MIME_TYPES];

/**
 * AVATAR UPLOAD RESPONSE SCHEMA
 *
 * Schema for avatar upload API response.
 * Used by: uploadUserAvatar controller
 */
export const avatarUploadResponseSchema = z.object({
  message: z.string(),
  avatarUrl: z.string().url(),
  user: userProfileSchema,
});

export type AvatarUploadResponse = z.infer<typeof avatarUploadResponseSchema>;

/**
 * AVATAR REMOVE RESPONSE SCHEMA
 *
 * Schema for avatar removal API response.
 * Used by: removeUserAvatar controller
 */
export const avatarRemoveResponseSchema = z.object({
  message: z.string(),
  user: userProfileSchema,
});

export type AvatarRemoveResponse = z.infer<typeof avatarRemoveResponseSchema>;

/**
 * UPLOAD AVATAR INPUT SCHEMA
 *
 * Schema for uploadAvatar function input parameters.
 * Used by: avatar.service.ts uploadAvatar function
 */
export const uploadAvatarInputSchema = z.object({
  userId: z.string().uuid(),
  file: z.custom<Buffer | Blob>((val) => {
    return (
      val instanceof Buffer ||
      (typeof Blob !== "undefined" && val instanceof Blob) ||
      (val && typeof val === "object" && "buffer" in val)
    );
  }, "Must be a Buffer or Blob"),
  fileName: z.string().min(1, "File name cannot be empty"),
  mimeType: z.enum(ALLOWED_MIME_TYPES, {
    message: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
  }),
});

export type UploadAvatarInput = z.infer<typeof uploadAvatarInputSchema>;

/**
 * FILE UPLOAD INTERFACE
 *
 * Interface for multer file uploads
 * Matches the FileUpload interface used in user.service.ts
 */
export const fileUploadSchema = z.object({
  buffer: z.custom<Buffer>((val) => val instanceof Buffer, "Must be a Buffer"),
  originalname: z.string(),
  mimetype: z.string(),
  size: z.number(),
});

export type FileUpload = z.infer<typeof fileUploadSchema>;
