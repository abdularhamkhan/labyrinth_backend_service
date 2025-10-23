import { prisma } from "../config/prisma";
import { 
  DATABASE_ERRORS,
  USER_ERRORS,
  VALIDATION_ERRORS,
  NotFoundError,
  ValidationError,
  DatabaseError,
  ConflictError,
} from "../constants/error";
import { kafkaProducer } from "./kafka-producer.service";

// =============================================================================
// MATCHMAKING AND RECOMMENDATION SERVICE - LABYRINTH PLATFORM
// =============================================================================

/**
 * Calculate compatibility score between two users based on tech stack and demographics
 */
export const calculateCompatibilityScore = (
  user1: any,
  user2: any
): number => {
  let score = 0;
  let totalFactors = 0;

  // Tech stack compatibility (40% weight)
  if (user1.techStack && user2.techStack) {
    const languages1 = new Set(user1.techStack.languages || []);
    const languages2 = new Set(user2.techStack.languages || []);
    const frameworks1 = new Set(user1.techStack.frameworks || []);
    const frameworks2 = new Set(user2.techStack.frameworks || []);
    const tools1 = new Set(user1.techStack.tools || []);
    const tools2 = new Set(user2.techStack.tools || []);

    // Language overlap
    const languageOverlap = new Set([...languages1].filter(x => languages2.has(x))).size;
    const totalLanguages = Math.max(languages1.size, languages2.size);
    if (totalLanguages > 0) {
      score += (languageOverlap / totalLanguages) * 0.2;
      totalFactors += 0.2;
    }

    // Framework overlap
    const frameworkOverlap = new Set([...frameworks1].filter(x => frameworks2.has(x))).size;
    const totalFrameworks = Math.max(frameworks1.size, frameworks2.size);
    if (totalFrameworks > 0) {
      score += (frameworkOverlap / totalFrameworks) * 0.15;
      totalFactors += 0.15;
    }

    // Tools overlap
    const toolsOverlap = new Set([...tools1].filter(x => tools2.has(x))).size;
    const totalTools = Math.max(tools1.size, tools2.size);
    if (totalTools > 0) {
      score += (toolsOverlap / totalTools) * 0.05;
      totalFactors += 0.05;
    }
  }

  // Geographic/Language compatibility (30% weight)
  if (user1.demographic && user2.demographic) {
    // Country match
    if (user1.demographic.country === user2.demographic.country) {
      score += 0.15;
    } else {
      score += 0.05; // Different countries but still some points
    }
    totalFactors += 0.15;

    // Language overlap
    const userLangs1 = new Set(user1.demographic.languages || []);
    const userLangs2 = new Set(user2.demographic.languages || []);
    const langOverlap = new Set([...userLangs1].filter(x => userLangs2.has(x))).size;
    const totalLangs = Math.max(userLangs1.size, userLangs2.size);
    if (totalLangs > 0) {
      score += (langOverlap / totalLangs) * 0.15;
      totalFactors += 0.15;
    }
  }

  // Activity level compatibility (20% weight)
  const now = new Date();
  const user1LastActive = user1.lastActive ? new Date(user1.lastActive) : null;
  const user2LastActive = user2.lastActive ? new Date(user2.lastActive) : null;

  if (user1LastActive && user2LastActive) {
    const daysSinceActive1 = Math.floor((now.getTime() - user1LastActive.getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceActive2 = Math.floor((now.getTime() - user2LastActive.getTime()) / (1000 * 60 * 60 * 24));
    
    // Both active recently gets higher score
    if (daysSinceActive1 <= 7 && daysSinceActive2 <= 7) {
      score += 0.2;
    } else if (daysSinceActive1 <= 30 && daysSinceActive2 <= 30) {
      score += 0.1;
    } else {
      score += 0.05;
    }
    totalFactors += 0.2;
  }

  // Experience level matching (10% weight)
  if (user1.education && user2.education) {
    // Simple education level matching
    if (user1.education === user2.education) {
      score += 0.1;
    } else {
      score += 0.05;
    }
    totalFactors += 0.1;
  }

  // Normalize score
  return totalFactors > 0 ? (score / totalFactors) * 100 : 0;
};

/**
 * Get user recommendations for matchmaking
 */
export const getUserRecommendations = async (
  userId: string,
  limit: number = 20
): Promise<any[]> => {
  try {
    // Get the requesting user's data
    const requestingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        techStack: true,
        demographic: true,
        preferences: {
          include: {
            preferredTechStack: true,
            preferredDemographic: true,
          },
        },
        swipesMade: {
          select: { swipeeUserId: true },
        },
        matchUsers: {
          select: { userId: true },
        },
      },
    });

    if (!requestingUser) {
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    // Get users already swiped on or matched with
    const excludedUserIds = [
      userId, // Exclude self
      ...requestingUser.swipesMade.map(swipe => swipe.swipeeUserId).filter(id => id !== null),
      ...requestingUser.matchUsers.map(match => match.userId),
    ];

    // Build filter conditions based on preferences
    const whereConditions: any = {
      id: { notIn: excludedUserIds },
      deletedAt: null,
    };

    // Apply preference filters if they exist
    if (requestingUser.preferences?.preferredTechStackId) {
      whereConditions.techStackId = requestingUser.preferences.preferredTechStackId;
    }

    if (requestingUser.preferences?.preferredDemographicId) {
      whereConditions.demographicId = requestingUser.preferences.preferredDemographicId;
    }

    // Get potential matches
    const potentialMatches = await prisma.user.findMany({
      where: whereConditions,
      include: {
        techStack: true,
        demographic: true,
        _count: {
          select: {
            projects: true,
            workspaces: true,
            swipesMade: true,
          },
        },
      },
      take: limit * 2, // Get more than needed for filtering
    });

    // Calculate compatibility scores and sort
    const scoredMatches = potentialMatches
      .map(user => ({
        ...user,
        compatibilityScore: calculateCompatibilityScore(requestingUser, user),
      }))
      .filter(user => user.compatibilityScore > 30) // Minimum threshold
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, limit);

    // Publish recommendation generated event
    await kafkaProducer.publishEvent({
      type: "USER_RECOMMENDATIONS_GENERATED",
      data: {
        userId,
        recommendationCount: scoredMatches.length,
        averageCompatibility: scoredMatches.reduce((sum, match) => sum + match.compatibilityScore, 0) / scoredMatches.length || 0,
        generatedAt: new Date().toISOString(),
      },
    });

    return scoredMatches.map(user => ({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      education: user.education,
      gitHubProfile: user.gitHubProfile,
      techStack: user.techStack,
      demographic: user.demographic,
      compatibilityScore: user.compatibilityScore,
      projectsCount: user._count.projects,
      workspacesCount: user._count.workspaces,
      swipesCount: user._count.swipesMade,
      lastActive: user.lastActive,
    }));
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
 * Get project recommendations for a user
 */
export const getProjectRecommendations = async (
  userId: string,
  limit: number = 10
): Promise<any[]> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        techStack: true,
        demographic: true,
        projects: { select: { id: true } },
        swipesMade: {
          where: { swipeeProjectId: { not: null } },
          select: { swipeeProjectId: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    // Get projects user is already part of or has swiped on
    const excludedProjectIds = [
      ...user.projects.map(p => p.id),
      ...user.swipesMade.map(swipe => swipe.swipeeProjectId).filter(id => id !== null),
    ];

    // Get potential project matches
    const projects = await prisma.project.findMany({
      where: {
        id: { notIn: excludedProjectIds },
        deletedAt: null,
      },
      include: {
        techLinks: {
          include: {
            techStack: true,
          },
        },
        collaborators: {
          include: {
            demographic: true,
          },
        },
        workspace: {
          select: {
            name: true,
            description: true,
          },
        },
        _count: {
          select: {
            collaborators: true,
            tasks: true,
          },
        },
      },
      take: limit * 2,
    });

    // Calculate project compatibility scores
    const scoredProjects = projects
      .map(project => {
        let score = 0;
        let factors = 0;

        // Tech stack compatibility
        if (user.techStack && project.techLinks.length > 0) {
          const userLanguages = new Set(user.techStack.languages);
          const userFrameworks = new Set(user.techStack.frameworks);
          const userTools = new Set(user.techStack.tools);

          project.techLinks.forEach(techLink => {
            const projectLanguages = new Set(techLink.techStack.languages);
            const projectFrameworks = new Set(techLink.techStack.frameworks);
            const projectTools = new Set(techLink.techStack.tools);

            const languageMatch = [...userLanguages].filter(l => projectLanguages.has(l)).length;
            const frameworkMatch = [...userFrameworks].filter(f => projectFrameworks.has(f)).length;
            const toolMatch = [...userTools].filter(t => projectTools.has(t)).length;

            score += (languageMatch * 0.3) + (frameworkMatch * 0.2) + (toolMatch * 0.1);
            factors += 0.6;
          });
        }

        // Geographic compatibility with existing collaborators
        if (user.demographic && project.collaborators.length > 0) {
          const userCountry = user.demographic.country;
          const sameCountryCollaborators = project.collaborators.filter(
            collab => collab.demographic?.country === userCountry
          ).length;
          
          if (sameCountryCollaborators > 0) {
            score += 0.2;
          } else {
            score += 0.1;
          }
          factors += 0.2;
        }

        // Project activity (fewer collaborators might need more help)
        const collaboratorCount = project._count.collaborators;
        if (collaboratorCount < 3) {
          score += 0.2; // Projects with fewer people get higher priority
        } else if (collaboratorCount < 6) {
          score += 0.1;
        }
        factors += 0.2;

        return {
          ...project,
          compatibilityScore: factors > 0 ? (score / factors) * 100 : 0,
        };
      })
      .filter(project => project.compatibilityScore > 20)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, limit);

    // Publish project recommendations event
    await kafkaProducer.publishEvent({
      type: "PROJECT_RECOMMENDATIONS_GENERATED",
      data: {
        userId,
        recommendationCount: scoredProjects.length,
        averageCompatibility: scoredProjects.reduce((sum, p) => sum + p.compatibilityScore, 0) / scoredProjects.length || 0,
        generatedAt: new Date().toISOString(),
      },
    });

    return scoredProjects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      workspace: project.workspace,
      collaboratorsCount: project._count.collaborators,
      tasksCount: project._count.tasks,
      techStacks: project.techLinks.map(tl => tl.techStack),
      compatibilityScore: project.compatibilityScore,
      createdAt: project.createdAt,
    }));
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
 * Handle user swipe action
 */
