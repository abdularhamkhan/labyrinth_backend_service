/**
 * =============================================================================
 * LABYRINTH REDIS CACHING STRATEGIES - COLLABORATION PLATFORM
 * =============================================================================
 *
 * This module implements various caching strategies optimized for the Labyrinth
 * collaboration platform to handle user profiles, matchmaking data, project
 * information, and real-time collaboration features.
 *
 * Strategies Implemented:
 * - Write-Through: Write to cache and database simultaneously (critical user data)
 * - Write-Behind: Write to cache immediately, database later (activity tracking)
 * - Cache-Aside: Load from cache, fallback to database (profile data)
 * - Recommendation Cache: Specialized caching for matchmaking algorithms
 *
 * =============================================================================
 */

import { cacheRedis } from "../config/redis.production.config";
import { prisma } from "../../config/prisma";
import {
  CACHE_KEYS,
  CACHE_TTL,
  USER_REDIS_KEYS,
  PROJECT_REDIS_KEYS,
  MATCHMAKING_REDIS_KEYS,
  CHAT_REDIS_KEYS,
} from "../../constants/redisKeys";

// Export the constants for other modules
export { CACHE_KEYS, CACHE_TTL };
import { kafkaProducer } from "../../services/kafka-producer.service";

// =============================================================================
// LABYRINTH CACHING STRATEGIES
// =============================================================================

// =============================================================================
// WRITE-THROUGH CACHE STRATEGY - USER MANAGEMENT
// =============================================================================

export class WriteThroughCache {
  /**
   * Update user profile with write-through strategy
   */
  static async updateUserProfile(userId: string, profileUpdate: any): Promise<any> {
    try {
      // 1. Write to database first
      const updatedProfile = await prisma.user.update({
        where: { id: userId },
        data: {
          ...profileUpdate,
          lastActive: new Date(),
        },
        include: {
          preferences: true,
          techStack: true,
          demographic: true,
          workspaces: true,
        },
      });

      // 2. Write to cache immediately
      const cacheKey = CACHE_KEYS.USER_PROFILE(userId);
      await cacheRedis.setex(cacheKey, CACHE_TTL.USER_PROFILE, JSON.stringify(updatedProfile));

      // 3. Publish profile update event
      try {
        await kafkaProducer.publishUserProfileUpdated(userId, profileUpdate);
      } catch (kafkaError) {
        console.error("Failed to publish profile update event:", kafkaError);
      }

      console.log(`✅ Write-through cache: Updated user profile for ${userId}`);
      return updatedProfile;
    } catch (error) {
      console.error("❌ Write-through cache error:", error);
      throw error;
    }
  }

  /**
   * Update user preferences with write-through strategy
   */
  static async updateUserPreferences(userId: string, preferencesUpdate: any): Promise<any> {
    try {
      // 1. Write to database first
      const updatedPreferences = await prisma.preferences.upsert({
        where: { userId },
        create: {
          userId,
          ...preferencesUpdate,
        },
        update: preferencesUpdate,
        include: {
          user: true,
          preferredTechStack: true,
          preferredDemographic: true,
        },
      });

      // 2. Write to cache immediately
      const cacheKey = CACHE_KEYS.USER_PREFERENCES(userId);
      await cacheRedis.setex(
        cacheKey,
        CACHE_TTL.USER_PREFERENCES,
        JSON.stringify(updatedPreferences)
      );

      // 3. Invalidate recommendation cache
      const recsKey = MATCHMAKING_REDIS_KEYS.USER_RECOMMENDATIONS(userId);
      await cacheRedis.del(recsKey);

      console.log(`✅ Write-through cache: Updated preferences for ${userId}`);
      return updatedPreferences;
    } catch (error) {
      console.error("❌ Write-through cache error:", error);
      throw error;
    }
  }

  /**
   * Update project information with write-through strategy
   */
  static async updateProjectInfo(projectId: string, projectUpdate: any): Promise<any> {
    try {
      // 1. Write to database first
      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: {
          ...projectUpdate,
          updatedAt: new Date(),
        },
        include: {
          collaborators: true,
          workspace: true,
          roles: true,
          techLinks: {
            include: {
              techStack: true,
            },
          },
        },
      });

