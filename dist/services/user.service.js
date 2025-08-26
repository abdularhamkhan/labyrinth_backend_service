"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserService = exports.updateUserProfileService = exports.deleteUserAvatarService = exports.uploadUserAvatarService = exports.getUserProfileService = void 0;
const prisma_1 = require("../config/prisma");
const error_1 = require("../constants/error");
const avatar_service_1 = require("./avatar.service");
/**
 * =============================================================================
 * GET USER PROFILE SERVICE
 * =============================================================================
 *
 * Retrieves user profile information from the database.
 *
 * Usage: Service is used by getUserProfile controller to fetch user data.
 *
 * Flow:
 * 1. Validate userId
 * 2. Fetch user from database
 * 3. Return user profile data
 *
 * =============================================================================
 */
const getUserProfileService = async (userId) => {
    try {
        const userProfile = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!userProfile) {
            throw new error_1.NotFoundError(error_1.USER_ERRORS.USER_NOT_FOUND.message, error_1.USER_ERRORS.USER_NOT_FOUND.code);
        }
        return userProfile;
    }
    catch (error) {
        if (error instanceof Error && error.name.includes("Error")) {
            throw error; // Re-throw our custom errors
        }
        throw new error_1.DatabaseError(error_1.DATABASE_ERRORS.QUERY_FAILED.message, error_1.DATABASE_ERRORS.QUERY_FAILED.code, { originalError: error });
    }
};
exports.getUserProfileService = getUserProfileService;
/**
 * =============================================================================
 * UPLOAD USER AVATAR SERVICE
 * =============================================================================
 *
 * Uploads and updates user avatar.
 *
 * Usage: Called within controllers to manage avatar image storage and DB updates.
 * =============================================================================
 */
const uploadUserAvatarService = async (userId, fileUpload) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { avatar: true },
        });
        if (!user) {
            throw new error_1.NotFoundError(error_1.USER_ERRORS.USER_NOT_FOUND.message, error_1.USER_ERRORS.USER_NOT_FOUND.code);
        }
        const newAvatarPath = await (0, avatar_service_1.uploadAvatar)(userId, fileUpload.buffer, fileUpload.originalname, fileUpload.mimetype);
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { avatar: newAvatarPath, updatedAt: new Date() },
            select: { id: true, username: true, avatar: true },
        });
        return {
            userId: updatedUser.id,
            newAvatarUrl: updatedUser.avatar,
        };
    }
    catch (error) {
        if (error instanceof Error && error.name.includes("Error")) {
            throw error; // Re-throw our custom errors
        }
        throw new error_1.DatabaseError(error_1.DATABASE_ERRORS.QUERY_FAILED.message, error_1.DATABASE_ERRORS.QUERY_FAILED.code, { originalError: error });
    }
};
exports.uploadUserAvatarService = uploadUserAvatarService;
/**
 * =============================================================================
 * DELETE USER AVATAR SERVICE
 * =============================================================================
 *
 * Deletes user avatar from storage and updates DB.
 *
 * Usage: Called within controllers to manage avatar deletion and DB updates.
 * =============================================================================
 */
const deleteUserAvatarService = async (userId) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { avatar: true },
        });
        if (!user || !user.avatar) {
            throw new error_1.NotFoundError(error_1.USER_ERRORS.USER_NOT_FOUND.message, error_1.USER_ERRORS.USER_NOT_FOUND.code);
        }
        await (0, avatar_service_1.deleteUserAvatarFiles)(userId); // Fixed: should pass userId, not avatar path
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { avatar: null, updatedAt: new Date() },
        });
        return {
            userId,
            message: "User avatar deleted successfully",
        };
    }
    catch (error) {
        if (error instanceof Error && error.name.includes("Error")) {
            throw error; // Re-throw our custom errors
        }
        throw new error_1.DatabaseError(error_1.DATABASE_ERRORS.QUERY_FAILED.message, error_1.DATABASE_ERRORS.QUERY_FAILED.code, { originalError: error });
    }
};
exports.deleteUserAvatarService = deleteUserAvatarService;
/**
 * =============================================================================
 * UPDATE USER PROFILE SERVICE
 * =============================================================================
 *
 * Updates user profile information in the database.
 *
 * Usage: Service is used by updateUserProfile controller to update user data.
 *
 * Flow:
 * 1. Fetch current user data
 * 2. Compare and build update object with only changed fields
 * 3. Update user in database if changes exist
 * 4. Return updated user profile
 *
 * =============================================================================
 */
