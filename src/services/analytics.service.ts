import { prisma } from "../config/prisma";
import { redis as redisClient } from "../config/redis";
import { logger, isError } from "../utils/logger";
import { kafkaProducer } from "./kafka-producer.service";

/**
 * =============================================================================
 * ANALYTICS SERVICE - LABYRINTH COLLABORATION PLATFORM
 * =============================================================================
 * 
 * Comprehensive analytics service providing insights into:
 * 
 * - User engagement and activity patterns
 * - Project progress and collaboration metrics
 * - Platform usage statistics and trends
 * - Real-time dashboard data
 * - Performance metrics and KPIs
 * 
 * Features:
 * - Real-time event tracking
 * - Aggregated metrics with Redis caching
 * - Time-series data for trending
 * - User behavior analytics
 * - Project success metrics
 * - Platform health monitoring
 * 
 * =============================================================================
 */

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export interface UserEngagementMetrics {
  userId: string;
  dailyActive: boolean;
  weeklyActive: boolean;
  monthlyActive: boolean;
  sessionDuration: number;
  projectsCreated: number;
  projectsJoined: number;
  messagesPosted: number;
  swipesMade: number;
  matchesCreated: number;
  lastActivity: Date;
}

export interface ProjectProgressMetrics {
  projectId: string;
  tasksTotal: number;
  tasksCompleted: number;
  completionPercentage: number;
  collaboratorsCount: number;
  messagesCount: number;
  filesUploaded: number;
  daysSinceCreated: number;
  lastActivity: Date;
  activityScore: number;
}

export interface PlatformMetrics {
  totalUsers: number;
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  totalProjects: number;
  activeProjects: number;
  totalMatches: number;
  totalMessages: number;
  avgProjectCollaborators: number;
  avgUserProjects: number;
  platformGrowthRate: number;
  engagementRate: number;
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  metric: string;
  dimension?: string;
}

export interface AnalyticsEvent {
  userId?: string;
  projectId?: string;
  eventType: string;
  eventData: Record<string, any>;
  timestamp: Date;
  sessionId?: string;
  metadata?: Record<string, any>;
}

// =============================================================================
// CACHE KEYS AND TTL
// =============================================================================

const CACHE_KEYS = {
  userEngagement: (userId: string) => `analytics:user:${userId}:engagement`,
  projectProgress: (projectId: string) => `analytics:project:${projectId}:progress`,
  platformMetrics: () => `analytics:platform:metrics`,
  dailyActive: (date: string) => `analytics:dau:${date}`,
  weeklyActive: (week: string) => `analytics:wau:${week}`,
  monthlyActive: (month: string) => `analytics:mau:${month}`,
  userSessions: (userId: string) => `analytics:sessions:${userId}`,
  projectActivity: (projectId: string) => `analytics:project:${projectId}:activity`
};

const CACHE_TTL = {
  userEngagement: 1800, // 30 minutes
  projectProgress: 3600, // 1 hour
  platformMetrics: 1800, // 30 minutes
  dailyActive: 86400, // 24 hours
  weeklyActive: 604800, // 7 days
  monthlyActive: 2592000, // 30 days
  realtime: 300 // 5 minutes
};

// =============================================================================
// EVENT TRACKING
// =============================================================================

/**
 * Track analytics event
 */
export const trackEvent = async (event: AnalyticsEvent): Promise<void> => {
  try {
    // Store event in Redis for real-time processing
    const eventKey = `event:${event.eventType}:${Date.now()}:${Math.random().toString(36)}`;
    await redisClient.setex(eventKey, 3600, JSON.stringify(event)); // Keep for 1 hour

    // Send to Kafka for batch processing
    await kafkaProducer.sendMessage('analytics-events', {
      ...event,
      timestamp: event.timestamp.toISOString()
    });

    // Update real-time counters
    await updateRealTimeCounters(event);

    logger.info('Analytics event tracked', {
      eventType: event.eventType,
      userId: event.userId,
      projectId: event.projectId
    });
  } catch (error) {
    logger.error('Failed to track analytics event:', isError(error) ? error : new Error(String(error)));
    throw error;
  }
};

/**
 * Update real-time counters for immediate dashboard updates
 */