      // 2. Write to cache immediately
      const cacheKey = CACHE_KEYS.PROJECT_DETAILS(projectId);
      await cacheRedis.setex(cacheKey, CACHE_TTL.PROJECT_DETAILS, JSON.stringify(updatedProject));

      // 3. Publish project update event
      try {
        await kafkaProducer.publishProjectUpdated(projectId, projectUpdate);
      } catch (kafkaError) {
        console.error("Failed to publish project update event:", kafkaError);
      }

      console.log(`✅ Write-through cache: Updated project ${projectId}`);
      return updatedProject;
    } catch (error) {
      console.error("❌ Write-through cache error:", error);
      throw error;
    }
  }
}

// =============================================================================
// CACHE-ASIDE (LAZY LOADING) STRATEGY - LABYRINTH PLATFORM
// =============================================================================

export class CacheAsideStrategy {
  /**
   * Get user profile with cache-aside strategy
   */
  static async getUserProfile(userId: string): Promise<any> {
    try {
      const cacheKey = CACHE_KEYS.USER_PROFILE(userId);

      // 1. Try to get from cache first
      const cachedProfile = await cacheRedis.get(cacheKey);

      if (cachedProfile) {
        console.log(`🎯 Cache hit: User profile for ${userId}`);
        return JSON.parse(cachedProfile);
      }

      // 2. Cache miss - get from database
      console.log(`💾 Cache miss: Fetching user profile for ${userId} from database`);
      const userProfile = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          preferences: true,
          techStack: true,
          demographic: true,
          workspaces: {
            include: {
              projects: {
                take: 5, // Limit recent projects
                orderBy: { createdAt: "desc" },
              },
            },
          },
        },
      });

      // 3. Store in cache for future requests
      if (userProfile) {
        await cacheRedis.setex(cacheKey, CACHE_TTL.USER_PROFILE, JSON.stringify(userProfile));
      }

      return userProfile;
    } catch (error) {
      console.error("❌ Cache-aside strategy error:", error);
      throw error;
    }
  }

  /**
   * Get user preferences with cache-aside strategy
   */
  static async getUserPreferences(userId: string): Promise<any> {
    try {
      const cacheKey = CACHE_KEYS.USER_PREFERENCES(userId);

      // 1. Try to get from cache first
      const cachedPreferences = await cacheRedis.get(cacheKey);

      if (cachedPreferences) {
        console.log(`🎯 Cache hit: User preferences for ${userId}`);
        return JSON.parse(cachedPreferences);
      }

      // 2. Cache miss - get from database
      console.log(`💾 Cache miss: Fetching user preferences for ${userId} from database`);
      const preferences = await prisma.preferences.findUnique({
        where: { userId },
        include: {
          preferredTechStack: true,
          preferredDemographic: true,
        },
      });

      // 3. Store in cache for future requests
      if (preferences) {
        await cacheRedis.setex(cacheKey, CACHE_TTL.USER_PREFERENCES, JSON.stringify(preferences));
      }

      return preferences;
    } catch (error) {
      console.error("❌ Cache-aside strategy error:", error);
      throw error;
    }
  }

  /**
   * Get project details with cache-aside strategy
   */
  static async getProjectDetails(projectId: string): Promise<any> {
    try {
      const cacheKey = CACHE_KEYS.PROJECT_DETAILS(projectId);

      // 1. Try to get from cache first
      const cachedProject = await cacheRedis.get(cacheKey);

      if (cachedProject) {
        console.log(`🎯 Cache hit: Project details for ${projectId}`);
        return JSON.parse(cachedProject);
      }

      // 2. Cache miss - get from database
      console.log(`💾 Cache miss: Fetching project details for ${projectId} from database`);
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          collaborators: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              techStack: true,
            },
          },
          workspace: true,
          roles: {
            include: {
              userRoles: {
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
          },
          techLinks: {
            include: {
              techStack: true,
            },
          },
          tasks: {
            orderBy: { createdAt: "desc" },
            take: 10, // Limit recent tasks
          },
        },
      });

      // 3. Store in cache for future requests
      if (project) {
        await cacheRedis.setex(cacheKey, CACHE_TTL.PROJECT_DETAILS, JSON.stringify(project));
      }

      return project;
    } catch (error) {
      console.error("❌ Cache-aside strategy error:", error);
      throw error;
    }
  }

  /**
   * Get user's active collaborations with cache-aside strategy
   */
  static async getUserCollaborations(userId: string): Promise<any[]> {
    try {
      const cacheKey = PROJECT_REDIS_KEYS.ACTIVE_COLLABORATIONS(userId);

      // 1. Try to get from cache first
      const cachedCollaborations = await cacheRedis.get(cacheKey);

      if (cachedCollaborations) {
        console.log(`🎯 Cache hit: User collaborations for ${userId}`);
        return JSON.parse(cachedCollaborations);
      }

      // 2. Cache miss - get from database
      console.log(`💾 Cache miss: Fetching user collaborations for ${userId} from database`);
      const collaborations = await prisma.project.findMany({
        where: {
          collaborators: {
            some: {
              id: userId,
            },
          },
        },
        include: {
          collaborators: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          workspace: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      // 3. Store in cache for future requests
      await cacheRedis.setex(cacheKey, CACHE_TTL.PROJECT_DETAILS, JSON.stringify(collaborations));

      return collaborations;
    } catch (error) {
      console.error("❌ Cache-aside strategy error:", error);
      throw error;
    }
  }
}

// =============================================================================
// MATCHMAKING CACHE STRATEGY - LABYRINTH PLATFORM
// =============================================================================

export class MatchmakingCache {
  /**
   * Cache user recommendations for matchmaking
   */
  static async cacheUserRecommendations(userId: string, recommendations: any[]): Promise<void> {
    try {
      const cacheKey = MATCHMAKING_REDIS_KEYS.USER_RECOMMENDATIONS(userId);
      await cacheRedis.setex(
        cacheKey,
        CACHE_TTL.USER_RECOMMENDATIONS,
        JSON.stringify(recommendations)
      );
      console.log(`✅ Cached recommendations for user ${userId}`);
    } catch (error) {
      console.error("❌ Failed to cache recommendations:", error);
    }
  }

  /**
   * Get cached user recommendations
   */
  static async getUserRecommendations(userId: string): Promise<any[] | null> {
    try {
      const cacheKey = MATCHMAKING_REDIS_KEYS.USER_RECOMMENDATIONS(userId);
      const cached = await cacheRedis.get(cacheKey);

      if (cached) {
        console.log(`🎯 Cache hit: User recommendations for ${userId}`);
        return JSON.parse(cached);
      }

      return null;
    } catch (error) {
      console.error("❌ Failed to get cached recommendations:", error);
      return null;
    }
  }

  /**
   * Cache project recommendations
   */
  static async cacheProjectRecommendations(userId: string, projects: any[]): Promise<void> {
    try {
      const cacheKey = MATCHMAKING_REDIS_KEYS.PROJECT_RECOMMENDATIONS(userId);
      await cacheRedis.setex(cacheKey, CACHE_TTL.PROJECT_RECOMMENDATIONS, JSON.stringify(projects));
      console.log(`✅ Cached project recommendations for user ${userId}`);
    } catch (error) {
      console.error("❌ Failed to cache project recommendations:", error);
    }
  }

  /**
   * Track user swipes for daily limits
   */
  static async trackUserSwipe(userId: string): Promise<{ remaining: number; resetTime: Date }> {
    try {
      const today = new Date().toISOString().split("T")[0];
      const cacheKey = MATCHMAKING_REDIS_KEYS.DAILY_SWIPES(userId, today);

      const current = await cacheRedis.incr(cacheKey);

      if (current === 1) {
        // Set expiration to end of day
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        await cacheRedis.expireat(cacheKey, Math.floor(tomorrow.getTime() / 1000));
      }

      const maxSwipes = 50; // Default from schema
      return {
        remaining: Math.max(0, maxSwipes - current),
        resetTime: new Date(new Date().setHours(23, 59, 59, 999)),
      };
    } catch (error) {
      console.error("❌ Failed to track user swipe:", error);
      throw error;
    }
  }

  /**
   * Cache user matching vector for algorithm optimization
   */
  static async cacheUserVector(userId: string, vector: number[]): Promise<void> {
    try {
      const cacheKey = MATCHMAKING_REDIS_KEYS.USER_VECTOR(userId);
      await cacheRedis.setex(cacheKey, CACHE_TTL.MATCH_SCORES, JSON.stringify(vector));
    } catch (error) {
      console.error("❌ Failed to cache user vector:", error);
    }
  }
}

// =============================================================================
// CHAT CACHE STRATEGY - REAL-TIME MESSAGING
// =============================================================================

export class ChatCache {
  /**
   * Cache recent chat messages
   */
  static async cacheRecentMessages(chatId: string, messages: any[]): Promise<void> {
    try {
      const cacheKey = CHAT_REDIS_KEYS.CHAT_MESSAGES(chatId);
      await cacheRedis.setex(cacheKey, CACHE_TTL.UNREAD_MESSAGES, JSON.stringify(messages));
    } catch (error) {
      console.error("❌ Failed to cache chat messages:", error);
    }
  }

  /**
   * Update unread message count
   */
  static async updateUnreadCount(
    userId: string,
    chatId: string,
    increment: number = 1
  ): Promise<number> {
    try {
      const cacheKey = CHAT_REDIS_KEYS.UNREAD_COUNT(userId, chatId);
      const count = await cacheRedis.incrby(cacheKey, increment);
      await cacheRedis.expire(cacheKey, CACHE_TTL.UNREAD_MESSAGES);
      return count;
    } catch (error) {
      console.error("❌ Failed to update unread count:", error);
      return 0;
    }
  }

  /**
   * Clear unread count when user reads messages
   */
  static async clearUnreadCount(userId: string, chatId: string): Promise<void> {
    try {
      const cacheKey = CHAT_REDIS_KEYS.UNREAD_COUNT(userId, chatId);
      await cacheRedis.del(cacheKey);
    } catch (error) {
      console.error("❌ Failed to clear unread count:", error);
    }
  }

  /**
   * Set typing indicator
   */
  static async setTypingIndicator(chatId: string, userId: string): Promise<void> {
    try {
      const cacheKey = CHAT_REDIS_KEYS.TYPING_INDICATOR(chatId, userId);
      await cacheRedis.setex(cacheKey, CACHE_TTL.TYPING_INDICATOR, "typing");
    } catch (error) {
      console.error("❌ Failed to set typing indicator:", error);
    }
  }

  /**
   * Get all typing users in a chat
   */
  static async getTypingUsers(chatId: string): Promise<string[]> {
    try {
      const pattern = CHAT_REDIS_KEYS.TYPING_INDICATOR(chatId, "*");
      const keys = await cacheRedis.keys(pattern);
      return keys.map((key) => key.split(":").pop() || "");
    } catch (error) {
      console.error("❌ Failed to get typing users:", error);
      return [];
    }
  }
}

// =============================================================================
// WRITE-BEHIND (WRITE-BACK) CACHE STRATEGY - ACTIVITY TRACKING
// =============================================================================

export class WriteBehindCache {
  private static activityQueue: Map<string, any> = new Map();
  private static flushInterval: NodeJS.Timeout | null = null;

  /**
   * Start the write-behind flush process for user activity
   */
  static startActivityTracking(intervalMs: number = 30000): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }

    this.flushInterval = setInterval(async () => {
      await this.flushToDatabase();
    }, intervalMs);

    console.log(`🔄 Write-behind cache flush process started (interval: ${intervalMs}ms)`);
  }

  /**
   * Track user activity (high-frequency writes)
   */
  static async trackUserActivity(userId: string, activity: string, metadata?: any): Promise<void> {
    try {
      // 1. Write to cache immediately
      const cacheKey = USER_REDIS_KEYS.LAST_ACTIVE(userId);
      const activityData = {
        activity,
        metadata,
        timestamp: new Date().toISOString(),
      };
      await cacheRedis.setex(cacheKey, CACHE_TTL.USER_PROFILE, JSON.stringify(activityData));

      // 2. Queue for database write
      this.activityQueue.set(`activity:${userId}`, {
        userId,
        activity,
        metadata,
        timestamp: Date.now(),
      });

      console.log(`📝 Write-behind: Queued activity for user ${userId}`);
    } catch (error) {
      console.error("❌ Write-behind cache error:", error);
      throw error;
    }
  }

  /**
   * Flush queued activity writes to database
   */
  private static async flushToDatabase(): Promise<void> {
    if (this.activityQueue.size === 0) {
      return;
    }

    console.log(`🔄 Flushing ${this.activityQueue.size} activity operations to database`);

    const operations = Array.from(this.activityQueue.entries());
    this.activityQueue.clear();

    for (const [key, data] of operations) {
      try {
        if (key.startsWith("activity:")) {
          // Update user's lastActive timestamp
          await prisma.user.update({
            where: { id: data.userId },
            data: { lastActive: new Date(data.timestamp) },
          });

          // Publish activity event via Kafka
          try {
            await kafkaProducer.publishUserActivity(data.userId, data.activity, data.metadata);
          } catch (kafkaError) {
            console.error("Failed to publish activity event:", kafkaError);
          }

          console.log(`📝 Activity flushed for user ${data.userId}: ${data.activity}`);
        }
      } catch (error) {
        console.error(`❌ Write-behind flush error for ${key}:`, error);
        // Re-queue failed operations for retry
        this.activityQueue.set(key, data);
      }
    }
  }

  /**
   * Stop the flush process
   */
  static stopFlushProcess(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
      console.log("⏹️ Write-behind cache flush process stopped");
    }
  }
}

