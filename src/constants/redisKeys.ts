/**
 * =============================================================================
 * LABYRINTH REDIS KEYS - COLLABORATION PLATFORM
 * =============================================================================
 *
 * This file contains all Redis key patterns for the Labyrinth collaboration platform.
 * Organized by feature area with consistent naming conventions.
 *
 * Key Naming Convention:
 * - namespace:entity:identifier:property
 * - Use lowercase with colons as separators
 * - Include TTL suffix where applicable
 *
 * =============================================================================
 */

// =============================================================================
// USER MANAGEMENT AND PROFILES
// =============================================================================

export const USER_REDIS_KEYS = {
  // User Profiles and Caching
  PROFILE: (userId: string) => `user:profile:${userId}`,
  PREFERENCES: (userId: string) => `user:preferences:${userId}`,
  TECH_STACK: (userId: string) => `user:techstack:${userId}`,
  DEMOGRAPHICS: (userId: string) => `user:demographics:${userId}`,
  WORKSPACE: (userId: string) => `user:workspace:${userId}`,
  
  // User Activity and Presence
  LAST_ACTIVE: (userId: string) => `user:activity:${userId}`,
  ONLINE_STATUS: (userId: string) => `user:online:${userId}`,
  DEVICE_INFO: (userId: string) => `user:device:${userId}`,
  
  // User Stats and Analytics
  COLLABORATION_STATS: (userId: string) => `user:stats:collaboration:${userId}`,
  PROJECT_HISTORY: (userId: string) => `user:projects:history:${userId}`,
  SKILL_ENDORSEMENTS: (userId: string) => `user:endorsements:${userId}`,
} as const;

// =============================================================================
// MATCHMAKING AND RECOMMENDATIONS
// =============================================================================

export const MATCHMAKING_REDIS_KEYS = {
  // User Recommendations
  USER_RECOMMENDATIONS: (userId: string) => `match:user:recs:${userId}`,
  PROJECT_RECOMMENDATIONS: (userId: string) => `match:project:recs:${userId}`,
  RECOMMENDATION_POOL: (techStack: string) => `match:pool:${techStack}`,
  
  // Swipe Tracking
  DAILY_SWIPES: (userId: string, date: string) => `swipe:daily:${userId}:${date}`,
  SWIPE_HISTORY: (userId: string) => `swipe:history:${userId}`,
  MUTUAL_MATCHES: (userId: string) => `match:mutual:${userId}`,
  
  // Match Queue and Processing
  PENDING_MATCHES: (userId: string) => `match:pending:${userId}`,
  ACTIVE_MATCHES: (userId: string) => `match:active:${userId}`,
  MATCH_SCORES: (userId: string, targetId: string) => `match:score:${userId}:${targetId}`,
  
  // Algorithm Data
  USER_VECTOR: (userId: string) => `algo:vector:${userId}`,
  SIMILARITY_MATRIX: `algo:similarity:matrix`,
  RECOMMENDATION_CACHE: (userId: string) => `algo:cache:${userId}`,
} as const;

// =============================================================================
// PROJECT MANAGEMENT AND COLLABORATION
// =============================================================================

export const PROJECT_REDIS_KEYS = {
  // Project Data
  PROJECT_DETAILS: (projectId: string) => `project:details:${projectId}`,
  PROJECT_MEMBERS: (projectId: string) => `project:members:${projectId}`,
  PROJECT_ROLES: (projectId: string) => `project:roles:${projectId}`,
  PROJECT_TECH_STACK: (projectId: string) => `project:techstack:${projectId}`,
  
  // Project Activity
  PROJECT_ACTIVITY: (projectId: string) => `project:activity:${projectId}`,
  RECENT_UPDATES: (projectId: string) => `project:updates:${projectId}`,
  PROJECT_STATS: (projectId: string) => `project:stats:${projectId}`,
  
  // Task Management (Basic)
  PROJECT_TASKS: (projectId: string) => `project:tasks:${projectId}`,
  TASK_ASSIGNMENTS: (projectId: string) => `project:assignments:${projectId}`,
  TASK_STATUS: (taskId: string) => `task:status:${taskId}`,
  
  // Workspace Data
  WORKSPACE_PROJECTS: (workspaceId: string) => `workspace:projects:${workspaceId}`,
  ACTIVE_COLLABORATIONS: (userId: string) => `user:collaborations:active:${userId}`,
} as const;

