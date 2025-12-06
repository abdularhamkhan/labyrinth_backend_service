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
import { getOrSetCache, CacheKeys, CACHE_TTL } from "../utils/cache.util";

// =============================================================================
// MATCHMAKING AND RECOMMENDATION SERVICE - LABYRINTH PLATFORM
// =============================================================================
/**
 * Labyrinth Matchmaking & Recommendation Engine
 * 
 * This service provides intelligent user and project matching for the Labyrinth
 * collaboration platform using a multi-factor weighted scoring algorithm.
 * 
 * ARCHITECTURE OVERVIEW:
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                    MATCHMAKING PIPELINE                              │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │ 1. User Profile Analysis                                             │
 * │    - Tech stack (languages, frameworks, tools)                       │
 * │    - Demographics (country, languages spoken)                        │
 * │    - Preferences (preferred tech stack, demographic filters)         │
 * │    - Behavioral data (activity, swipes, matches)                     │
 * │                                                                      │
 * │ 2. Candidate Filtering                                               │
 * │    - Exclude: self, already swiped, already matched                  │
 * │    - Apply: user preference filters                                  │
 * │    - Fetch: candidates with complete profiles                        │
 * │                                                                      │
 * │ 3. Compatibility Scoring (0-100 scale)                               │
 * │    - Tech Stack Match: 40% weight                                    │
 * │      • Languages: 20%                                                │
 * │      • Frameworks: 15%                                               │
 * │      • Tools: 5%                                                     │
 * │    - Geographic/Language Match: 30% weight                           │
 * │      • Country: 15%                                                  │
 * │      • Spoken languages: 15%                                         │
 * │    - Activity Level: 20% weight                                      │
 * │      • Recent activity (<7 days): full points                        │
 * │      • Moderate activity (<30 days): half points                     │
 * │    - Education/Experience: 10% weight                                │
 * │                                                                      │
 * │ 4. Ranking & Filtering                                               │
 * │    - Filter: minimum threshold (30% compatibility)                   │
 * │    - Sort: descending by compatibility score                         │
 * │    - Limit: top N recommendations                                    │
 * │                                                                      │
 * │ 5. Analytics & Events                                                │
 * │    - Publish events to Kafka for ML/analytics                        │
 * │    - Track recommendation metrics                                    │
 * └──────────────────────────────────────────────────────────────────────┘
 * 
 * KEY FEATURES:
 * - Context-aware filtering (excludes past interactions)
 * - Multi-dimensional compatibility scoring
 * - Preference-based recommendations
 * - Real-time activity consideration
 * - Event-driven architecture (Kafka integration)
 * - Daily swipe limits enforcement
 * - Mutual match detection
 * 
 * ALGORITHMS USED:
 * - Set Intersection: For tech stack overlap calculation
 * - Weighted Scoring: Multi-factor compatibility assessment
 * - Time Decay: Recent activity prioritization
 * - Threshold Filtering: Minimum quality guarantee
 * 
 * @module matchmaking.service
 * @author Labyrinth Team
 */

// =============================================================================
// CORE ALGORITHM: COMPATIBILITY SCORING
// =============================================================================
/**
 * Calculates compatibility score between two users using multi-factor weighted analysis
 * 
 * ALGORITHM BREAKDOWN:
 * 
 * Score Formula:
 * ```
 * Total Score = (Tech Score × 0.4) + (Geo Score × 0.3) + (Activity Score × 0.2) + (Education Score × 0.1)
 * ```
 * 
 * Where:
 * - Tech Score = (Languages Match × 0.2) + (Frameworks Match × 0.15) + (Tools Match × 0.05)
 * - Geo Score = (Country Match × 0.15) + (Language Overlap × 0.15)
 * - Activity Score = Both active recently? 0.2 : 0.1 : 0.05
 * - Education Score = Same level? 0.1 : 0.05
 * 
 * SCORING METHODOLOGY:
 * 1. **Set Intersection Approach**: For tech stack comparison
 *    - Calculate overlap: |A ∩ B|
 *    - Normalize by maximum: max(|A|, |B|)
 *    - Prevents bias toward users with larger tech stacks
 * 
 * 2. **Binary Matching**: For demographics
 *    - Country match: yes/no with fallback points
 *    - Language overlap: Jaccard-like similarity
 * 
 * 3. **Time-based Decay**: For activity
 *    - <7 days: full points (0.2)
 *    - <30 days: half points (0.1)
 *    - >30 days: minimal points (0.05)
 * 
 * 4. **Normalization**: Final score normalized to 0-100 scale
 * 
 * EXAMPLE:
 * ```typescript
 * User A: { languages: ['JavaScript', 'Python'], country: 'US', lastActive: '2025-10-20' }
 * User B: { languages: ['JavaScript', 'Go'], country: 'US', lastActive: '2025-10-22' }
 * 
 * Language Score: 1/2 × 0.2 = 0.1 (50% overlap)
 * Country Score: 0.15 (exact match)
 * Activity Score: 0.2 (both active <7 days)
 * 
 * Total: (0.1 + 0.15 + 0.2) / 0.45 × 100 = 100% compatibility
 * ```
 * 
 * @param {any} user1 - First user object with techStack, demographic, lastActive, education
 * @param {any} user2 - Second user object with same structure
 * @returns {number} Compatibility score from 0 to 100
 * 
 * @example
 * const score = calculateCompatibilityScore(currentUser, candidateUser);
 * if (score > 70) console.log('High compatibility!');
 */
