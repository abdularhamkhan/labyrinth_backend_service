import z from "zod";

// =============================================================================
// MATCHMAKING SCHEMAS - LABYRINTH PLATFORM
// =============================================================================

/**
 * USER RECOMMENDATION SCHEMA
 */
export const userRecommendationSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  education: z.string().nullable(),
  gitHubProfile: z.string().nullable(),
  techStack: z.object({
    id: z.string().uuid(),
    frameworks: z.array(z.string()),
    languages: z.array(z.string()),
    tools: z.array(z.string()),
  }).nullable(),
  demographic: z.object({
    id: z.string().uuid(),
    country: z.string(),
    languages: z.array(z.string()),
  }).nullable(),
  compatibilityScore: z.number().min(0).max(100),
  projectsCount: z.number().int(),
  workspacesCount: z.number().int(),
  swipesCount: z.number().int(),
  lastActive: z.date().nullable(),
});

export type UserRecommendation = z.infer<typeof userRecommendationSchema>;

/**
 * PROJECT RECOMMENDATION SCHEMA
 */
export const projectRecommendationSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  workspace: z.object({
    name: z.string(),
    description: z.string(),
  }),
  collaboratorsCount: z.number().int(),
  tasksCount: z.number().int(),
  techStacks: z.array(z.object({
    id: z.string().uuid(),
    frameworks: z.array(z.string()),
    languages: z.array(z.string()),
    tools: z.array(z.string()),
  })),
  compatibilityScore: z.number().min(0).max(100),
  createdAt: z.date(),
});

export type ProjectRecommendation = z.infer<typeof projectRecommendationSchema>;

/**
 * SWIPE ACTION SCHEMA
 */
export const swipeActionSchema = z.object({
  targetType: z.enum(['user', 'project']),
  targetId: z.string().uuid(),
  isRightSwipe: z.boolean(),
});

export type SwipeAction = z.infer<typeof swipeActionSchema>;

/**
 * MATCH SCHEMA
 */
export const matchSchema = z.object({
  matchId: z.string().uuid(),
  matchedUser: z.object({
    id: z.string().uuid(),
    username: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    lastActive: z.date().nullable(),
    techStack: z.object({
      id: z.string().uuid(),
      frameworks: z.array(z.string()),
      languages: z.array(z.string()),
      tools: z.array(z.string()),
    }).nullable(),
    demographic: z.object({
      id: z.string().uuid(),
      country: z.string(),
      languages: z.array(z.string()),
    }).nullable(),
  }).nullable(),
  matchedAt: z.date(),
});

export type Match = z.infer<typeof matchSchema>;

/**
 * SWIPE STATUS SCHEMA
 */
export const swipeStatusSchema = z.object({
  dailyCount: z.number().int(),
  dailyLimit: z.number().int(),
  remaining: z.number().int(),
  canSwipe: z.boolean(),
});

export type SwipeStatus = z.infer<typeof swipeStatusSchema>;

/**
 * MATCHMAKING DASHBOARD SCHEMA
 */
export const matchmakingDashboardSchema = z.object({
  userRecommendations: z.object({
    users: z.array(userRecommendationSchema),
    count: z.number().int(),
  }),
  projectRecommendations: z.object({
    projects: z.array(projectRecommendationSchema),
    count: z.number().int(),
  }),
  matches: z.object({
    matches: z.array(matchSchema),
    count: z.number().int(),
  }),
  swipeStatus: swipeStatusSchema,
});

export type MatchmakingDashboard = z.infer<typeof matchmakingDashboardSchema>;

/**
 * COMPATIBILITY CALCULATION SCHEMA
 */
export const compatibilityFactorsSchema = z.object({
  techStackOverlap: z.number().min(0).max(1),
  geographicMatch: z.number().min(0).max(1),
  activityLevel: z.number().min(0).max(1),
  educationMatch: z.number().min(0).max(1),
  overallScore: z.number().min(0).max(100),
});

export type CompatibilityFactors = z.infer<typeof compatibilityFactorsSchema>;