"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserResponseSchema = exports.updateProfileResponseSchema = exports.getProfileResponseSchema = exports.updateProfileSchema = exports.userProfileSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const error_1 = require("../constants/error");
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
exports.userProfileSchema = zod_1.default.object({
    id: zod_1.default.string().uuid(),
    email: zod_1.default.string().email(),
    username: zod_1.default.string(),
    firstName: zod_1.default.string(),
    lastName: zod_1.default.string(),
    phone: zod_1.default.string().nullable(),
    avatar: zod_1.default.string().url().nullable(),
    createdAt: zod_1.default.date(),
    updatedAt: zod_1.default.date(),
});
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
exports.updateProfileSchema = zod_1.default
    .object({
    firstName: zod_1.default
        .string()
        .min(1, "First name is required")
        .max(50, "First name must not exceed 50 characters")
        .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "First name can only contain letters, spaces, apostrophes, and hyphens")
        .trim()
        .optional(),
    lastName: zod_1.default
        .string()
        .min(1, "Last name is required")
        .max(50, "Last name must not exceed 50 characters")
        .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Last name can only contain letters, spaces, apostrophes, and hyphens")
        .trim()
        .optional(),
    username: zod_1.default
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username must not exceed 50 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, error_1.VALIDATION_ERRORS.INVALID_USERNAME_FORMAT.message)
        .trim()
        .toLowerCase()
        .optional(),
    phone: zod_1.default
        .string()
        .min(10, "Phone number must be at least 10 characters")
        .max(20, "Phone number must not exceed 20 characters")
        .regex(/^\+?[1-9]\d{1,14}$/, error_1.VALIDATION_ERRORS.INVALID_PHONE_FORMAT.message)
        .nullable()
        .optional(),
    avatar: zod_1.default
        .string()
        .url("Invalid avatar URL")
        .max(2048, "Avatar URL must not exceed 2048 characters")
        .nullable()
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
});
/**
 * GET PROFILE RESPONSE SCHEMA
 *
 * Schema for get profile API response.
 * Used by: getUserProfile controller
 */
exports.getProfileResponseSchema = zod_1.default.object({
    message: zod_1.default.string(),
    user: exports.userProfileSchema,
});
/**
 * UPDATE PROFILE RESPONSE SCHEMA
 *
 * Schema for update profile API response.
 * Used by: updateUserProfile controller
 */
exports.updateProfileResponseSchema = zod_1.default.object({
    message: zod_1.default.string(),
    user: exports.userProfileSchema,
    updated: zod_1.default.boolean(),
    updatedFields: zod_1.default.array(zod_1.default.string()).optional(),
});
/**
 * DELETE USER RESPONSE SCHEMA
 *
 * Schema for delete user API response.
 * Used by: deleteUserAccount controller
 */
exports.deleteUserResponseSchema = zod_1.default.object({
    message: zod_1.default.string(),
    deletedUserId: zod_1.default.string().uuid(),
    deletedUsername: zod_1.default.string(),
});
