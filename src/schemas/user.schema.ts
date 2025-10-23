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
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  dateOfBirth: z.date().nullable(),
  lastActive: z.date().nullable(),
  gitHubProfile: z.string().nullable(),
  education: z.string().nullable(),
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

    dateOfBirth: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
      .transform((val) => new Date(val))
      .nullable()
      .optional(),

    gitHubProfile: z
      .string()
      .url("Invalid GitHub profile URL")
      .max(2048, "GitHub profile URL must not exceed 2048 characters")
      .nullable()
      .optional(),

    education: z
      .string()
      .min(1, "Education field cannot be empty")
      .max(200, "Education field must not exceed 200 characters")
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

// =============================================================================
// LABYRINTH USER PROFILE SCHEMAS
// =============================================================================

/**
 * TECH STACK SCHEMA
 */
export const techStackSchema = z.object({
  id: z.string().uuid(),
  frameworks: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
});

export const createTechStackSchema = z.object({
  frameworks: z.array(z.string().min(1).max(50)).min(1, "At least one framework is required"),
  languages: z.array(z.string().min(1).max(50)).min(1, "At least one language is required"),
  tools: z.array(z.string().min(1).max(50)).default([]),
});

export type TechStack = z.infer<typeof techStackSchema>;
export type CreateTechStackInput = z.infer<typeof createTechStackSchema>;

/**
 * DEMOGRAPHIC SCHEMA
 */
export const demographicSchema = z.object({
  id: z.string().uuid(),
  country: z.string(),
  languages: z.array(z.string()),
});

export const createDemographicSchema = z.object({
  country: z.string().min(2).max(100),
  languages: z.array(z.string().min(1).max(50)).min(1, "At least one language is required"),
});

export type Demographic = z.infer<typeof demographicSchema>;
export type CreateDemographicInput = z.infer<typeof createDemographicSchema>;

/**
 * PREFERENCES SCHEMA
 */
export const preferencesSchema = z.object({
  id: z.string().uuid(),
  preferredTechStack: techStackSchema.nullable(),
  preferredDemographic: demographicSchema.nullable(),
});

export const updatePreferencesSchema = z.object({
  preferredTechStackId: z.string().uuid().nullable().optional(),
  preferredDemographicId: z.string().uuid().nullable().optional(),
});

export type Preferences = z.infer<typeof preferencesSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;

/**
 * WORKSPACE SCHEMA
 */
export const workspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  projects: z.array(z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    collaborators: z.array(z.object({
      id: z.string().uuid(),
      username: z.string(),
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
    })),
  })),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type WorkspaceWithProjects = z.infer<typeof workspaceSchema>;

/**
 * COMPREHENSIVE LABYRINTH USER PROFILE SCHEMA
 */
export const labyrinthUserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  dateOfBirth: z.date().nullable(),
  lastActive: z.date().nullable(),
  gitHubProfile: z.string().nullable(),
  education: z.string().nullable(),
  maxDailySwipes: z.number().int().nullable(),
  techStack: techStackSchema.nullable(),
  demographic: demographicSchema.nullable(),
  preferences: preferencesSchema.nullable(),
  workspaces: z.array(workspaceSchema),
  projects: z.array(z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
  })),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type LabyrinthUserProfile = z.infer<typeof labyrinthUserProfileSchema>;

/**
 * UPDATE LABYRINTH PROFILE SCHEMA
 */
export const updateLabyrinthProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  dateOfBirth: z.string().datetime().or(z.date()).optional(),
  gitHubProfile: z.string().url().or(z.literal("")).nullable().optional(),
  education: z.string().max(500).nullable().optional(),
  maxDailySwipes: z.number().int().min(10).max(200).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});

export type UpdateLabyrinthProfileInput = z.infer<typeof updateLabyrinthProfileSchema>;

/**
 * USER COLLABORATION STATS SCHEMA
 */
export const collaborationStatsSchema = z.object({
  projectsCount: z.number().int(),
  workspacesCount: z.number().int(),
  totalSwipes: z.number().int(),
  rightSwipes: z.number().int(),
  swipesReceived: z.number().int(),
  messagesCount: z.number().int(),
  matchesCount: z.number().int(),
});

export type CollaborationStats = z.infer<typeof collaborationStatsSchema>;

/**
 * USER PROFILE WITH RELATIONS SCHEMA
 */
export const userProfileWithRelationsSchema = labyrinthUserProfileSchema.extend({
  collaborationStats: collaborationStatsSchema,
});

export type UserProfileWithRelations = z.infer<typeof userProfileWithRelationsSchema>;