const updateRealTimeCounters = async (event: AnalyticsEvent): Promise<void> => {
  try {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const weekKey = getWeekKey(now);
    const monthKey = getMonthKey(now);

    switch (event.eventType) {
      case 'user_login':
      case 'user_activity':
        if (event.userId) {
          await Promise.all([
            redisClient.sadd(CACHE_KEYS.dailyActive(dateKey), event.userId),
            redisClient.sadd(CACHE_KEYS.weeklyActive(weekKey), event.userId),
            redisClient.sadd(CACHE_KEYS.monthlyActive(monthKey), event.userId),
            redisClient.expire(CACHE_KEYS.dailyActive(dateKey), CACHE_TTL.dailyActive),
            redisClient.expire(CACHE_KEYS.weeklyActive(weekKey), CACHE_TTL.weeklyActive),
            redisClient.expire(CACHE_KEYS.monthlyActive(monthKey), CACHE_TTL.monthlyActive)
          ]);
        }
        break;

      case 'project_created':
      case 'project_joined':
      case 'task_completed':
        if (event.projectId) {
          const activityKey = CACHE_KEYS.projectActivity(event.projectId);
          await redisClient.zadd(activityKey, Date.now(), JSON.stringify(event));
          await redisClient.expire(activityKey, 86400); // Keep for 24 hours
        }
        break;

      case 'message_sent':
        const messageCountKey = `metrics:messages:${dateKey}`;
        await redisClient.incr(messageCountKey);
        await redisClient.expire(messageCountKey, CACHE_TTL.dailyActive);
        break;
    }
  } catch (error) {
    logger.error('Failed to update real-time counters:', isError(error) ? error : new Error(String(error)));
  }
};

// =============================================================================
// USER ENGAGEMENT ANALYTICS
// =============================================================================

/**
 * Get user engagement metrics
 */
