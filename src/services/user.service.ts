import { prisma } from "../config/prisma";
import {
  USER_ERRORS,
  VALIDATION_ERRORS,
  DATABASE_ERRORS,
  NotFoundError,
  ValidationError,
  ConflictError,
  DatabaseError,
} from "../constants/error";
import { uploadAvatar, deleteUserAvatarFiles } from "./avatar.service";
import { UserProfile, UpdateProfileInput, UpdateProfileResponse } from "../schemas/user.schema";
import { FileUpload } from "../schemas/avatar.schema";

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

export const getUserProfileService = async (userId: string): Promise<UserProfile> => {
  try {
    const userProfile = await prisma.user.findUnique({
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
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    return userProfile;
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error; // Re-throw our custom errors
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

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

export const uploadUserAvatarService = async (userId: string, fileUpload: FileUpload) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    if (!user) {
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    const newAvatarPath = await uploadAvatar(
      userId,
      fileUpload.buffer,
      fileUpload.originalname,
      fileUpload.mimetype
    );

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: newAvatarPath, updatedAt: new Date() },
      select: { id: true, username: true, avatar: true },
    });

    return {
      userId: updatedUser.id,
      newAvatarUrl: updatedUser.avatar,
    };
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error; // Re-throw our custom errors
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

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

export const deleteUserAvatarService = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    if (!user || !user.avatar) {
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    await deleteUserAvatarFiles(userId); // Fixed: should pass userId, not avatar path

    await prisma.user.update({
      where: { id: userId },
      data: { avatar: null, updatedAt: new Date() },
    });

    return {
      userId,
      message: "User avatar deleted successfully",
    };
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error; // Re-throw our custom errors
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

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

export const updateUserProfileService = async (
  userId: string,
  updateData: UpdateProfileInput
): Promise<UpdateProfileResponse> => {
  try {
    // Step 1: Fetch current user data
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        username: true,
        avatar: true,
      },
    });

    if (!currentUser) {
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    // Step 2: Build update object with only changed fields
    const changedFields: any = {};

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
      const fullUser = await prisma.user.findUnique({
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
        throw new NotFoundError(
          USER_ERRORS.USER_NOT_FOUND.message,
          USER_ERRORS.USER_NOT_FOUND.code
        );
      }

      return {
        user: fullUser,
        message: "No changes detected",
        updated: false,
      };
    }

    const updatedUser = await prisma.user.update({
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
  } catch (error) {
    // Handle specific database errors
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      throw new ConflictError(
        USER_ERRORS.USERNAME_ALREADY_EXISTS.message,
        USER_ERRORS.USERNAME_ALREADY_EXISTS.code
      );
    }

    if (error instanceof Error && error.name.includes("Error")) {
      throw error; // Re-throw our custom errors
    }

    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

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

export const deleteUserService = async (userId: string) => {
  try {
    // Step 1: Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true, avatar: true },
    });

    if (!existingUser) {
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    // Step 2: Delete user from database
    await prisma.user.delete({
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
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error; // Re-throw our custom errors
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};
