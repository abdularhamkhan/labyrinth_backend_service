"use strict";
/**
 * =============================================================================
 * REDIS MIDDLEWARE - Express Integration
 * =============================================================================
 *
 * This module provides Express middleware for Redis integration, including
 * session management, caching, and real-time features.
 *
 * Features:
 * - Session validation middleware
 * - Caching middleware for API responses
 * - Rate limiting using Redis
 * - Online user tracking
 *
 * =============================================================================
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cachedAuthenticatedRoute = exports.authenticatedUser = exports.attachUserProfile = exports.trackOnlineUser = exports.rateLimit = exports.cacheResponse = exports.validateSession = void 0;
const redis_production_config_1 = require("../config/redis.production.config");
const sessionManager_1 = require("../session/sessionManager");
const cachingStrategies_1 = require("../strategies/cachingStrategies");
// =============================================================================
// SESSION VALIDATION MIDDLEWARE
// =============================================================================
/**
 * Middleware to validate user session from Redis
 */
const validateSession = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Missing or invalid authorization header",
            });
            return;
        }
        const sessionToken = authHeader.substring(7); // Remove 'Bearer ' prefix
        // Check session in Redis
        const session = await (0, sessionManager_1.getSession)(sessionToken);
        if (!session) {
            res.status(401).json({
                success: false,
                message: "Invalid or expired session",
            });
            return;
        }
        // Update session activity
        await (0, sessionManager_1.updateSessionActivity)(sessionToken);
        // Add user info to request
        req.userId = session.userId;
        req.sessionToken = sessionToken;
        next();
    }
    catch (error) {
        console.error("❌ Session validation error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during session validation",
        });
    }
};
exports.validateSession = validateSession;
// =============================================================================
// CACHING MIDDLEWARE
// =============================================================================
/**
 * Middleware to cache API responses
 */
const cacheResponse = (ttl = 300) => {
    return async (req, res, next) => {
        try {
            // Generate cache key based on request
            const cacheKey = `api_cache:${req.method}:${req.originalUrl}:${req.userId || "anonymous"}`;
            // Try to get cached response
            const cachedResponse = await redis_production_config_1.cacheRedis.get(cacheKey);
            if (cachedResponse) {
                console.log(`🎯 Cache hit: ${cacheKey}`);
                const { statusCode, data } = JSON.parse(cachedResponse);
                res.status(statusCode).json(data);
                return;
            }
            // Store original json method
            const originalJson = res.json;
            // Override json method to cache response
            res.json = function (data) {
                // Cache the response
                const responseData = {
                    statusCode: res.statusCode,
                    data,
                };
                redis_production_config_1.cacheRedis
                    .setex(cacheKey, ttl, JSON.stringify(responseData))
                    .catch((error) => console.error("❌ Cache set error:", error));
                console.log(`💾 Cached response: ${cacheKey}`);
                // Call original json method
                return originalJson.call(this, data);
            };
            next();
        }
        catch (error) {
            console.error("❌ Cache middleware error:", error);
            next(); // Continue without caching on error
        }
    };
};
exports.cacheResponse = cacheResponse;
// =============================================================================
// RATE LIMITING MIDDLEWARE
// =============================================================================
/**
 * Redis-based rate limiting middleware
 */
const rateLimit = (options) => {
    return async (req, res, next) => {
        try {
            const { windowMs, maxRequests, keyGenerator } = options;
            // Generate rate limit key
            const key = keyGenerator
                ? keyGenerator(req)
                : `rate_limit:${req.ip}:${req.route?.path || req.path}`;
            const window = Math.floor(Date.now() / windowMs);
            const windowKey = `${key}:${window}`;
            // Get current request count
            const currentCount = await redis_production_config_1.cacheRedis.incr(windowKey);
            // Set expiration on first request in window
            if (currentCount === 1) {
                await redis_production_config_1.cacheRedis.expire(windowKey, Math.ceil(windowMs / 1000));
            }
            // Check if rate limit exceeded
            if (currentCount > maxRequests) {
                res.status(429).json({
                    success: false,
                    message: "Rate limit exceeded",
                    retryAfter: Math.ceil(windowMs / 1000),
                });
                return;
            }
            // Add rate limit headers
            res.setHeader("X-RateLimit-Limit", maxRequests);
            res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - currentCount));
            res.setHeader("X-RateLimit-Reset", window + 1);
            next();
        }
        catch (error) {
            console.error("❌ Rate limit error:", error);
            next(); // Continue without rate limiting on error
        }
    };
};
exports.rateLimit = rateLimit;
// =============================================================================
// ONLINE USER TRACKING MIDDLEWARE
// =============================================================================
/**
 * Middleware to track online users
 */
const trackOnlineUser = async (req, res, next) => {
    try {
        if (req.userId) {
            // Add user to online users set
            await redis_production_config_1.cacheRedis.sadd("online_users", req.userId);
            // Set user activity with TTL (5 minutes)
            await redis_production_config_1.cacheRedis.setex(`user_activity:${req.userId}`, 300, Date.now().toString());
            // Remove expired users from online set (cleanup)
            const onlineUsers = await redis_production_config_1.cacheRedis.smembers("online_users");
            const pipeline = redis_production_config_1.cacheRedis.pipeline();
            for (const userId of onlineUsers) {
                const activity = await redis_production_config_1.cacheRedis.get(`user_activity:${userId}`);
                if (!activity) {
                    pipeline.srem("online_users", userId);
                }
            }
            await pipeline.exec();
        }
        next();
    }
    catch (error) {
        console.error("❌ Online tracking error:", error);
        next(); // Continue without tracking on error
    }
};
exports.trackOnlineUser = trackOnlineUser;
// =============================================================================
// USER PROFILE CACHING MIDDLEWARE
// =============================================================================
/**
 * Middleware to attach cached user profile to request
 */
const attachUserProfile = async (req, res, next) => {
    try {
        if (req.userId) {
            // Get user profile from cache or database
            const userProfile = await cachingStrategies_1.CacheAsideStrategy.getUserProfile(req.userId);
            req.userProfile = userProfile;
        }
        next();
    }
    catch (error) {
        console.error("❌ User profile attachment error:", error);
        next(); // Continue without profile on error
    }
};
exports.attachUserProfile = attachUserProfile;
// =============================================================================
// COMPOSITE MIDDLEWARE FUNCTIONS
// =============================================================================
/**
 * Authenticated user middleware (combines session validation and profile attachment)
 */
exports.authenticatedUser = [exports.validateSession, exports.trackOnlineUser, exports.attachUserProfile];
/**
 * API caching with authentication
 */
const cachedAuthenticatedRoute = (ttl = 300) => [
    exports.validateSession,
    (0, exports.cacheResponse)(ttl),
];
exports.cachedAuthenticatedRoute = cachedAuthenticatedRoute;
