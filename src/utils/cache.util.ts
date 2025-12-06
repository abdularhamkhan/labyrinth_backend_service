import { cacheRedis } from "../redis";

/**
 * =============================================================================
 * REDIS CACHING UTILITY
 * =============================================================================
 *
 * Centralized caching layer for the Labyrinth platform.
 * Provides simple get/set/delete operations with TTL management.
 *
 * Cache Key Patterns:
 * - user:{userId} - User profiles (15 min TTL)
 * - user:{userId}:demographic - User demographics (15 min TTL)
 * - recommendations:user:{userId} - User recommendations (1 hour TTL)
 * - recommendations:project:{userId} - Project recommendations (1 hour TTL)
 * - chat:{chatId}:messages - Recent chat messages (5 min TTL)
 * - project:{projectId} - Project details (10 min TTL)
 * - presence:{userId} - User presence (30 sec TTL)
 *
 * =============================================================================
 */

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  USER_PROFILE: 15 * 60, // 15 minutes
  USER_DEMOGRAPHIC: 15 * 60, // 15 minutes
  RECOMMENDATIONS: 60 * 60, // 1 hour
  CHAT_MESSAGES: 5 * 60, // 5 minutes
  PROJECT_DETAILS: 10 * 60, // 10 minutes
  PRESENCE: 30, // 30 seconds
  SHORT: 60, // 1 minute
  MEDIUM: 5 * 60, // 5 minutes
  LONG: 60 * 60, // 1 hour
};

/**
 * Get value from cache
 */
export const getCached = async <T = any>(key: string): Promise<T | null> => {
  try {
    const cached = await cacheRedis.get(key);
    if (!cached) return null;

    return JSON.parse(cached) as T;
  } catch (error) {
    console.error(`Cache GET error for key "${key}":`, error);
    return null;
  }
};

/**
 * Set value in cache with TTL
 */
export const setCache = async (
  key: string,
  value: any,
  ttlSeconds: number = CACHE_TTL.MEDIUM
): Promise<boolean> => {
  try {
    await cacheRedis.setex(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Cache SET error for key "${key}":`, error);
    return false;
  }
};

/**
 * Delete value from cache
 */
export const deleteCache = async (key: string): Promise<boolean> => {
  try {
    await cacheRedis.del(key);
    return true;
  } catch (error) {
    console.error(`Cache DELETE error for key "${key}":`, error);
    return false;
  }
};

/**
 * Delete multiple keys matching a pattern
 */
export const deleteCachePattern = async (pattern: string): Promise<number> => {
  try {
    const keys = await cacheRedis.keys(pattern);
    if (keys.length === 0) return 0;

    await cacheRedis.del(...keys);
    return keys.length;
  } catch (error) {
    console.error(`Cache DELETE PATTERN error for pattern "${pattern}":`, error);
    return 0;
  }
};

/**
 * Check if key exists in cache
 */
export const cacheExists = async (key: string): Promise<boolean> => {
  try {
    const exists = await cacheRedis.exists(key);
    return exists === 1;
  } catch (error) {
    console.error(`Cache EXISTS error for key "${key}":`, error);
    return false;
  }
};

/**
 * Get remaining TTL for a key
 */
export const getCacheTTL = async (key: string): Promise<number> => {
  try {
    return await cacheRedis.ttl(key);
  } catch (error) {
    console.error(`Cache TTL error for key "${key}":`, error);
    return -1;
  }
};

/**
 * Cache key generators
 */
export const CacheKeys = {
  userProfile: (userId: string) => `user:${userId}`,
  userDemographic: (userId: string) => `user:${userId}:demographic`,
  userRecommendations: (userId: string, limit?: number) => 
    `recommendations:user:${userId}${limit ? `:${limit}` : ''}`,
  projectRecommendations: (userId: string, limit?: number) => 
    `recommendations:project:${userId}${limit ? `:${limit}` : ''}`,
  chatMessages: (chatId: string, page?: number, limit?: number) => 
    `chat:${chatId}:messages${page ? `:p${page}` : ''}${limit ? `:l${limit}` : ''}`,
  projectDetails: (projectId: string) => `project:${projectId}`,
  userPresence: (userId: string) => `presence:${userId}`,
  matchmakingStats: (userId: string) => `matchmaking:stats:${userId}`,
};

/**
 * Helper: Get or set cached data
 * Fetches from cache, or calls fetchFunction if cache miss, then stores result
 */
export const getOrSetCache = async <T = any>(
  key: string,
  fetchFunction: () => Promise<T>,
  ttlSeconds: number = CACHE_TTL.MEDIUM
): Promise<T> => {
  // Try to get from cache
  const cached = await getCached<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Cache miss - fetch fresh data
  const freshData = await fetchFunction();

  // Store in cache (fire and forget)
  setCache(key, freshData, ttlSeconds).catch((err) =>
    console.error(`Failed to cache data for key "${key}":`, err)
  );

  return freshData;
};

/**
 * Invalidate related caches when data changes
 */
export const invalidateUserCache = async (userId: string): Promise<void> => {
  await Promise.all([
    deleteCache(CacheKeys.userProfile(userId)),
    deleteCache(CacheKeys.userDemographic(userId)),
    deleteCache(CacheKeys.userRecommendations(userId)),
    deleteCache(CacheKeys.projectRecommendations(userId)),
    deleteCache(CacheKeys.matchmakingStats(userId)),
  ]);
};

export const invalidateProjectCache = async (projectId: string): Promise<void> => {
  await deleteCache(CacheKeys.projectDetails(projectId));
};

export const invalidateChatCache = async (chatId: string): Promise<void> => {
  await deleteCache(CacheKeys.chatMessages(chatId));
};