// =============================================================================
// ANALYTICS CACHE STRATEGY - LABYRINTH PLATFORM
// =============================================================================

export class AnalyticsCache {
  /**
   * Cache user collaboration statistics
   */
  static async cacheCollaborationStats(userId: string, stats: any): Promise<void> {
    try {
      const cacheKey = USER_REDIS_KEYS.COLLABORATION_STATS(userId);
      await cacheRedis.setex(cacheKey, CACHE_TTL.COLLABORATION_STATS, JSON.stringify(stats));
      console.log(`📊 Cached collaboration stats for user ${userId}`);
    } catch (error) {
      console.error("❌ Failed to cache collaboration stats:", error);
    }
  }

  /**
   * Get cached collaboration statistics
   */
  static async getCollaborationStats(userId: string): Promise<any | null> {
    try {
      const cacheKey = USER_REDIS_KEYS.COLLABORATION_STATS(userId);
      const cached = await cacheRedis.get(cacheKey);

      if (cached) {
        console.log(`🎯 Cache hit: Collaboration stats for ${userId}`);
        return JSON.parse(cached);
      }

      return null;
    } catch (error) {
      console.error("❌ Failed to get cached collaboration stats:", error);
      return null;
    }
  }

  /**
   * Cache project analytics
   */
  static async cacheProjectAnalytics(projectId: string, analytics: any): Promise<void> {
    try {
      const cacheKey = PROJECT_REDIS_KEYS.PROJECT_STATS(projectId);
      await cacheRedis.setex(cacheKey, CACHE_TTL.ANALYTICS_DATA, JSON.stringify(analytics));
      console.log(`📊 Cached analytics for project ${projectId}`);
    } catch (error) {
      console.error("❌ Failed to cache project analytics:", error);
    }
  }

