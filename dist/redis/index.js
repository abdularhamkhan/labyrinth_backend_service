"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.shutdownRedis = exports.initializeRedis = exports.cachedAuthenticatedRoute = exports.authenticatedUser = exports.attachUserProfile = exports.trackOnlineUser = exports.rateLimit = exports.cacheResponse = exports.validateSession = exports.addGameResultJob = exports.addLeaderboardUpdateJob = exports.addNotificationJob = exports.queueManager = exports.QueueManager = exports.JobPriority = exports.JobType = exports.CacheInvalidation = exports.LeaderboardCache = exports.WriteBehindCache = exports.CacheAsideStrategy = exports.WriteThroughCache = exports.CACHE_TTL = exports.CACHE_KEYS = exports.isSessionValid = exports.terminateSession = exports.updateSessionActivity = exports.getSession = exports.createSession = exports.clearRedisAlerts = exports.getRedisAlerts = exports.getRedisMetrics = exports.getRedisStats = exports.checkRedisHealth = exports.gameStateRedis = exports.queueRedis = exports.pubsubRedis = exports.cacheRedis = exports.sessionRedis = exports.redisClients = exports.redisManager = void 0;
// =============================================================================
// REDIS CONFIGURATION AND CLIENTS
// =============================================================================
var redis_production_config_1 = require("./config/redis.production.config");
Object.defineProperty(exports, "redisManager", { enumerable: true, get: function () { return redis_production_config_1.productionRedisManager; } });
Object.defineProperty(exports, "redisClients", { enumerable: true, get: function () { return redis_production_config_1.productionRedisClients; } });
Object.defineProperty(exports, "sessionRedis", { enumerable: true, get: function () { return redis_production_config_1.sessionRedis; } });
Object.defineProperty(exports, "cacheRedis", { enumerable: true, get: function () { return redis_production_config_1.cacheRedis; } });
Object.defineProperty(exports, "pubsubRedis", { enumerable: true, get: function () { return redis_production_config_1.pubsubRedis; } });
Object.defineProperty(exports, "queueRedis", { enumerable: true, get: function () { return redis_production_config_1.queueRedis; } });
Object.defineProperty(exports, "gameStateRedis", { enumerable: true, get: function () { return redis_production_config_1.gameStateRedis; } });
Object.defineProperty(exports, "checkRedisHealth", { enumerable: true, get: function () { return redis_production_config_1.checkRedisHealth; } });
Object.defineProperty(exports, "getRedisStats", { enumerable: true, get: function () { return redis_production_config_1.getRedisStats; } });
Object.defineProperty(exports, "getRedisMetrics", { enumerable: true, get: function () { return redis_production_config_1.getRedisMetrics; } });
Object.defineProperty(exports, "getRedisAlerts", { enumerable: true, get: function () { return redis_production_config_1.getRedisAlerts; } });
Object.defineProperty(exports, "clearRedisAlerts", { enumerable: true, get: function () { return redis_production_config_1.clearRedisAlerts; } });
// =============================================================================
// SESSION MANAGEMENT
// =============================================================================
var sessionManager_1 = require("./session/sessionManager");
Object.defineProperty(exports, "createSession", { enumerable: true, get: function () { return sessionManager_1.createSession; } });
Object.defineProperty(exports, "getSession", { enumerable: true, get: function () { return sessionManager_1.getSession; } });
Object.defineProperty(exports, "updateSessionActivity", { enumerable: true, get: function () { return sessionManager_1.updateSessionActivity; } });
Object.defineProperty(exports, "terminateSession", { enumerable: true, get: function () { return sessionManager_1.terminateSession; } });
Object.defineProperty(exports, "isSessionValid", { enumerable: true, get: function () { return sessionManager_1.isSessionValid; } });
// =============================================================================
// CACHING STRATEGIES
// =============================================================================
var cachingStrategies_1 = require("./strategies/cachingStrategies");
Object.defineProperty(exports, "CACHE_KEYS", { enumerable: true, get: function () { return cachingStrategies_1.CACHE_KEYS; } });
Object.defineProperty(exports, "CACHE_TTL", { enumerable: true, get: function () { return cachingStrategies_1.CACHE_TTL; } });
Object.defineProperty(exports, "WriteThroughCache", { enumerable: true, get: function () { return cachingStrategies_1.WriteThroughCache; } });
Object.defineProperty(exports, "CacheAsideStrategy", { enumerable: true, get: function () { return cachingStrategies_1.CacheAsideStrategy; } });
Object.defineProperty(exports, "WriteBehindCache", { enumerable: true, get: function () { return cachingStrategies_1.WriteBehindCache; } });
Object.defineProperty(exports, "LeaderboardCache", { enumerable: true, get: function () { return cachingStrategies_1.LeaderboardCache; } });
Object.defineProperty(exports, "CacheInvalidation", { enumerable: true, get: function () { return cachingStrategies_1.CacheInvalidation; } });
// =============================================================================
// MESSAGE QUEUE SYSTEM
// =============================================================================
var queueManager_1 = require("./messageQueue/queueManager");
Object.defineProperty(exports, "JobType", { enumerable: true, get: function () { return queueManager_1.JobType; } });
Object.defineProperty(exports, "JobPriority", { enumerable: true, get: function () { return queueManager_1.JobPriority; } });
Object.defineProperty(exports, "QueueManager", { enumerable: true, get: function () { return queueManager_1.QueueManager; } });
Object.defineProperty(exports, "queueManager", { enumerable: true, get: function () { return queueManager_1.queueManager; } });
Object.defineProperty(exports, "addNotificationJob", { enumerable: true, get: function () { return queueManager_1.addNotificationJob; } });
Object.defineProperty(exports, "addLeaderboardUpdateJob", { enumerable: true, get: function () { return queueManager_1.addLeaderboardUpdateJob; } });
Object.defineProperty(exports, "addGameResultJob", { enumerable: true, get: function () { return queueManager_1.addGameResultJob; } });
// =============================================================================
// MIDDLEWARE
// =============================================================================
var redisMiddleware_1 = require("./middleware/redisMiddleware");
Object.defineProperty(exports, "validateSession", { enumerable: true, get: function () { return redisMiddleware_1.validateSession; } });
Object.defineProperty(exports, "cacheResponse", { enumerable: true, get: function () { return redisMiddleware_1.cacheResponse; } });
Object.defineProperty(exports, "rateLimit", { enumerable: true, get: function () { return redisMiddleware_1.rateLimit; } });
Object.defineProperty(exports, "trackOnlineUser", { enumerable: true, get: function () { return redisMiddleware_1.trackOnlineUser; } });
Object.defineProperty(exports, "attachUserProfile", { enumerable: true, get: function () { return redisMiddleware_1.attachUserProfile; } });
Object.defineProperty(exports, "authenticatedUser", { enumerable: true, get: function () { return redisMiddleware_1.authenticatedUser; } });
Object.defineProperty(exports, "cachedAuthenticatedRoute", { enumerable: true, get: function () { return redisMiddleware_1.cachedAuthenticatedRoute; } });
// =============================================================================
// REDIS UTILITIES AND HELPERS
// =============================================================================
// =============================================================================
// INTERNAL IMPORTS FOR UTILITY FUNCTIONS
// =============================================================================
const redis_production_config_2 = require("./config/redis.production.config");
// Import queue manager with error handling
let queueMgr;
try {
    const queueModule = require("./messageQueue/queueManager");
    queueMgr = queueModule.queueManager;
}
catch (error) {
    console.warn("⚠️ Queue manager not available:", error instanceof Error ? error.message : String(error));
    queueMgr = null;
}
// =============================================================================
// REDIS UTILITIES AND HELPERS
// =============================================================================
/**
 * Initialize Redis connections and start services
 */
const initializeRedis = async () => {
    try {
        console.log("🔄 Initializing Redis services...");
        // Check Redis health
        const isHealthy = await (0, redis_production_config_2.checkRedisHealth)();
        if (!isHealthy) {
            throw new Error("Redis health check failed");
        }
        // Start queue processing
        console.log("✅ Redis services initialized successfully");
    }
    catch (error) {
        console.error("❌ Failed to initialize Redis services:", error);
        throw error;
    }
};
exports.initializeRedis = initializeRedis;
/**
 * Gracefully shutdown Redis connections
 */
const shutdownRedis = async () => {
    try {
        console.log("🔄 Shutting down Redis services...");
        // Stop queue manager if available
        if (queueMgr && typeof queueMgr.shutdown === "function") {
            await queueMgr.shutdown();
        }
        else {
            console.log("⚠️ Queue manager not available for shutdown");
        }
        // Disconnect Redis clients
        await redis_production_config_2.productionRedisManager.disconnect();
        console.log("✅ Redis services shutdown complete");
    }
    catch (error) {
        console.error("❌ Error during Redis shutdown:", error);
        throw error;
    }
};
exports.shutdownRedis = shutdownRedis;