export const handleSwipeAction = async (
  swiperId: string,
  targetType: 'user' | 'project',
  targetId: string,
  isRightSwipe: boolean
): Promise<{ matched: boolean, matchId?: string }> => {
  try {
    // Check daily swipe limit
    const swiper = await prisma.user.findUnique({
      where: { id: swiperId },
      select: { maxDailySwipes: true },
    });

    if (!swiper) {
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    // Check today's swipes
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySwipes = await prisma.swipe.count({
      where: {
        swiperId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const maxSwipes = swiper.maxDailySwipes || 50;
    if (todaySwipes >= maxSwipes) {
      throw new ValidationError("Daily swipe limit reached");
    }

    // Check if already swiped
    const existingSwipe = await prisma.swipe.findFirst({
      where: {
        swiperId,
        ...(targetType === 'user' 
          ? { swipeeUserId: targetId } 
          : { swipeeProjectId: targetId }
        ),
      },
    });

    if (existingSwipe) {
      throw new ConflictError("Already swiped on this target", "ALREADY_SWIPED");
    }

    // Create swipe record
    const swipeData: any = {
      swiperId,
      isRightSwipe,
    };

    if (targetType === 'user') {
      swipeData.swipeeUserId = targetId;
    } else {
      swipeData.swipeeProjectId = targetId;
    }

    const swipe = await prisma.swipe.create({
      data: swipeData,
    });

    let matched = false;
    let matchId: string | undefined;

    // Check for match if it's a right swipe on a user
    if (isRightSwipe && targetType === 'user') {
      const reciprocalSwipe = await prisma.swipe.findFirst({
        where: {
          swiperId: targetId,
          swipeeUserId: swiperId,
          isRightSwipe: true,
        },
      });

      if (reciprocalSwipe) {
        // Create match
        const match = await prisma.match.create({
          data: {
            userId: swiperId,
          },
        });

        // Create match users
        await prisma.matchUser.createMany({
          data: [
            { matchId: match.id, userId: swiperId },
            { matchId: match.id, userId: targetId },
          ],
        });

        matched = true;
        matchId = match.id;

        // Publish match event
        await kafkaProducer.publishEvent({
          type: "USER_MATCH_CREATED",
          data: {
            matchId: match.id,
            user1Id: swiperId,
            user2Id: targetId,
            matchedAt: new Date().toISOString(),
          },
        });
      }
    }

    // Publish swipe event
    await kafkaProducer.publishEvent({
      type: "USER_SWIPE_ACTION",
      data: {
        swipeId: swipe.id,
        swiperId,
        targetType,
        targetId,
        isRightSwipe,
        matched,
        matchId,
        swipedAt: new Date().toISOString(),
      },
    });

    return { matched, matchId };
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
 * Get user's matches
 */
export const getUserMatches = async (userId: string): Promise<any[]> => {
  try {
    const matches = await prisma.matchUser.findMany({
      where: { userId },
      include: {
        match: {
          include: {
            matchedUsers: {
              where: { userId: { not: userId } },
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    lastActive: true,
                    techStack: true,
                    demographic: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return matches.map(match => ({
      matchId: match.match.id,
      matchedUser: match.match.matchedUsers[0]?.user,
      matchedAt: match.match.createdAt,
    }));
  } catch (error) {
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Get daily swipe count for user
 */
export const getDailySwipeCount = async (userId: string): Promise<{ count: number, limit: number }> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { maxDailySwipes: true },
    });

    if (!user) {
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await prisma.swipe.count({
      where: {
        swiperId: userId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    return {
      count,
      limit: user.maxDailySwipes || 50,
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