  /**
   * Track platform usage metrics
   */
  static async trackPlatformMetric(
    metric: string,
    value: number,
    date: string = new Date().toISOString().split("T")[0]
  ): Promise<void> {
    try {
      const cacheKey = `analytics:platform:${metric}:${date}`;
      await cacheRedis.incrby(cacheKey, value);
      await cacheRedis.expire(cacheKey, CACHE_TTL.ANALYTICS_DATA);

      console.log(`📊 Tracked platform metric ${metric}: +${value}`);
    } catch (error) {
      console.error("❌ Failed to track platform metric:", error);
    }
  }
}

// =============================================================================
// CACHE INVALIDATION STRATEGIES - LABYRINTH PLATFORM
// =============================================================================

export class CacheInvalidation {
  /**
   * Invalidate all caches related to a user
   */
  static async invalidateUser(userId: string): Promise<void> {
    try {
      console.log(`🧽 Invalidating all caches for user: ${userId}`);

      const pipeline = cacheRedis.pipeline();

      // User profile and related data (using existing keys from redisKeys.ts)
      pipeline.del(USER_REDIS_KEYS.PROFILE(userId));
      pipeline.del(USER_REDIS_KEYS.PREFERENCES(userId));
      pipeline.del(USER_REDIS_KEYS.TECH_STACK(userId));
      pipeline.del(USER_REDIS_KEYS.DEMOGRAPHICS(userId));
      pipeline.del(USER_REDIS_KEYS.WORKSPACE(userId));
      pipeline.del(USER_REDIS_KEYS.COLLABORATION_STATS(userId));
      pipeline.del(USER_REDIS_KEYS.PROJECT_HISTORY(userId));
      pipeline.del(USER_REDIS_KEYS.SKILL_ENDORSEMENTS(userId));
      pipeline.del(USER_REDIS_KEYS.LAST_ACTIVE(userId));
      pipeline.del(USER_REDIS_KEYS.ONLINE_STATUS(userId));
      pipeline.del(USER_REDIS_KEYS.DEVICE_INFO(userId));

      // Matchmaking related caches (using existing keys)
      pipeline.del(MATCHMAKING_REDIS_KEYS.USER_RECOMMENDATIONS(userId));
      pipeline.del(MATCHMAKING_REDIS_KEYS.PROJECT_RECOMMENDATIONS(userId));
      pipeline.del(MATCHMAKING_REDIS_KEYS.USER_VECTOR(userId));
      pipeline.del(MATCHMAKING_REDIS_KEYS.ACTIVE_MATCHES(userId));
      pipeline.del(MATCHMAKING_REDIS_KEYS.PENDING_MATCHES(userId));
      pipeline.del(MATCHMAKING_REDIS_KEYS.MUTUAL_MATCHES(userId));
      pipeline.del(MATCHMAKING_REDIS_KEYS.SWIPE_HISTORY(userId));
      pipeline.del(MATCHMAKING_REDIS_KEYS.RECOMMENDATION_CACHE(userId));

      // Chat related caches (using existing keys)
      pipeline.del(CHAT_REDIS_KEYS.USER_CHATS(userId));

      // Cache keys that use CACHE_KEYS format
      pipeline.del(CACHE_KEYS.USER_PROFILE(userId));
      pipeline.del(CACHE_KEYS.USER_PREFERENCES(userId));
      pipeline.del(CACHE_KEYS.USER_TECH_STACK(userId));
      pipeline.del(CACHE_KEYS.USER_DEMOGRAPHICS(userId));
      pipeline.del(CACHE_KEYS.ACTIVE_SESSIONS(userId));

      await pipeline.exec();

      // Publish cache invalidation event
      try {
        await kafkaProducer.publishEvent({
          type: "CACHE_INVALIDATED",
          data: {
            entity: "user",
            entityId: userId,
            invalidatedAt: new Date().toISOString(),
          },
        });
      } catch (kafkaError) {
        console.error("Failed to publish cache invalidation event:", kafkaError);
      }

      console.log(`✅ Invalidated all caches for user: ${userId}`);
    } catch (error) {
      console.error("❌ Cache invalidation error:", error);
      // Don't throw error to prevent breaking main functionality
    }
  }