export const getUserEngagementMetrics = async (userId: string): Promise<UserEngagementMetrics> => {
  try {
    const cacheKey = CACHE_KEYS.userEngagement(userId);
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get user activity data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workspaces: {
          include: {
            projects: true
          }
        },
        projects: true,
        swipesMade: {
          where: { createdAt: { gte: oneMonthAgo } }
        },
        messages: {
          where: { sentAt: { gte: oneMonthAgo } }
        },
        matchUsers: {
          where: { match: { createdAt: { gte: oneMonthAgo } } }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check activity periods
    const dailyActive = user.lastActive ? user.lastActive >= oneDayAgo : false;
    const weeklyActive = user.lastActive ? user.lastActive >= oneWeekAgo : false;
    const monthlyActive = user.lastActive ? user.lastActive >= oneMonthAgo : false;

    // Calculate session duration (simplified)
    const avgSessionDuration = await calculateAverageSessionDuration(userId);

    const metrics: UserEngagementMetrics = {
      userId,
      dailyActive,
      weeklyActive,
      monthlyActive,
      sessionDuration: avgSessionDuration,
      projectsCreated: user.workspaces.reduce((count, workspace) => count + workspace.projects.length, 0),
      projectsJoined: user.projects.length,
      messagesPosted: user.messages.length,
      swipesMade: user.swipesMade.length,
      matchesCreated: user.matchUsers.length,
      lastActivity: user.lastActive || user.createdAt
    };

    // Cache the results
    await redisClient.setex(cacheKey, CACHE_TTL.userEngagement, JSON.stringify(metrics));

    return metrics;
  } catch (error) {
    logger.error('Failed to get user engagement metrics:', error);
    throw error;
  }
};

/**
 * Calculate average session duration for user
 */
const calculateAverageSessionDuration = async (userId: string): Promise<number> => {
  try {
    const sessionKey = CACHE_KEYS.userSessions(userId);
    const sessions = await redisClient.lrange(sessionKey, 0, -1);
    
    if (sessions.length === 0) {
      return 0;
    }

    const durations = sessions.map(session => {
      try {
        const sessionData = JSON.parse(session);
        return sessionData.duration || 0;
      } catch {
        return 0;
      }
    });

    return durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
  } catch (error) {
    logger.error('Failed to calculate average session duration:', error);
    return 0;
  }
};

// =============================================================================
// PROJECT PROGRESS ANALYTICS
// =============================================================================

/**
 * Get project progress metrics
 */
export const getProjectProgressMetrics = async (projectId: string): Promise<ProjectProgressMetrics> => {
  try {
    const cacheKey = CACHE_KEYS.projectProgress(projectId);
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: true,
        collaborators: true,
        chat: {
          include: {
            messages: true
          }
        }
      }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const tasksTotal = project.tasks.length;
    const tasksCompleted = project.tasks.filter(task => task.status === 'COMPLETED').length;
    const completionPercentage = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;
    const daysSinceCreated = Math.floor((Date.now() - project.createdAt.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate activity score based on recent activity
    const recentMessages = project.chat?.messages.filter(
      msg => Date.now() - msg.sentAt.getTime() < 7 * 24 * 60 * 60 * 1000
    ).length || 0;
    
    const recentTasks = project.tasks.filter(
      task => task.updatedAt && Date.now() - task.updatedAt.getTime() < 7 * 24 * 60 * 60 * 1000
    ).length;

    const activityScore = Math.min((recentMessages * 0.5 + recentTasks * 2) / 10, 1) * 100;

    const metrics: ProjectProgressMetrics = {
      projectId,
      tasksTotal,
      tasksCompleted,
      completionPercentage: Math.round(completionPercentage * 100) / 100,
      collaboratorsCount: project.collaborators.length,
      messagesCount: project.chat?.messages.length || 0,
      filesUploaded: await getProjectFilesCount(projectId),
      daysSinceCreated,
      lastActivity: getLastProjectActivity(project),
      activityScore: Math.round(activityScore * 100) / 100
    };

    // Cache the results
    await redisClient.setex(cacheKey, CACHE_TTL.projectProgress, JSON.stringify(metrics));

    return metrics;
  } catch (error) {
    logger.error('Failed to get project progress metrics:', error);
    throw error;
  }
};

/**
 * Get project files count
 */
const getProjectFilesCount = async (projectId: string): Promise<number> => {
  try {
    const filesCount = await prisma.media.count({
      where: {
        tags: {
          has: `project:${projectId}`
        },
        category: 'PROJECT_FILE'
      }
    });
    return filesCount;
  } catch (error) {
    logger.error('Failed to get project files count:', error);
    return 0;
  }
};

/**
 * Get last project activity date
 */
const getLastProjectActivity = (project: any): Date => {
  const dates = [
    project.updatedAt,
    project.chat?.messages?.[0]?.sentAt,
    ...project.tasks.map((task: any) => task.updatedAt)
  ].filter(Boolean);

  return dates.length > 0 ? new Date(Math.max(...dates.map(date => date.getTime()))) : project.createdAt;
};

// =============================================================================
// PLATFORM METRICS
// =============================================================================

/**
 * Get platform-wide metrics
 */
export const getPlatformMetrics = async (): Promise<PlatformMetrics> => {
  try {
    const cacheKey = CACHE_KEYS.platformMetrics();
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const weekKey = getWeekKey(now);
    const monthKey = getMonthKey(now);
    const lastMonthKey = getMonthKey(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));

    // Get active user counts from Redis sets
    const [dailyActive, weeklyActive, monthlyActive] = await Promise.all([
      redisClient.scard(CACHE_KEYS.dailyActive(dateKey)),
      redisClient.scard(CACHE_KEYS.weeklyActive(weekKey)),
      redisClient.scard(CACHE_KEYS.monthlyActive(monthKey))
    ]);

    // Get database counts
    const [totalUsers, totalProjects, totalMatches, totalMessages] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.match.count(),
      prisma.message.count()
    ]);

    // Get active projects (projects with activity in last 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const activeProjects = await prisma.project.count({
      where: {
        OR: [
          { updatedAt: { gte: sevenDaysAgo } },
          { tasks: { some: { updatedAt: { gte: sevenDaysAgo } } } },
          { chat: { messages: { some: { sentAt: { gte: sevenDaysAgo } } } } }
        ]
      }
    });

    // Calculate averages
    const avgProjectCollaborators = await calculateAverageProjectCollaborators();
    const avgUserProjects = totalUsers > 0 ? totalProjects / totalUsers : 0;

    // Calculate growth rate (simplified - comparing this month vs last month)
    const thisMonthUsers = monthlyActive;
    const lastMonthUsers = await redisClient.scard(CACHE_KEYS.monthlyActive(lastMonthKey)) || 1;
    const platformGrowthRate = ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;

    // Calculate engagement rate (DAU/MAU ratio)
    const engagementRate = monthlyActive > 0 ? (dailyActive / monthlyActive) * 100 : 0;

    const metrics: PlatformMetrics = {
      totalUsers,
      activeUsers: {
        daily: dailyActive,
        weekly: weeklyActive,
        monthly: monthlyActive
      },
      totalProjects,
      activeProjects,
      totalMatches,
      totalMessages,
      avgProjectCollaborators: Math.round(avgProjectCollaborators * 100) / 100,
      avgUserProjects: Math.round(avgUserProjects * 100) / 100,
      platformGrowthRate: Math.round(platformGrowthRate * 100) / 100,
      engagementRate: Math.round(engagementRate * 100) / 100
    };

    // Cache the results
    await redisClient.setex(cacheKey, CACHE_TTL.platformMetrics, JSON.stringify(metrics));

    return metrics;
  } catch (error) {
    logger.error('Failed to get platform metrics:', error);
    throw error;
  }
};

/**
 * Calculate average project collaborators
 */