// =============================================================================
// REAL-TIME CHAT AND MESSAGING
// =============================================================================

export const CHAT_REDIS_KEYS = {
  // Chat Rooms and Messages
  CHAT_ROOM: (chatId: string) => `chat:room:${chatId}`,
  CHAT_MESSAGES: (chatId: string) => `chat:messages:${chatId}`,
  CHAT_PARTICIPANTS: (chatId: string) => `chat:participants:${chatId}`,
  CHAT_METADATA: (chatId: string) => `chat:meta:${chatId}`,
  
  // User Chat Data
  USER_CHATS: (userId: string) => `user:chats:${userId}`,
  UNREAD_COUNT: (userId: string, chatId: string) => `chat:unread:${userId}:${chatId}`,
  LAST_READ: (userId: string, chatId: string) => `chat:lastread:${userId}:${chatId}`,
  
  // Real-time Features
  TYPING_INDICATOR: (chatId: string, userId: string) => `chat:typing:${chatId}:${userId}`,
  ONLINE_IN_CHAT: (chatId: string) => `chat:online:${chatId}`,
  MESSAGE_QUEUE: (chatId: string) => `chat:queue:${chatId}`,
  
  // Direct Messages
  DM_THREAD: (userId1: string, userId2: string) => {
    const [id1, id2] = [userId1, userId2].sort();
    return `dm:thread:${id1}:${id2}`;
  },
} as const;

// =============================================================================
// CACHING AND SESSION MANAGEMENT
// =============================================================================

export const CACHE_KEYS = {
  // User Data Caching
  USER_PROFILE: (userId: string) => `cache:user:profile:${userId}`,
  USER_PREFERENCES: (userId: string) => `cache:user:preferences:${userId}`,
  USER_TECH_STACK: (userId: string) => `cache:user:techstack:${userId}`,
  USER_DEMOGRAPHICS: (userId: string) => `cache:user:demographics:${userId}`,
  
  // Project Data Caching
  PROJECT_DETAILS: (projectId: string) => `cache:project:details:${projectId}`,
  PROJECT_COLLABORATORS: (projectId: string) => `cache:project:collaborators:${projectId}`,
  
  // Session Management
  USER_SESSION: (sessionToken: string) => `session:${sessionToken}`,
  ACTIVE_SESSIONS: (userId: string) => `user:sessions:${userId}`,
  
  // API Response Caching
  API_RESPONSE: (endpoint: string, params: string) => `api:cache:${endpoint}:${params}`,
} as const;

// =============================================================================
// QUEUE KEYS FOR BACKGROUND PROCESSING
// =============================================================================

export const QUEUE_KEYS = {
  // Job Queues
  HIGH_PRIORITY: "queue:high",
  NORMAL_PRIORITY: "queue:normal",
  LOW_PRIORITY: "queue:low",
  DEAD_LETTER: "queue:dead_letter",
  
  // Specific Job Types
  EMAIL_NOTIFICATIONS: "queue:email:notifications",
  MATCH_PROCESSING: "queue:match:processing",
  RECOMMENDATION_UPDATES: "queue:recommendations:updates",
  PROJECT_ANALYTICS: "queue:analytics:projects",
  USER_ACTIVITY_PROCESSING: "queue:activity:processing",
  
  // Queue Stats
  QUEUE_STATS: "queue:stats",
  FAILED_JOBS: "queue:failed",
  RETRY_JOBS: "queue:retry",
} as const;

// =============================================================================
// PUBSUB CHANNELS FOR REAL-TIME EVENTS
// =============================================================================

