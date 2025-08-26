import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  getUserProfileService,
  updateUserProfileService,
  deleteUserService,
  uploadUserAvatarService,
  deleteUserAvatarService,
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
  const { firstName, lastName, username } = req.body;

  // Build update object with only provided fields
  const updateData: any = {};
  if (firstName !== undefined) updateData.firstName = firstName;
  if (lastName !== undefined) updateData.lastName = lastName;
  if (username !== undefined) updateData.username = username;

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

/**
 * =============================================================================
 * ADDITIONAL CONTROLLER EXAMPLES
 * =============================================================================
 *
 * Here are templates for additional user controllers you might need:
 *
 * 1. GET USER GAME STATS:
 *    export const getUserGameStats = async (req: AuthenticatedRequest, res: Response) => {
 *        // Similar logging pattern
 *        // Fetch game-related data for the user
 *    };
 *
 * 2. UPDATE USER PREFERENCES:
 *    export const updateUserPreferences = async (req: AuthenticatedRequest, res: Response) => {
 *        // Similar logging pattern
 *        // Update user preferences/settings
 *    };
 *
 * 3. GET USER ACHIEVEMENTS:
 *    export const getUserAchievements = async (req: AuthenticatedRequest, res: Response) => {
 *        // Similar logging pattern
 *        // Fetch user achievements/badges
 *    };
 *
 * =============================================================================
 */
