import z from "zod";
import { VALIDATION_ERRORS } from "../constants/error";

/**
 * =============================================================================
 * USER SCHEMAS - INPUT VALIDATION
 * =============================================================================
 *
 * These schemas validate incoming request data for user profile endpoints.
 * Using Zod for runtime type checking and validation with centralized constants.
 *
 * Related schemas:
 * - Avatar schemas: src/schemas/avatar.schema.ts
 * - Auth schemas: src/schemas/auth.schema.ts
 *
 * =============================================================================
 */

/**
 * USER PROFILE SCHEMA
 *
 * Defines the structure of user profile data.
 * Used across the application for consistent user data structure.
 */
export const userProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().nullable(),
  avatar: z.string().url().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

/**
 * UPDATE PROFILE SCHEMA
 *
 * Validates user profile update data.
 * Used by: updateUserProfile controller & service
 *
 * Optional fields (at least one required):
 * - firstName: User's first name
 * - lastName: User's last name
 * - username: Unique username (min 3 chars)
 * - phone: International phone number
 * - avatar: Avatar URL or null to remove
 */
export const updateProfileSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must not exceed 50 characters")
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        "First name can only contain letters, spaces, apostrophes, and hyphens"
      )
      .trim()
      .optional(),

    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must not exceed 50 characters")
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        "Last name can only contain letters, spaces, apostrophes, and hyphens"
      )
      .trim()
      .optional(),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must not exceed 50 characters")
      .regex(/^[a-zA-Z0-9_-]+$/, VALIDATION_ERRORS.INVALID_USERNAME_FORMAT.message)
      .trim()
      .toLowerCase()
      .optional(),

    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(20, "Phone number must not exceed 20 characters")
      .regex(/^\+?[1-9]\d{1,14}$/, VALIDATION_ERRORS.INVALID_PHONE_FORMAT.message)
      .nullable()
      .optional(),

    avatar: z
      .string()
      .url("Invalid avatar URL")
      .max(2048, "Avatar URL must not exceed 2048 characters")
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * GET PROFILE RESPONSE SCHEMA
 *
 * Schema for get profile API response.
 * Used by: getUserProfile controller
 */
export const getProfileResponseSchema = z.object({
  message: z.string(),
  user: userProfileSchema,
});

export type GetProfileResponse = z.infer<typeof getProfileResponseSchema>;

/**
 * UPDATE PROFILE RESPONSE SCHEMA
 *
 * Schema for update profile API response.
 * Used by: updateUserProfile controller
 */
export const updateProfileResponseSchema = z.object({
  message: z.string(),
  user: userProfileSchema,
  updated: z.boolean(),
  updatedFields: z.array(z.string()).optional(),
});

export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;

/**
 * DELETE USER RESPONSE SCHEMA
 *
 * Schema for delete user API response.
 * Used by: deleteUserAccount controller
 */
export const deleteUserResponseSchema = z.object({
  message: z.string(),
  deletedUserId: z.string().uuid(),
  deletedUsername: z.string(),
});

export type DeleteUserResponse = z.infer<typeof deleteUserResponseSchema>;