export const PUBSUB_CHANNELS = {
  // User Events
  USER_ACTIVITY: "channel:user:activity",
  USER_PROFILE_UPDATES: "channel:user:profile:updates",
  USER_PRESENCE: "channel:user:presence",
  
  // Chat Events
  CHAT_MESSAGES: (chatId: string) => `channel:chat:${chatId}:messages`,
  CHAT_TYPING: (chatId: string) => `channel:chat:${chatId}:typing`,
  CHAT_PRESENCE: (chatId: string) => `channel:chat:${chatId}:presence`,
  
  // Project Events
  PROJECT_UPDATES: (projectId: string) => `channel:project:${projectId}:updates`,
  PROJECT_COLLABORATION: (projectId: string) => `channel:project:${projectId}:collaboration`,
  
  // Match Events
  MATCH_NOTIFICATIONS: (userId: string) => `channel:match:${userId}:notifications`,
  NEW_RECOMMENDATIONS: (userId: string) => `channel:recommendations:${userId}`,
  
  // System Events
  SYSTEM_NOTIFICATIONS: "channel:system:notifications",
  PLATFORM_UPDATES: "channel:platform:updates",
} as const;

// =============================================================================
// TTL CONSTANTS FOR LABYRINTH PLATFORM
// =============================================================================

export const CACHE_TTL = {
  // User Data TTLs
  USER_PROFILE: 3600, // 1 hour
  USER_PREFERENCES: 7200, // 2 hours
  USER_TECH_STACK: 3600, // 1 hour
  USER_DEMOGRAPHICS: 7200, // 2 hours
  
  // Session and Auth TTLs
  USER_SESSION: 86400, // 24 hours
  JWT_BLACKLIST: 86400, // 24 hours
  PASSWORD_RESET: 3600, // 1 hour
  EMAIL_VERIFICATION: 86400, // 24 hours
  
  // Matchmaking and Recommendations TTLs
  USER_RECOMMENDATIONS: 1800, // 30 minutes
  PROJECT_RECOMMENDATIONS: 3600, // 1 hour
  MATCH_SCORES: 3600, // 1 hour
  SWIPE_DAILY_LIMIT: 86400, // 24 hours (reset daily)
  
  // Chat and Communication TTLs
  TYPING_INDICATOR: 10, // 10 seconds
  CHAT_PRESENCE: 300, // 5 minutes
  UNREAD_MESSAGES: 604800, // 7 days
  
  // Project and Collaboration TTLs
  PROJECT_DETAILS: 1800, // 30 minutes
  PROJECT_ACTIVITY: 900, // 15 minutes
  COLLABORATION_STATS: 3600, // 1 hour
  
  // API and Performance TTLs
  API_RESPONSE_CACHE: 300, // 5 minutes
  RATE_LIMIT_WINDOW: 900, // 15 minutes
  ANALYTICS_DATA: 1800, // 30 minutes
} as const;

// =============================================================================
// RATE LIMITING KEYS
// =============================================================================

export const RATE_LIMIT_KEYS = {
  // API Rate Limiting
  API_REQUESTS: (userId: string, endpoint: string) => `ratelimit:api:${userId}:${endpoint}`,
  GLOBAL_API: (ip: string) => `ratelimit:global:${ip}`,
  
  // Feature-Specific Rate Limiting
  SWIPE_LIMIT: (userId: string, date: string) => `ratelimit:swipe:${userId}:${date}`,
  MESSAGE_LIMIT: (userId: string, chatId: string) => `ratelimit:message:${userId}:${chatId}`,
  PROJECT_CREATION: (userId: string) => `ratelimit:project:create:${userId}`,
  
  // Security Rate Limiting
  LOGIN_ATTEMPTS: (ip: string) => `ratelimit:login:${ip}`,
  PASSWORD_RESET_ATTEMPTS: (email: string) => `ratelimit:password:${email}`,
  SIGNUP_ATTEMPTS: (ip: string) => `ratelimit:signup:${ip}`,
} as const;