  /**
   * Invalidate all caches related to a project
   */
  static async invalidateProject(projectId: string): Promise<void> {
    try {
      console.log(`🧽 Invalidating all caches for project: ${projectId}`);

      const pipeline = cacheRedis.pipeline();

      // Project data and collaborations (using existing keys)
      pipeline.del(PROJECT_REDIS_KEYS.PROJECT_DETAILS(projectId));
      pipeline.del(PROJECT_REDIS_KEYS.PROJECT_MEMBERS(projectId));
      pipeline.del(PROJECT_REDIS_KEYS.PROJECT_ROLES(projectId));
      pipeline.del(PROJECT_REDIS_KEYS.PROJECT_TECH_STACK(projectId));
      pipeline.del(PROJECT_REDIS_KEYS.PROJECT_ACTIVITY(projectId));
      pipeline.del(PROJECT_REDIS_KEYS.RECENT_UPDATES(projectId));
      pipeline.del(PROJECT_REDIS_KEYS.PROJECT_STATS(projectId));
      pipeline.del(PROJECT_REDIS_KEYS.PROJECT_TASKS(projectId));
      pipeline.del(PROJECT_REDIS_KEYS.TASK_ASSIGNMENTS(projectId));

      // Cache keys that use CACHE_KEYS format
      pipeline.del(CACHE_KEYS.PROJECT_DETAILS(projectId));
      pipeline.del(CACHE_KEYS.PROJECT_COLLABORATORS(projectId));

      await pipeline.exec();

      // Publish cache invalidation event
      try {
        await kafkaProducer.publishEvent({
          type: "CACHE_INVALIDATED",
          data: {
            entity: "project",
            entityId: projectId,
            invalidatedAt: new Date().toISOString(),
          },
        });
      } catch (kafkaError) {
        console.error("Failed to publish cache invalidation event:", kafkaError);
      }

      console.log(`✅ Invalidated all caches for project: ${projectId}`);
    } catch (error) {
      console.error("❌ Cache invalidation error:", error);
      // Don't throw error to prevent breaking main functionality
    }
  }