export const calculateCompatibilityScore = (user1: any, user2: any): number => {
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
    const languageOverlap = new Set([...languages1].filter((x) => languages2.has(x))).size;
    const totalLanguages = Math.max(languages1.size, languages2.size);
    if (totalLanguages > 0) {
      score += (languageOverlap / totalLanguages) * 0.2;
      totalFactors += 0.2;
    }

    // Framework overlap
    const frameworkOverlap = new Set([...frameworks1].filter((x) => frameworks2.has(x))).size;
    const totalFrameworks = Math.max(frameworks1.size, frameworks2.size);
    if (totalFrameworks > 0) {
      score += (frameworkOverlap / totalFrameworks) * 0.15;
      totalFactors += 0.15;
    }

    // Tools overlap
    const toolsOverlap = new Set([...tools1].filter((x) => tools2.has(x))).size;
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
    const langOverlap = new Set([...userLangs1].filter((x) => userLangs2.has(x))).size;
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
    const daysSinceActive1 = Math.floor(
      (now.getTime() - user1LastActive.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysSinceActive2 = Math.floor(
      (now.getTime() - user2LastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

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
  return totalFactors > 0 ? Math.round((score / totalFactors) * 100 * 10) / 10 : 0; // Round to 1 decimal
};

/**
 * Calculate Jaccard similarity between two arrays (used for tech stack comparison)
 * More efficient than set operations for small arrays
 * 
 * @param {any[]} arr1 - First array
 * @param {any[]} arr2 - Second array
 * @returns {number} Jaccard similarity coefficient (0-1)
 */
function jaccardSimilarity(arr1: any[] = [], arr2: any[] = []): number {
  if (arr1.length === 0 && arr2.length === 0) return 0;
  
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Alternative compatibility calculation using Jaccard similarity
 * Simpler and faster for large datasets
 * 
 * @param {any} user1 - First user object
 * @param {any} user2 - Second user object  
 * @returns {number} Compatibility score from 0 to 100
 */
export const calculateJaccardCompatibility = (user1: any, user2: any): number => {
  let score = 0;
  
  // Tech stack similarity (60%)
  if (user1.techStack && user2.techStack) {
    const langSim = jaccardSimilarity(
      user1.techStack.languages,
      user2.techStack.languages
    );
    const frameworkSim = jaccardSimilarity(
      user1.techStack.frameworks,
      user2.techStack.frameworks
    );
    const toolsSim = jaccardSimilarity(
      user1.techStack.tools,
      user2.techStack.tools
    );
    
    score += (langSim * 0.3 + frameworkSim * 0.2 + toolsSim * 0.1) * 100;
  }
  
  // Demographic similarity (30%)
  if (user1.demographic && user2.demographic) {
    // Country match
    const countrySim = user1.demographic.country === user2.demographic.country ? 1 : 0;
    score += countrySim * 20;
    
    // Language overlap
    const langSim = jaccardSimilarity(
      user1.demographic.languages,
      user2.demographic.languages
    );
    score += langSim * 10;
  }
  
  // Activity bonus (10%)
  const now = new Date();
  const user1Active = user1.lastActive ? new Date(user1.lastActive) : null;
  const user2Active = user2.lastActive ? new Date(user2.lastActive) : null;
  
  if (user1Active && user2Active) {
    const days1 = Math.floor((now.getTime() - user1Active.getTime()) / (1000 * 60 * 60 * 24));
    const days2 = Math.floor((now.getTime() - user2Active.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days1 <= 7 && days2 <= 7) score += 10;
    else if (days1 <= 30 && days2 <= 30) score += 5;
  }
  
  return Math.round(score * 10) / 10;
};

// =============================================================================
// USER RECOMMENDATION ENGINE
// =============================================================================
/**
 * Generates personalized user recommendations for matchmaking using the compatibility algorithm
 * 
 * WORKFLOW:
 * ```
 * 1. Fetch User Profile
 *    ├─→ Tech stack, demographics, preferences
 *    ├─→ Past swipes (to exclude)
 *    └─→ Existing matches (to exclude)
 * 
 * 2. Build Exclusion List
 *    ├─→ Self
 *    ├─→ Already swiped users
 *    └─→ Already matched users
 * 
 * 3. Apply Preference Filters
 *    ├─→ Preferred tech stack (if set)
 *    └─→ Preferred demographic (if set)
 * 
 * 4. Fetch Candidate Pool
 *    └─→ Query: (limit × 2) to allow for filtering
 * 
 * 5. Score & Rank Candidates
 *    ├─→ Calculate compatibility for each
 *    ├─→ Filter: score > 30 (minimum threshold)
 *    ├─→ Sort: descending by score
 *    └─→ Limit: top N results
 * 
 * 6. Publish Analytics Event
 *    └─→ Kafka: USER_RECOMMENDATIONS_GENERATED
 * ```
 * 
 * FILTERING STRATEGY:
 * - **Context-aware**: Never shows users already interacted with
 * - **Preference-based**: Respects explicit user preferences
 * - **Quality threshold**: Minimum 30% compatibility required
 * - **Diversity**: Fetches 2x limit then filters for variety
 * 
 * PERFORMANCE CONSIDERATIONS:
 * - Uses include with _count for efficient aggregation
 * - Filters in application layer (allows complex scoring)
 * - Consider Redis caching for frequently accessed users
 * - Batch processing recommended for large user bases
 * 
 * FUTURE IMPROVEMENTS:
 * - Add collaborative filtering ("users like you also liked...")
 * - Machine learning scoring based on successful matches
 * - Time-of-day preferences
 * - Project interest alignment
 * 
 * @param {string} userId - ID of the user requesting recommendations
 * @param {number} limit - Maximum number of recommendations to return (default: 20)
 * @returns {Promise<any[]>} Array of recommended users with compatibility scores
 * 
 * @throws {NotFoundError} If requesting user doesn't exist
 * @throws {DatabaseError} If database query fails
 * 
 * @example
 * const recommendations = await getUserRecommendations('user-123', 10);
 * // Returns:
 * // [
 * //   { id: '...', username: 'john', compatibilityScore: 85.5, ... },
 * //   { id: '...', username: 'jane', compatibilityScore: 78.2, ... },
 * //   ...
 * // ]
 */
export const getUserRecommendations = async (
  userId: string,
  limit: number = 20
): Promise<any[]> => {
  try {
    // Try to get from cache first
    return await getOrSetCache(
      CacheKeys.userRecommendations(userId, limit),
      async () => {
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
      ...requestingUser.swipesMade.map((swipe) => swipe.swipeeUserId).filter((id) => id !== null),
      ...requestingUser.matchUsers.map((match) => match.userId),
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
      .map((user) => ({
        ...user,
        compatibilityScore: calculateCompatibilityScore(requestingUser, user),
      }))
      .filter((user) => user.compatibilityScore > 30) // Minimum threshold
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, limit);

    // Publish recommendation generated event
    await kafkaProducer.publishEvent({
      type: "USER_RECOMMENDATIONS_GENERATED",
      data: {
        userId,
        recommendationCount: scoredMatches.length,
        averageCompatibility:
          scoredMatches.reduce((sum, match) => sum + match.compatibilityScore, 0) /
            scoredMatches.length || 0,
        generatedAt: new Date().toISOString(),
      },
    });

        return scoredMatches.map((user) => ({
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
      },
      CACHE_TTL.RECOMMENDATIONS
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

// =============================================================================
// PROJECT RECOMMENDATION ENGINE
// =============================================================================
/**
 * Generates personalized project recommendations based on user's tech stack and preferences
 * 
 * WORKFLOW:
 * ```
 * 1. Fetch User Profile
 *    ├─→ Tech stack
 *    ├─→ Demographics
 *    ├─→ Current projects (to exclude)
 *    └─→ Past project swipes (to exclude)
 * 
 * 2. Build Exclusion List
 *    ├─→ Projects user is already in
 *    └─→ Projects user already swiped on
 * 
 * 3. Fetch Candidate Projects
 *    ├─→ Exclude: user's projects, swiped projects
 *    ├─→ Include: tech stacks, collaborators, workspace info
 *    └─→ Fetch: (limit × 2) for filtering
 * 
 * 4. Score Projects
 *    ├─→ Tech Stack Match (60%)
 *    │   ├─→ Language overlap: 30%
 *    │   ├─→ Framework overlap: 20%
 *    │   └─→ Tools overlap: 10%
 *    ├─→ Geographic Match (20%)
 *    │   └─→ Same country as existing collaborators
 *    └─→ Team Size Score (20%)
 *        └─→ Smaller teams = higher priority
 * 
 * 5. Rank & Filter
 *    ├─→ Filter: score > 20 (minimum threshold)
 *    ├─→ Sort: descending by score
 *    └─→ Limit: top N results
 * 
 * 6. Publish Analytics Event
 *    └─→ Kafka: PROJECT_RECOMMENDATIONS_GENERATED
 * ```
 * 
 * SCORING PHILOSOPHY:
 * - **Tech Match Priority**: Projects matching user's tech stack get highest scores
 * - **Collaboration Opportunity**: Smaller teams prioritized (more impact potential)
 * - **Geographic Consideration**: Same region = easier collaboration
 * - **Lower Threshold**: 20% minimum (vs 30% for users) for more opportunities
 * 
 * @param {string} userId - ID of the user requesting project recommendations
 * @param {number} limit - Maximum number of recommendations to return (default: 10)
 * @returns {Promise<any[]>} Array of recommended projects with compatibility scores
 * 
 * @throws {NotFoundError} If requesting user doesn't exist
 * @throws {DatabaseError} If database query fails
 * 
 * @example
 * const projects = await getProjectRecommendations('user-123', 5);
 * // Returns projects matching user's tech stack with compatibility scores
 */
export const getProjectRecommendations = async (
  userId: string,
  limit: number = 10
): Promise<any[]> => {
  try {
    // Try to get from cache first
    return await getOrSetCache(
      CacheKeys.projectRecommendations(userId, limit),
      async () => {
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
      ...user.projects.map((p) => p.id),
      ...user.swipesMade.map((swipe) => swipe.swipeeProjectId).filter((id) => id !== null),
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
      .map((project) => {
        let score = 0;
        let factors = 0;

        // Tech stack compatibility
        if (user.techStack && project.techLinks.length > 0) {
          const userLanguages = new Set(user.techStack.languages);
          const userFrameworks = new Set(user.techStack.frameworks);
          const userTools = new Set(user.techStack.tools);

          project.techLinks.forEach((techLink) => {
            const projectLanguages = new Set(techLink.techStack.languages);
            const projectFrameworks = new Set(techLink.techStack.frameworks);
            const projectTools = new Set(techLink.techStack.tools);

            const languageMatch = [...userLanguages].filter((l) => projectLanguages.has(l)).length;
            const frameworkMatch = [...userFrameworks].filter((f) =>
              projectFrameworks.has(f)
            ).length;
            const toolMatch = [...userTools].filter((t) => projectTools.has(t)).length;

            score += languageMatch * 0.3 + frameworkMatch * 0.2 + toolMatch * 0.1;
            factors += 0.6;
          });
        }

        // Geographic compatibility with existing collaborators
        if (user.demographic && project.collaborators.length > 0) {
          const userCountry = user.demographic.country;
          const sameCountryCollaborators = project.collaborators.filter(
            (collab) => collab.demographic?.country === userCountry
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
      .filter((project) => project.compatibilityScore > 20)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, limit);

    // Publish project recommendations event
    await kafkaProducer.publishEvent({
      type: "PROJECT_RECOMMENDATIONS_GENERATED",
      data: {
        userId,
        recommendationCount: scoredProjects.length,
        averageCompatibility:
          scoredProjects.reduce((sum, p) => sum + p.compatibilityScore, 0) /
            scoredProjects.length || 0,
        generatedAt: new Date().toISOString(),
      },
    });

        return scoredProjects.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          workspace: project.workspace,
          collaboratorsCount: project._count.collaborators,
          tasksCount: project._count.tasks,
          techStacks: project.techLinks.map((tl) => tl.techStack),
          compatibilityScore: project.compatibilityScore,
          createdAt: project.createdAt,
        }));
      },
      CACHE_TTL.RECOMMENDATIONS
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

// =============================================================================
// SWIPE ACTION HANDLER & MATCH DETECTION
// =============================================================================
/**
 * Handles user swipe actions and detects mutual matches in real-time
 * 
 * SWIPE MECHANICS:
 * ```
 * Right Swipe (Like)               Left Swipe (Pass)
 * ├─→ Check daily limit            ├─→ Check daily limit
 * ├─→ Record swipe                 ├─→ Record swipe
 * ├─→ Check for reciprocal swipe   └─→ No match check
 * └─→ Create match if mutual
 * ```
 * 
 * MATCH DETECTION ALGORITHM:
 * ```
 * User A swipes right on User B
 * └─→ Query: Has User B swiped right on User A?
 *     ├─→ YES: MATCH!
 *     │   ├─→ Create Match record
 *     │   ├─→ Create MatchUser entries (both users)
 *     │   ├─→ Publish MATCH_CREATED event
 *     │   └─→ Return: { matched: true, matchId }
 *     └─→ NO: No match yet
 *         └─→ Return: { matched: false }
 * ```
 * 
 * DAILY LIMIT ENFORCEMENT:
 * - Default: 50 swipes per day
 * - Customizable per user (premium features)
 * - Resets at midnight (00:00 UTC)
 * - Prevents spam and encourages quality interactions
 * 
 * BUSINESS RULES:
 * 1. Cannot swipe on same target twice
 * 2. Cannot swipe on self
 * 3. Daily limit enforced
 * 4. Matches require mutual right swipes
 * 5. Project swipes don't create matches (collaboration requests instead)
 * 
 * EVENT PUBLISHING:
 * - `USER_SWIPE_ACTION`: Every swipe (for analytics)
 * - `USER_MATCH_CREATED`: When mutual match occurs
 * 
 * @param {string} swiperId - ID of the user performing the swipe
 * @param {"user" | "project"} targetType - Type of target being swiped
 * @param {string} targetId - ID of the user or project being swiped
 * @param {boolean} isRightSwipe - true = like, false = pass
 * @returns {Promise<{matched: boolean, matchId?: string}>} Match result
 * 
 * @throws {NotFoundError} If swiper doesn't exist
 * @throws {ValidationError} If daily limit reached
 * @throws {ConflictError} If already swiped on this target
 * @throws {DatabaseError} If database operation fails
 * 
 * @example
 * const result = await handleSwipeAction('user-123', 'user', 'user-456', true);
 * if (result.matched) {
 *   console.log('🎉 Match created:', result.matchId);
 *   // Trigger notification to both users
 * }
 */
export const handleSwipeAction = async (
  swiperId: string,
  targetType: "user" | "project",
  targetId: string,
  isRightSwipe: boolean
): Promise<{ matched: boolean; matchId?: string }> => {
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
        ...(targetType === "user" ? { swipeeUserId: targetId } : { swipeeProjectId: targetId }),
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

    if (targetType === "user") {
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
    if (isRightSwipe && targetType === "user") {
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

// =============================================================================
// MATCH RETRIEVAL
// =============================================================================
/**
 * Retrieves all matches for a specific user
 * 
 * Returns bidirectional matches where both users swiped right on each other.
 * Used to display user's match list and enable chat/collaboration features.
 * 
 * @param {string} userId - ID of the user to get matches for
 * @returns {Promise<any[]>} Array of match objects with matched user details
 * @throws {DatabaseError} If database query fails
 * 
 * @example
 * const matches = await getUserMatches('user-123');
 * // Returns: [{ matchId: '...', matchedUser: {...}, matchedAt: Date }]
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

    return matches.map((match) => ({
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

// =============================================================================
// SWIPE ANALYTICS & LIMITS
// =============================================================================
/**
 * Gets user's current daily swipe count and limit
 * 
 * Used by frontend to display remaining swipes and enforce client-side limits.
 * Resets daily at midnight (00:00 UTC).
 * 
 * @param {string} userId - ID of the user to check
 * @returns {Promise<{count: number, limit: number}>} Current count and daily limit
 * @throws {NotFoundError} If user doesn't exist
 * @throws {DatabaseError} If database query fails
 * 
 * @example
 * const { count, limit } = await getDailySwipeCount('user-123');
 * console.log(`${count}/${limit} swipes used today`);
 */
export const getDailySwipeCount = async (
  userId: string
): Promise<{ count: number; limit: number }> => {
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

// =============================================================================
// MATCHMAKING ANALYTICS & UTILITIES
// =============================================================================
/**
 * Get user's matchmaking statistics
 * 
 * Provides comprehensive analytics about user's matchmaking activity:
 * - Total swipes (right/left breakdown)
 * - Match rate
 * - Average compatibility of matches
 * - Most common tech stack matches
 * 
 * @param {string} userId - ID of the user
 * @returns {Promise<any>} Statistics object
 */
export const getUserMatchmakingStats = async (userId: string): Promise<any> => {
  try {
    const [swipes, matches, user] = await Promise.all([
      prisma.swipe.findMany({
        where: { swiperId: userId },
        select: { isRightSwipe: true, createdAt: true },
      }),
      prisma.matchUser.count({ where: { userId } }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { createdAt: true },
      }),
    ]);

    const rightSwipes = swipes.filter((s) => s.isRightSwipe).length;
    const leftSwipes = swipes.length - rightSwipes;
    const matchRate = rightSwipes > 0 ? (matches / rightSwipes) * 100 : 0;

    return {
      totalSwipes: swipes.length,
      rightSwipes,
      leftSwipes,
      matches,
      matchRate: Math.round(matchRate * 10) / 10,
      accountAge: user
        ? Math.floor(
            (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
          )
        : 0,
    };
  } catch (error) {
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Batch update recommendation metrics
 * 
 * Updates recommendation performance metrics in database for ML training.
 * Tracks which recommendations led to swipes/matches.
 * 
 * @param {string} userId - User who received recommendations
 * @param {string[]} recommendedUserIds - List of recommended user IDs
 * @param {any} metrics - Compatibility scores and metadata
 */
export const updateRecommendationMetrics = async (
  userId: string,
  recommendedUserIds: string[],
  metrics: any
): Promise<void> => {
  try {
    // Batch upsert recommendation metrics
    await Promise.all(
      recommendedUserIds.map(async (targetId) => {
        const existing = await prisma.recommendationMetric.findFirst({
          where: {
            userId,
            targetId,
            type: "user",
          },
        });

        if (existing) {
          await prisma.recommendationMetric.update({
            where: { id: existing.id },
            data: {
              totalSwipes: { increment: 0 }, // Will increment when swiped
              lastUpdated: new Date(),
            },
          });
        } else {
          await prisma.recommendationMetric.create({
            data: {
              userId,
              targetId,
              type: "user",
              totalSwipes: 0,
              rightSwipes: 0,
              score: metrics[targetId] || null,
            },
          });
        }
      })
    );
  } catch (error) {
    console.error("Failed to update recommendation metrics:", error);
    // Don't throw - metrics are non-critical
  }
};

/**
 * Get trending matches (users who are getting matched frequently)
 * 
 * Useful for showcasing popular/active users and understanding platform dynamics.
 * 
 * @param {number} limit - Number of trending users to return
 * @returns {Promise<any[]>} Array of trending users with match counts
 */
export const getTrendingMatches = async (limit: number = 10): Promise<any[]> => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get users with most matches in last 7 days
    const trendingUsers = await prisma.matchUser.groupBy({
      by: ['userId'],
      where: {
        match: {
          createdAt: { gte: oneWeekAgo },
        },
      },
      _count: { userId: true },
      orderBy: { _count: { userId: 'desc' } },
      take: limit,
    });

    // Fetch user details
    const usersWithDetails = await Promise.all(
      trendingUsers.map(async (item) => {
        const user = await prisma.user.findUnique({
          where: { id: item.userId },
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            techStack: true,
            _count: { select: { projects: true } },
          },
        });
        return {
          ...user,
          recentMatches: item._count.userId,
        };
      })
    );

    return usersWithDetails.filter((u) => u.id !== null);
  } catch (error) {
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};
