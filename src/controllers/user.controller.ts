import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/jwt.middleware";
import {
  getUserProfileService,
  updateUserProfileService,
  deleteUserService,
  uploadUserAvatarService,
  deleteUserAvatarService,
  getLabyrinthUserProfile,
  upsertUserTechStack,
  upsertUserDemographic,
  updateUserPreferences,
  updateLabyrinthUserProfile,
  getUserWorkspaces,
  getUserCollaborationStats,
  updateUserLastActive,
} from "../services/user.service";
import { initializeAvatarBucket } from "../services/avatar.service";
import { ValidationError } from "../constants/error";

/**
 * =============================================================================
 * USER CONTROLLER - PROTECTED ROUTE HANDLERS
 * =============================================================================
 *
 * These controllers handle user-related operations that require authentication.
 * They receive AuthenticatedRequest which includes user data from auth middleware.
 *
 * All controllers follow the same logging pattern:
 * 1. Log controller start with request details
 * 2. Log each step of the operation
 * 3. Log successful completion
 * 4. Handle and log errors comprehensively
 *
 * =============================================================================
 */

/**
 * =============================================================================
 * GET USER PROFILE
 * =============================================================================
 *
 * Retrieves the authenticated user's profile information.
 *
 * Route: GET /api/user/profile
 * Auth: Required (authenticateUser middleware)
 *
 * @param req - AuthenticatedRequest with user data
 * @param res - Express response object
 */
export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  // Trust that auth middleware has validated the user
  const userId = req.user!.id;

  // Delegate to service layer for business logic
  const userProfile = await getUserProfileService(userId);

  // Handle HTTP response
  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully",
    data: { user: userProfile },
  });
};

/**
 * =============================================================================
 * UPDATE USER PROFILE
 * =============================================================================
 *
 * Updates the authenticated user's profile information.
 *
 * Route: PUT /api/user/profile
 * Auth: Required (authenticateUser middleware)
 * Body: { firstName?, lastName?, username? }
 *
 * @param req - AuthenticatedRequest with user data and update payload
 * @param res - Express response object
 */
export const updateUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { firstName, lastName, username, phone } = req.body;

  // Build update object with only provided fields
  const updateData: any = {};
  if (firstName !== undefined) updateData.firstName = firstName;
  if (lastName !== undefined) updateData.lastName = lastName;
  if (username !== undefined) updateData.username = username;
  if (phone !== undefined) updateData.phone = phone;

  // Check if any data to update
  if (Object.keys(updateData).length === 0) {
    throw new ValidationError("No valid update data provided.");
  }

  const {
    user: updatedUser,
    updated,
    updatedFields,
  } = await updateUserProfileService(userId, updateData);

  res.status(200).json({
    message: "User profile updated successfully.",
    user: updatedUser,
  });
};

/**
 * =============================================================================
 * DELETE USER ACCOUNT
 * =============================================================================
 *
 * Deletes the authenticated user's account (soft delete or hard delete).
 *
 * Route: DELETE /api/user/account
 * Auth: Required (authenticateUser middleware)
 *
 * @param req - AuthenticatedRequest with user data
 * @param res - Express response object
 */
export const deleteUserAccount = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  await deleteUserService(userId);

  res.status(200).json({
    message: "User account deleted successfully.",
    deletedUserId: userId,
  });
};

/**
 * =============================================================================
 * UPLOAD USER AVATAR
 * =============================================================================
 *
 * Uploads a new avatar image for the authenticated user.
 *
 * Route: POST /api/user/avatar
 * Auth: Required (authenticateUser middleware)
 * Body: multipart/form-data with 'avatar' field
 *
 * @param req - AuthenticatedRequest with user data and file
 * @param res - Express response object
 */
export const uploadUserAvatar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const file = (req as any).file;

  if (!file) {
    throw new ValidationError("No file uploaded.");
  }

  // Initialize bucket if needed
  await initializeAvatarBucket();

  const { userId: updatedUserId, newAvatarUrl } = await uploadUserAvatarService(userId, file);
  const updatedUser = await getUserProfileService(userId);

  res.status(200).json({
    message: "Avatar uploaded successfully.",
    avatarUrl: newAvatarUrl,
    user: updatedUser,
  });
};