  /**
   * Invalidate chat-related caches
   */
  static async invalidateChat(chatId: string): Promise<void> {
    try {
      console.log(`🧽 Invalidating chat caches for: ${chatId}`);

      const pipeline = cacheRedis.pipeline();

      // Chat messages and metadata (using existing keys)
      pipeline.del(CHAT_REDIS_KEYS.CHAT_ROOM(chatId));
      pipeline.del(CHAT_REDIS_KEYS.CHAT_MESSAGES(chatId));
      pipeline.del(CHAT_REDIS_KEYS.CHAT_PARTICIPANTS(chatId));
      pipeline.del(CHAT_REDIS_KEYS.CHAT_METADATA(chatId));
      pipeline.del(CHAT_REDIS_KEYS.ONLINE_IN_CHAT(chatId));
      pipeline.del(CHAT_REDIS_KEYS.MESSAGE_QUEUE(chatId));

      await pipeline.exec();

      console.log(`✅ Invalidated chat caches for: ${chatId}`);
    } catch (error) {
      console.error("❌ Chat cache invalidation error:", error);
      // Don't throw error to prevent breaking main functionality
    }
  }

  /**
   * Invalidate specific user-chat relationship caches
   */
  static async invalidateUserChatCaches(userId: string, chatId: string): Promise<void> {
    try {
      console.log(`🧽 Invalidating user-chat caches for user: ${userId}, chat: ${chatId}`);

      const pipeline = cacheRedis.pipeline();

      // User-specific chat caches
      pipeline.del(CHAT_REDIS_KEYS.UNREAD_COUNT(userId, chatId));
      pipeline.del(CHAT_REDIS_KEYS.LAST_READ(userId, chatId));
      pipeline.del(CHAT_REDIS_KEYS.TYPING_INDICATOR(chatId, userId));

      await pipeline.exec();

      console.log(`✅ Invalidated user-chat caches for user: ${userId}, chat: ${chatId}`);
    } catch (error) {
      console.error("❌ User-chat cache invalidation error:", error);
    }
  }

