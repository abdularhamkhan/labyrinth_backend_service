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

import { Request, Response, NextFunction } from "express";
import { sessionRedis, cacheRedis } from "../config/redis.production.config";
import { getSession, updateSessionActivity } from "../session/sessionManager";
import { CacheAsideStrategy } from "../strategies/cachingStrategies";

// =============================================================================
// EXTENDED REQUEST INTERFACE
// =============================================================================

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      sessionToken?: string;
      userProfile?: any;
    }
  }
}

// =============================================================================
// SESSION VALIDATION MIDDLEWARE
// =============================================================================

/**
 * Middleware to validate user session from Redis
 */
export const validateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    const session = await getSession(sessionToken);

    if (!session) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired session",
      });
      return;
    }

    // Update session activity
    await updateSessionActivity(sessionToken);

    // Add user info to request
    req.userId = session.userId;
    req.sessionToken = sessionToken;

    next();
  } catch (error) {
    console.error("❌ Session validation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during session validation",
    });
  }
};

// =============================================================================
// CACHING MIDDLEWARE
// =============================================================================

/**
 * Middleware to cache API responses
 */
export const cacheResponse = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Generate cache key based on request
      const cacheKey = `api_cache:${req.method}:${req.originalUrl}:${req.userId || "anonymous"}`;

      // Try to get cached response
      const cachedResponse = await cacheRedis.get(cacheKey);

      if (cachedResponse) {
        console.log(`🎯 Cache hit: ${cacheKey}`);
        const { statusCode, data } = JSON.parse(cachedResponse);
        res.status(statusCode).json(data);
        return;
      }

      // Store original json method
      const originalJson = res.json;

      // Override json method to cache response
      res.json = function (data: any) {
        // Cache the response
        const responseData = {
          statusCode: res.statusCode,
          data,
        };

        cacheRedis
          .setex(cacheKey, ttl, JSON.stringify(responseData))
          .catch((error) => console.error("❌ Cache set error:", error));

        console.log(`💾 Cached response: ${cacheKey}`);

        // Call original json method
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error("❌ Cache middleware error:", error);
      next(); // Continue without caching on error
    }
  };
};

// =============================================================================
// RATE LIMITING MIDDLEWARE
// =============================================================================

/**
 * Redis-based rate limiting middleware
 */
export const rateLimit = (options: {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: Request) => string; // Custom key generator
}) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { windowMs, maxRequests, keyGenerator } = options;

      // Generate rate limit key
      const key = keyGenerator
        ? keyGenerator(req)
        : `rate_limit:${req.ip}:${req.route?.path || req.path}`;

      const window = Math.floor(Date.now() / windowMs);
      const windowKey = `${key}:${window}`;

      // Get current request count
      const currentCount = await cacheRedis.incr(windowKey);

      // Set expiration on first request in window
      if (currentCount === 1) {
        await cacheRedis.expire(windowKey, Math.ceil(windowMs / 1000));
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
    } catch (error) {
      console.error("❌ Rate limit error:", error);
      next(); // Continue without rate limiting on error
    }
  };
};

// =============================================================================
// ONLINE USER TRACKING MIDDLEWARE
// =============================================================================

/**
 * Middleware to track online users
 */
export const trackOnlineUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.userId) {
      // Add user to online users set
      await cacheRedis.sadd("online_users", req.userId);

      // Set user activity with TTL (5 minutes)
      await cacheRedis.setex(`user_activity:${req.userId}`, 300, Date.now().toString());

      // Remove expired users from online set (cleanup)
      const onlineUsers = await cacheRedis.smembers("online_users");
      const pipeline = cacheRedis.pipeline();

      for (const userId of onlineUsers) {
        const activity = await cacheRedis.get(`user_activity:${userId}`);
        if (!activity) {
          pipeline.srem("online_users", userId);
        }
      }

      await pipeline.exec();
    }

    next();
  } catch (error) {
    console.error("❌ Online tracking error:", error);
    next(); // Continue without tracking on error
  }
};

// =============================================================================
// USER PROFILE CACHING MIDDLEWARE
// =============================================================================

/**
 * Middleware to attach cached user profile to request
 */
export const attachUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.userId) {
      // Get user profile from cache or database
      const userProfile = await CacheAsideStrategy.getUserProfile(req.userId);
      req.userProfile = userProfile;
    }

    next();
  } catch (error) {
    console.error("❌ User profile attachment error:", error);
    next(); // Continue without profile on error
  }
};

// =============================================================================
// COMPOSITE MIDDLEWARE FUNCTIONS
// =============================================================================

/**
 * Authenticated user middleware (combines session validation and profile attachment)
 */
export const authenticatedUser = [validateSession, trackOnlineUser, attachUserProfile];

/**
 * API caching with authentication
 */
export const cachedAuthenticatedRoute = (ttl: number = 300) => [
  validateSession,
  cacheResponse(ttl),
];
