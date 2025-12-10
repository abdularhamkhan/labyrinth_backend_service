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
import {
  UserProfile,
  UpdateProfileInput,
  UpdateProfileResponse,
  LabyrinthUserProfile,
  CreateTechStackInput,
  CreateDemographicInput,
  UpdatePreferencesInput,
  UserProfileWithRelations,
} from "../schemas/user.schema";
import { FileUpload } from "../schemas/avatar.schema";
// Kafka disabled - import commented out
// import kafkaProducer from "./kafka-producer.service";
import { getOrSetCache, CacheKeys, CACHE_TTL, deleteCache } from "../utils/cache.util";

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
    // Try to get from cache first
    return await getOrSetCache(
      CacheKeys.userProfile(userId),
      async () => {
        const userProfile = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            lastActive: true,
            gitHubProfile: true,
            education: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!userProfile) {
          throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
        }

        return userProfile;
      },
      CACHE_TTL.USER_PROFILE
    );
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
      select: { id: true },
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
      data: { updatedAt: new Date() },
      select: { id: true, username: true },
    });

    return {
      userId: updatedUser.id,
      newAvatarUrl: newAvatarPath,
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
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    await deleteUserAvatarFiles(userId); // Fixed: should pass userId, not avatar path

    await prisma.user.update({
      where: { id: userId },
      data: { updatedAt: new Date() },
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
        gitHubProfile: true,
        education: true,
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
    if (
      updateData.gitHubProfile !== undefined &&
      updateData.gitHubProfile !== currentUser.gitHubProfile
    ) {
      changedFields.gitHubProfile = updateData.gitHubProfile;
    }
    if (updateData.education !== undefined && updateData.education !== currentUser.education) {
      changedFields.education = updateData.education;
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
          dateOfBirth: true,
          lastActive: true,
          gitHubProfile: true,
          education: true,
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
        dateOfBirth: true,
        lastActive: true,
        gitHubProfile: true,
        education: true,
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
      select: { id: true, email: true, username: true },
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

// =============================================================================
// LABYRINTH USER PROFILE MANAGEMENT SERVICES
// =============================================================================

/**
 * Get comprehensive user profile with all Labyrinth-specific data
 */
export const getLabyrinthUserProfile = async (userId: string): Promise<LabyrinthUserProfile> => {
  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        lastActive: true,
        gitHubProfile: true,
        education: true,
        maxDailySwipes: true,
        techStack: {
          select: {
            id: true,
            frameworks: true,
            languages: true,
            tools: true,
          },
        },
        demographic: {
          select: {
            id: true,
            country: true,
            languages: true,
          },
        },
        preferences: {
          select: {
            id: true,
            preferredTechStack: {
              select: {
                id: true,
                frameworks: true,
                languages: true,
                tools: true,
              },
            },
            preferredDemographic: {
              select: {
                id: true,
                country: true,
                languages: true,
              },
            },
          },
        },
        workspaces: {
          select: {
            id: true,
            createdAt: true,
          },
        },
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!userProfile) {
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    // Publish user profile viewed event
    // await kafkaProducer.publishUserActivity(userId, "profile_viewed", {
    //   viewedAt: new Date().toISOString(),
    // });

    return userProfile as LabyrinthUserProfile;
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Create or update user's tech stack
 */
export const upsertUserTechStack = async (
  userId: string,
  techStackData: CreateTechStackInput
): Promise<any> => {
  try {
    // Check if user already has a tech stack
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { techStackId: true },
    });

    if (!user) {
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    let techStack;

    if (user.techStackId) {
      // Update existing tech stack
      techStack = await prisma.techStack.update({
        where: { id: user.techStackId },
        data: {
          frameworks: techStackData.frameworks,
          languages: techStackData.languages,
          tools: techStackData.tools,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new tech stack and link to user
      techStack = await prisma.techStack.create({
        data: {
          frameworks: techStackData.frameworks,
          languages: techStackData.languages,
          tools: techStackData.tools,
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { techStackId: techStack.id },
      });
    }

    // Publish tech stack updated event
    // await kafkaProducer.publishUserActivity(userId, "tech_stack_updated", {
    //   techStackId: techStack.id,
    //   frameworks: techStack.frameworks,
    //   languages: techStack.languages,
    //   tools: techStack.tools,
    //   updatedAt: new Date().toISOString(),
    // });

    return techStack;
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Create or update user's demographic information
 */
export const upsertUserDemographic = async (
  userId: string,
  demographicData: CreateDemographicInput
): Promise<any> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { demographicId: true },
    });

    if (!user) {
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    let demographic;

    if (user.demographicId) {
      // Update existing demographic
      demographic = await prisma.demographic.update({
        where: { id: user.demographicId },
        data: {
          country: demographicData.country,
          languages: demographicData.languages,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new demographic and link to user
      demographic = await prisma.demographic.create({
        data: {
          country: demographicData.country,
          languages: demographicData.languages,
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { demographicId: demographic.id },
      });
    }

    // Invalidate demographic cache
    await deleteCache(CacheKeys.userDemographic(userId));

    // Publish demographic updated event
    // await kafkaProducer.publishUserActivity(userId, "demographic_updated", {
    //   demographicId: demographic.id,
    //   country: demographic.country,
    //   languages: demographic.languages,
    //   updatedAt: new Date().toISOString(),
    // });

    return demographic;
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Get user's demographic information
 */
export const getUserDemographic = async (userId: string): Promise<any> => {
  try {
    // Try to get from cache first
    return await getOrSetCache(
      CacheKeys.userDemographic(userId),
      async () => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            demographic: {
              select: { id: true, country: true, languages: true },
            },
          },
        });

        if (!user) {
          throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
        }

        return user.demographic || null;
      },
      CACHE_TTL.USER_PROFILE
    );
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Create or update user's preferences
 */
export const updateUserPreferences = async (
  userId: string,
  preferencesData: UpdatePreferencesInput
): Promise<any> => {
  try {
    // Get or create user preferences
    let preferences = await prisma.preferences.findUnique({
      where: { userId },
    });

    if (!preferences) {
      preferences = await prisma.preferences.create({
        data: {
          userId,
          preferredTechStackId: preferencesData.preferredTechStackId,
          preferredDemographicId: preferencesData.preferredDemographicId,
        },
      });
    } else {
      preferences = await prisma.preferences.update({
        where: { userId },
        data: {
          preferredTechStackId: preferencesData.preferredTechStackId,
          preferredDemographicId: preferencesData.preferredDemographicId,
          updatedAt: new Date(),
        },
      });
    }

    // Publish preferences updated event
    // await kafkaProducer.publishUserActivity(userId, "preferences_updated", {
    //   preferencesId: preferences.id,
    //   preferredTechStackId: preferences.preferredTechStackId,
    //   preferredDemographicId: preferences.preferredDemographicId,
    //   updatedAt: new Date().toISOString(),
    // });

    return preferences;
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Update user's core profile information for Labyrinth
 */
export const updateLabyrinthUserProfile = async (userId: string, updateData: any): Promise<any> => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        username: true,
        dateOfBirth: true,
        gitHubProfile: true,
        education: true,
        maxDailySwipes: true,
      },
    });

    if (!currentUser) {
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    // Build update object with only changed fields
    const changedFields: any = {};

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined && updateData[key] !== (currentUser as any)[key]) {
        changedFields[key] = updateData[key];
      }
    });

    if (Object.keys(changedFields).length === 0) {
      return {
        message: "No changes detected",
        updated: false,
      };
    }

    // Convert dateOfBirth to ISO-8601 DateTime if present
    if (changedFields.dateOfBirth && typeof changedFields.dateOfBirth === 'string') {
      // If dateOfBirth is in YYYY-MM-DD format, convert to full DateTime
      if (/^\d{4}-\d{2}-\d{2}$/.test(changedFields.dateOfBirth)) {
        changedFields.dateOfBirth = new Date(changedFields.dateOfBirth + 'T00:00:00.000Z');
      } else {
        // Otherwise try to parse as Date
        changedFields.dateOfBirth = new Date(changedFields.dateOfBirth);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...changedFields,
        updatedAt: new Date(),
      },
    });

    // Invalidate user profile cache
    await deleteCache(CacheKeys.userProfile(userId));

    // Publish user profile updated event
    // await kafkaProducer.publishUserProfileUpdated(userId, {
    //   updatedFields: Object.keys(changedFields),
    //   updatedAt: new Date().toISOString(),
    // });

    return {
      user: updatedUser,
      message: "User profile updated successfully",
      updated: true,
      updatedFields: Object.keys(changedFields),
    };
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Get user's workspaces with collaboration details
 */
export const getUserWorkspaces = async (userId: string): Promise<any[]> => {
  try {
    const workspaces = await prisma.workspace.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
            collaborators: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return workspaces;
  } catch (error) {
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Get user's collaboration statistics
 */
export const getUserCollaborationStats = async (userId: string): Promise<any> => {
  try {
    const stats = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        _count: {
          select: {
            projects: true,
            workspaces: true,
            swipesMade: true,
            swipesReceived: true,
            messages: true,
          },
        },
        swipesMade: {
          where: {
            isRightSwipe: true,
          },
          select: { id: true },
        },
        matchUsers: {
          select: { id: true },
        },
      },
    });

    if (!stats) {
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    return {
      projectsCount: stats._count.projects,
      workspacesCount: stats._count.workspaces,
      totalSwipes: stats._count.swipesMade,
      rightSwipes: stats.swipesMade.length,
      swipesReceived: stats._count.swipesReceived,
      messagesCount: stats._count.messages,
      matchesCount: stats.matchUsers.length,
    };
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Update user's last active timestamp
 */
export const updateUserLastActive = async (userId: string): Promise<void> => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastActive: new Date(),
      },
    });

    // Publish user activity event
    // await kafkaProducer.publishUserActivity(userId, "profile_accessed", {
    //   timestamp: new Date().toISOString(),
    // });
  } catch (error) {
    // Don't throw error for activity tracking to avoid breaking main flows
    console.error("Failed to update user last active:", error);
  }
};
