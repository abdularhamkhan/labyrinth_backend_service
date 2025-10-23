/**
 * =============================================================================
 * REDIS MODULE INDEX - Centralized Redis Exports
 * =============================================================================
 *
 * This file provides a centralized export point for all Redis-related
 * functionality, making it easier to import Redis features throughout
 * the application.
 *
 * =============================================================================
 */

// =============================================================================
// REDIS CONFIGURATION AND CLIENTS
// =============================================================================

import {
  ProductionRedisManager,
  productionRedisClients as redisClients,
  sessionRedis,
  cacheRedis,
  pubsubRedis,
  queueRedis,
  gameStateRedis,
  checkRedisHealth,
  getRedisStats,
  getRedisMetrics,
  getRedisAlerts,
  clearRedisAlerts,
} from "./config/redis.production.config";

// =============================================================================
// SESSION MANAGEMENT
// =============================================================================

export {
  createSession,
  getSession,
  updateSessionActivity,
  terminateSession,
  isSessionValid,
} from "./session/sessionManager";

// =============================================================================
// CACHING STRATEGIES
// =============================================================================

export {
  CACHE_KEYS,
  CACHE_TTL,
  WriteThroughCache,
  CacheAsideStrategy,
  WriteBehindCache,
  CacheInvalidation,
} from "./strategies/cachingStrategies";

// =============================================================================
// MESSAGE QUEUE SYSTEM
// =============================================================================

export {
  JobType,
  JobPriority,
  Job,
  QueueStats,
  QueueManager,
  queueManager,
  addNotificationJob,
  addLeaderboardUpdateJob,
  addGameResultJob,
} from "./messageQueue/queueManager";

// =============================================================================
// MIDDLEWARE
// =============================================================================

export {
  validateSession,
  cacheResponse,
  rateLimit,
  trackOnlineUser,
  attachUserProfile,
  authenticatedUser,
  cachedAuthenticatedRoute,
} from "./middleware/redisMiddleware";

// =============================================================================
// REDIS UTILITIES AND HELPERS
// =============================================================================

// =============================================================================
// INTERNAL IMPORTS FOR UTILITY FUNCTIONS
// =============================================================================

const healthCheck = checkRedisHealth;
const redisManager = ProductionRedisManager;

// Import queue manager with error handling
let queueMgr: any;
try {
  const queueModule = require("./messageQueue/queueManager");
  queueMgr = queueModule.queueManager;
} catch (error) {
  console.warn(
    "⚠️ Queue manager not available:",
    error instanceof Error ? error.message : String(error)
  );
  queueMgr = null;
}

// =============================================================================
// REDIS UTILITIES AND HELPERS
// =============================================================================

/**
 * Initialize Redis connections and start services
 */
export const initializeRedis = async (): Promise<void> => {
  try {
    console.log("🔄 Initializing Redis services...");

    // Check Redis health
    const isHealthy = await healthCheck();
    if (!isHealthy) {
      throw new Error("Redis health check failed");
    }

    // Start queue processing
    console.log("✅ Redis services initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Redis services:", error);
    throw error;
  }
};

/**
 * Gracefully shutdown Redis connections
 */
export const shutdownRedis = async (): Promise<void> => {
  try {
    console.log("🔄 Shutting down Redis services...");

    // Stop queue manager if available
    if (queueMgr && typeof queueMgr.shutdown === "function") {
      await queueMgr.shutdown();
    } else {
      console.log("⚠️ Queue manager not available for shutdown");
    }

    // Disconnect Redis clients
    const manager = new ProductionRedisManager();
    await manager.disconnect();

    console.log("✅ Redis services shutdown complete");
  } catch (error) {
    console.error("❌ Error during Redis shutdown:", error);
    throw error;
  }
};

// =============================================================================
// EXPORT REDIS CLIENTS
// =============================================================================

export {
  sessionRedis,
  cacheRedis,
  pubsubRedis,
  queueRedis,
  gameStateRedis,
  ProductionRedisManager,
  checkRedisHealth,
  getRedisStats,
  getRedisMetrics,
  getRedisAlerts,
  clearRedisAlerts,
  redisClients,
};