const calculateAverageProjectCollaborators = async (): Promise<number> => {
  try {
    const projects = await prisma.project.findMany({
      select: {
        _count: {
          select: {
            collaborators: true
          }
        }
      }
    });

    if (projects.length === 0) return 0;

    const totalCollaborators = projects.reduce((sum, project) => sum + project._count.collaborators, 0);
    return totalCollaborators / projects.length;
  } catch (error) {
    logger.error('Failed to calculate average project collaborators:', error);
    return 0;
  }
};

// =============================================================================
// TIME SERIES DATA
// =============================================================================

/**
 * Get time series data for a specific metric
 */
export const getTimeSeriesData = async (
  metric: string,
  startDate: Date,
  endDate: Date,
  granularity: 'hour' | 'day' | 'week' = 'day'
): Promise<TimeSeriesData[]> => {
  try {
    const data: TimeSeriesData[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const timestamp = new Date(current);
      let value = 0;

      switch (metric) {
        case 'daily_active_users':
          const dateKey = timestamp.toISOString().split('T')[0];
          value = await redisClient.scard(CACHE_KEYS.dailyActive(dateKey));
          break;
        
        case 'messages_sent':
          const msgKey = `metrics:messages:${timestamp.toISOString().split('T')[0]}`;
          const msgCount = await redisClient.get(msgKey);
          value = msgCount ? parseInt(msgCount) : 0;
          break;
        
        // Add more metrics as needed
        default:
          value = 0;
      }

      data.push({
        timestamp,
        value,
        metric
      });

      // Increment based on granularity
      switch (granularity) {
        case 'hour':
          current.setHours(current.getHours() + 1);
          break;
        case 'day':
          current.setDate(current.getDate() + 1);
          break;
        case 'week':
          current.setDate(current.getDate() + 7);
          break;
      }
    }

    return data;
  } catch (error) {
    logger.error('Failed to get time series data:', error);
    throw error;
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get week key for Redis
 */
const getWeekKey = (date: Date): string => {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-W${week.toString().padStart(2, '0')}`;
};

/**
 * Get month key for Redis
 */
const getMonthKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}-${month.toString().padStart(2, '0')}`;
};

/**
 * Get week number
 */
const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

/**
 * Clear analytics cache
 */
export const clearAnalyticsCache = async (): Promise<void> => {
  try {
    const pattern = 'analytics:*';
    const keys = await redisClient.keys(pattern);
    
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }

    logger.info('Analytics cache cleared');
  } catch (error) {
    logger.error('Failed to clear analytics cache:', error);
    throw error;
  }
};

// =============================================================================
// SESSION TRACKING
// =============================================================================

/**
 * Start user session
 */
export const startUserSession = async (userId: string, sessionId: string): Promise<void> => {
  try {
    const sessionData = {
      userId,
      sessionId,
      startTime: Date.now(),
      lastActivity: Date.now()
    };

    await redisClient.setex(`session:${sessionId}`, 86400, JSON.stringify(sessionData));
    
    // Track login event
    await trackEvent({
      userId,
      eventType: 'user_login',
      eventData: { sessionId },
      timestamp: new Date(),
      sessionId,
      metadata: { source: 'web' }
    });
  } catch (error) {
    logger.error('Failed to start user session:', error);
    throw error;
  }
};

/**
 * End user session
 */
export const endUserSession = async (sessionId: string): Promise<void> => {
  try {
    const sessionKey = `session:${sessionId}`;
    const sessionData = await redisClient.get(sessionKey);
    
    if (sessionData) {
      const session = JSON.parse(sessionData);
      const duration = Date.now() - session.startTime;
      
      // Store session duration for analytics
      const sessionsKey = CACHE_KEYS.userSessions(session.userId);
      await redisClient.lpush(sessionsKey, JSON.stringify({ duration, endTime: Date.now() }));
      await redisClient.ltrim(sessionsKey, 0, 99); // Keep last 100 sessions
      await redisClient.expire(sessionsKey, 86400 * 30); // 30 days
      
      // Clean up session
      await redisClient.del(sessionKey);
      
      // Track logout event
      await trackEvent({
        userId: session.userId,
        eventType: 'user_logout',
        eventData: { sessionId, duration },
        timestamp: new Date(),
        sessionId,
        metadata: { duration }
      });
    }
  } catch (error) {
    logger.error('Failed to end user session:', error);
    throw error;
  }
};

export default {
  trackEvent,
  getUserEngagementMetrics,
  getProjectProgressMetrics,
  getPlatformMetrics,
  getTimeSeriesData,
  clearAnalyticsCache,
  startUserSession,
  endUserSession
};