/**
 * =============================================================================
 * REMOVE USER AVATAR
 * =============================================================================
 *
 * Removes the avatar image for the authenticated user.
 *
 * Route: DELETE /api/user/avatar
 * Auth: Required (authenticateUser middleware)
 *
 * @param req - AuthenticatedRequest with user data
 * @param res - Express response object
 */
export const removeUserAvatar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const { userId: deletedUserId, message } = await deleteUserAvatarService(userId);
  const updatedUser = await getUserProfileService(userId);

  res.status(200).json({
    message: "Avatar removed successfully.",
    user: updatedUser,
  });
};

// =============================================================================
// LABYRINTH USER PROFILE CONTROLLERS
// =============================================================================

/**
 * GET COMPREHENSIVE LABYRINTH USER PROFILE
 * Route: GET /api/user/labyrinth-profile
 * Auth: Required
 */
export const getLabyrinthProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  // Update user's last active timestamp
  await updateUserLastActive(userId);

  const userProfile = await getLabyrinthUserProfile(userId);

  res.status(200).json({
    success: true,
    message: "Labyrinth user profile retrieved successfully",
    data: { user: userProfile },
  });
};

/**
 * UPDATE LABYRINTH USER PROFILE
 * Route: PUT /api/user/labyrinth-profile
 * Auth: Required
 */
export const updateLabyrinthProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const updateData = req.body;

  const result = await updateLabyrinthUserProfile(userId, updateData);

  res.status(200).json({
    success: true,
    message: result.message,
    data: result,
  });
};

/**
 * CREATE OR UPDATE USER TECH STACK
 * Route: PUT /api/user/tech-stack
 * Auth: Required
 */
export const updateUserTechStack = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { frameworks, languages, tools } = req.body;

  if (!frameworks || !languages) {
    throw new ValidationError("Frameworks and languages are required");
  }

  const techStack = await upsertUserTechStack(userId, {
    frameworks,
    languages,
    tools: tools || [],
  });

  res.status(200).json({
    success: true,
    message: "Tech stack updated successfully",
    data: { techStack },
  });
};

/**
 * CREATE OR UPDATE USER DEMOGRAPHIC
 * Route: PUT /api/user/demographic
 * Auth: Required
 */
export const updateUserDemographic = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { country, languages } = req.body;

  if (!country || !languages) {
    throw new ValidationError("Country and languages are required");
  }

  const demographic = await upsertUserDemographic(userId, {
    country,
    languages,
  });

  res.status(200).json({
    success: true,
    message: "Demographic information updated successfully",
    data: { demographic },
  });
};

/**
 * UPDATE USER PREFERENCES
 * Route: PUT /api/user/preferences
 * Auth: Required
 */
export const updatePreferences = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { preferredTechStackId, preferredDemographicId } = req.body;

  const preferences = await updateUserPreferences(userId, {
    preferredTechStackId,
    preferredDemographicId,
  });

  res.status(200).json({
    success: true,
    message: "Preferences updated successfully",
    data: { preferences },
  });
};

/**
 * GET USER WORKSPACES
 * Route: GET /api/user/workspaces
 * Auth: Required
 */
export const getWorkspaces = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  const workspaces = await getUserWorkspaces(userId);

  res.status(200).json({
    success: true,
    message: "User workspaces retrieved successfully",
    data: { workspaces },
  });
};

/**
 * GET USER COLLABORATION STATISTICS
 * Route: GET /api/user/collaboration-stats
 * Auth: Required
 */
export const getCollaborationStats = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  const stats = await getUserCollaborationStats(userId);

  res.status(200).json({
    success: true,
    message: "Collaboration statistics retrieved successfully",
    data: { stats },
  });
};

/**
 * GET USER PROFILE WITH FULL CONTEXT
 * Route: GET /api/user/full-profile
 * Auth: Required
 */
export const getFullUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  // Update user's last active timestamp
  await updateUserLastActive(userId);

  // Get all user data
  const [profile, workspaces, stats] = await Promise.all([
    getLabyrinthUserProfile(userId),
    getUserWorkspaces(userId),
    getUserCollaborationStats(userId),
  ]);

  res.status(200).json({
    success: true,
    message: "Full user profile retrieved successfully",
    data: {
      profile,
      workspaces,
      collaborationStats: stats,
    },
  });
};