  /**
   * Batch invalidate multiple users
   */
  static async batchInvalidateUsers(userIds: string[]): Promise<void> {
    try {
      console.log(`🧽 Batch invalidating ${userIds.length} users`);

      // Process in batches to avoid overwhelming Redis
      const batchSize = 10;
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        await Promise.all(batch.map((userId) => this.invalidateUser(userId)));
      }

      console.log(`✅ Batch invalidated ${userIds.length} users`);
    } catch (error) {
      console.error("❌ Batch invalidation error:", error);
    }
  }

  /**
   * Invalidate matchmaking caches when user preferences change
   */
  static async invalidateMatchmaking(userId: string): Promise<void> {
    try {
      console.log(`🧽 Invalidating matchmaking caches for user: ${userId}`);

      const pipeline = cacheRedis.pipeline();

      // Matchmaking caches (using existing keys)
      pipeline.del(MATCHMAKING_REDIS_KEYS.USER_RECOMMENDATIONS(userId));
      pipeline.del(MATCHMAKING_REDIS_KEYS.PROJECT_RECOMMENDATIONS(userId));
      pipeline.del(MATCHMAKING_REDIS_KEYS.USER_VECTOR(userId));
      pipeline.del(MATCHMAKING_REDIS_KEYS.RECOMMENDATION_CACHE(userId));

      await pipeline.exec();

      console.log(`✅ Invalidated matchmaking caches for user: ${userId}`);
    } catch (error) {
      console.error("❌ Matchmaking cache invalidation error:", error);
    }
  }

  /**
   * Invalidate workspace-related caches
   */
  static async invalidateWorkspace(workspaceId: string): Promise<void> {
    try {
      console.log(`🧽 Invalidating workspace caches for: ${workspaceId}`);

      const pipeline = cacheRedis.pipeline();

      // Workspace caches
      pipeline.del(PROJECT_REDIS_KEYS.WORKSPACE_PROJECTS(workspaceId));

      await pipeline.exec();

      console.log(`✅ Invalidated workspace caches for: ${workspaceId}`);
    } catch (error) {
      console.error("❌ Workspace cache invalidation error:", error);
    }
  }

  /**
   * Invalidate all collaboration platform caches (emergency use)
   */
  static async invalidateAllCollaborationCaches(): Promise<void> {
    try {
      console.log("🧹 Starting emergency cache invalidation...");

      const patterns = [
        "user:*",
        "project:*",
        "chat:*",
        "match:*",
        "cache:*",
        "analytics:*",
        "session:*",
      ];

      let totalKeys = 0;

      for (const pattern of patterns) {
        try {
          const keys = await cacheRedis.keys(pattern);
          if (keys.length > 0) {
            // Process keys in batches to avoid memory issues
            const batchSize = 1000;
            for (let i = 0; i < keys.length; i += batchSize) {
              const batch = keys.slice(i, i + batchSize);
              await cacheRedis.del(...batch);
            }
            totalKeys += keys.length;
          }
        } catch (patternError) {
          console.error(`❌ Error invalidating pattern ${pattern}:`, patternError);
        }
      }

      console.log(`🧹 Emergency invalidation complete: ${totalKeys} keys removed`);
    } catch (error) {
      console.error("❌ Emergency cache invalidation error:", error);
      throw error;
    }
  }
}