const updateUserProfileService = async (userId, updateData) => {
    try {
        // Step 1: Fetch current user data
        const currentUser = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                lastName: true,
                username: true,
                avatar: true,
            },
        });
        if (!currentUser) {
            throw new error_1.NotFoundError(error_1.USER_ERRORS.USER_NOT_FOUND.message, error_1.USER_ERRORS.USER_NOT_FOUND.code);
        }
        // Step 2: Build update object with only changed fields
        const changedFields = {};
        if (updateData.firstName !== undefined && updateData.firstName !== currentUser.firstName) {
            changedFields.firstName = updateData.firstName;
        }
        if (updateData.lastName !== undefined && updateData.lastName !== currentUser.lastName) {
            changedFields.lastName = updateData.lastName;
        }
        if (updateData.username !== undefined && updateData.username !== currentUser.username) {
            changedFields.username = updateData.username;
        }
        if (updateData.avatar !== undefined && updateData.avatar !== currentUser.avatar) {
            changedFields.avatar = updateData.avatar;
        }
        // Step 3: Update only if there are changes
        if (Object.keys(changedFields).length === 0) {
            // Return full user profile even if no changes
            const fullUser = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    avatar: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            if (!fullUser) {
                throw new error_1.NotFoundError(error_1.USER_ERRORS.USER_NOT_FOUND.message, error_1.USER_ERRORS.USER_NOT_FOUND.code);
            }
            return {
                user: fullUser,
                message: "No changes detected",
                updated: false,
            };
        }
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: {
                ...changedFields,
                updatedAt: new Date(),
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return {
            user: updatedUser,
            message: "User profile updated successfully",
            updated: true,
            updatedFields: Object.keys(changedFields),
        };
    }
    catch (error) {
        // Handle specific database errors
        if (error instanceof Error && error.message.includes("Unique constraint")) {
            throw new error_1.ConflictError(error_1.USER_ERRORS.USERNAME_ALREADY_EXISTS.message, error_1.USER_ERRORS.USERNAME_ALREADY_EXISTS.code);
        }
        if (error instanceof Error && error.name.includes("Error")) {
            throw error; // Re-throw our custom errors
        }
        throw new error_1.DatabaseError(error_1.DATABASE_ERRORS.QUERY_FAILED.message, error_1.DATABASE_ERRORS.QUERY_FAILED.code, { originalError: error });
    }
};
exports.updateUserProfileService = updateUserProfileService;
/**
 * =============================================================================
 * DELETE USER SERVICE
 * =============================================================================
 *
 * Deletes user account from the database.
 *
 * Usage: Service is used by deleteUserAccount controller to remove user.
 *
 * Flow:
 * 1. Check if user exists
 * 2. Delete user from database
 * 3. Return deletion confirmation
 *
 * =============================================================================
 */
const deleteUserService = async (userId) => {
    try {
        // Step 1: Check if user exists
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, username: true, avatar: true },
        });
        if (!existingUser) {
            throw new error_1.NotFoundError(error_1.USER_ERRORS.USER_NOT_FOUND.message, error_1.USER_ERRORS.USER_NOT_FOUND.code);
        }
        // Step 2: Delete user from database
        await prisma_1.prisma.user.delete({
            where: { id: userId },
        });
        // Note: In a complete implementation, you might also want to:
        // - Delete user from Supabase Auth
        // - Delete user's avatar from storage
        // - Clean up any related data (game stats, etc.)
        return {
            message: "User account deleted successfully",
            deletedUserId: userId,
            deletedUsername: existingUser.username,
        };
    }
    catch (error) {
        if (error instanceof Error && error.name.includes("Error")) {
            throw error; // Re-throw our custom errors
        }
        throw new error_1.DatabaseError(error_1.DATABASE_ERRORS.QUERY_FAILED.message, error_1.DATABASE_ERRORS.QUERY_FAILED.code, { originalError: error });
    }
};
exports.deleteUserService = deleteUserService;
