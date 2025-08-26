"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserAvatar = exports.uploadUserAvatar = exports.deleteUserAccount = exports.updateUserProfile = exports.getUserProfile = void 0;
const user_service_1 = require("../services/user.service");
const avatar_service_1 = require("../services/avatar.service");
const error_1 = require("../constants/error");
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
const getUserProfile = async (req, res) => {
    // Trust that auth middleware has validated the user
    const userId = req.user.id;
    // Delegate to service layer for business logic
    const userProfile = await (0, user_service_1.getUserProfileService)(userId);
    // Handle HTTP response
    res.status(200).json({
        success: true,
        message: "User profile retrieved successfully",
        data: { user: userProfile },
    });
};
exports.getUserProfile = getUserProfile;
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
const updateUserProfile = async (req, res) => {
    const userId = req.user.id;
    const { firstName, lastName, username } = req.body;
    // Build update object with only provided fields
    const updateData = {};
    if (firstName !== undefined)
        updateData.firstName = firstName;
    if (lastName !== undefined)
        updateData.lastName = lastName;
    if (username !== undefined)
        updateData.username = username;
    // Check if any data to update
    if (Object.keys(updateData).length === 0) {
        throw new error_1.ValidationError("No valid update data provided.");
    }
    const { user: updatedUser, updated, updatedFields, } = await (0, user_service_1.updateUserProfileService)(userId, updateData);
    res.status(200).json({
        message: "User profile updated successfully.",
        user: updatedUser,
    });
};
exports.updateUserProfile = updateUserProfile;
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
const deleteUserAccount = async (req, res) => {
    const userId = req.user.id;
    await (0, user_service_1.deleteUserService)(userId);
    res.status(200).json({
        message: "User account deleted successfully.",
        deletedUserId: userId,
    });
};
exports.deleteUserAccount = deleteUserAccount;
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
const uploadUserAvatar = async (req, res) => {
    const userId = req.user.id;
    const file = req.file;
    if (!file) {
        throw new error_1.ValidationError("No file uploaded.");
    }
    // Initialize bucket if needed
    await (0, avatar_service_1.initializeAvatarBucket)();
    const { userId: updatedUserId, newAvatarUrl } = await (0, user_service_1.uploadUserAvatarService)(userId, file);
    const updatedUser = await (0, user_service_1.getUserProfileService)(userId);
    res.status(200).json({
        message: "Avatar uploaded successfully.",
        avatarUrl: newAvatarUrl,
        user: updatedUser,
    });
};
exports.uploadUserAvatar = uploadUserAvatar;
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
const removeUserAvatar = async (req, res) => {
    const userId = req.user.id;
    const { userId: deletedUserId, message } = await (0, user_service_1.deleteUserAvatarService)(userId);
    const updatedUser = await (0, user_service_1.getUserProfileService)(userId);
    res.status(200).json({
        message: "Avatar removed successfully.",
        user: updatedUser,
    });
};
exports.removeUserAvatar = removeUserAvatar;
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