// =============================================================================
// CACHE WARMING UTILITIES - LABYRINTH PLATFORM
// =============================================================================

export class CacheWarming {
  /**
   * Warm up critical user data for Labyrinth
   */
  static async warmUserData(userId: string): Promise<void> {
    try {
      console.log(`🔥 Warming cache for user ${userId}`);

      // Pre-load user profile and collaboration data using cache-aside strategy
      await Promise.all([
        CacheAsideStrategy.getUserProfile(userId),
        CacheAsideStrategy.getUserPreferences(userId),
        AnalyticsCache.getCollaborationStats(userId),
      ]);

      console.log(`✅ Cache warmed for user ${userId}`);
    } catch (error) {
      console.error("❌ Cache warming error:", error);
      // Don't throw error to prevent breaking main functionality
    }
  }

  /**
   * Warm up matchmaking data for active users
   */
  static async warmMatchmakingData(userId: string): Promise<void> {
    try {
      console.log(`🔥 Warming matchmaking cache for user ${userId}`);

      // Pre-load matchmaking data using available cache methods
      await Promise.all([AnalyticsCache.getCollaborationStats(userId)]);

      console.log(`✅ Matchmaking cache warmed for user ${userId}`);
    } catch (error) {
      console.error("❌ Matchmaking cache warming error:", error);
      // Don't throw error to prevent breaking main functionality
    }
  }

  /**
   * Warm up project collaboration data
   */
  static async warmProjectData(projectId: string): Promise<void> {
    try {
      console.log(`🔥 Warming cache for project ${projectId}`);

      // Pre-load project details and collaborator info
      await Promise.all([
        CacheAsideStrategy.getProjectDetails(projectId),
        AnalyticsCache.cacheProjectAnalytics(projectId, {}), // Placeholder for actual analytics
      ]);

      console.log(`✅ Cache warmed for project ${projectId}`);
    } catch (error) {
      console.error("❌ Project cache warming error:", error);
      // Don't throw error to prevent breaking main functionality
    }
  }

  /**
   * Bulk warm critical platform data
   */
  static async warmPlatformCriticalData(): Promise<void> {
    try {
      console.log("🔥 Warming critical platform caches");

      // Pre-load platform-wide metrics and frequently accessed data
      const today = new Date().toISOString().split("T")[0];
      await Promise.all([
        AnalyticsCache.trackPlatformMetric("active_users", 0, today),
        AnalyticsCache.trackPlatformMetric("daily_matches", 0, today),
        AnalyticsCache.trackPlatformMetric("daily_collaborations", 0, today),
      ]);

      console.log("✅ Critical platform caches warmed");
    } catch (error) {
      console.error("❌ Platform cache warming error:", error);
      // Don't throw error to prevent breaking main functionality
    }
  }
}

// Initialize write-behind cache flush process for Labyrinth platform
// WriteBehindCache.startFlushProcess(); // Temporarily disabled
