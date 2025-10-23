/**
 * =============================================================================
 * ACCOUNT SECURITY SYSTEM - LOCKOUTS & RATE LIMITING
 * =============================================================================
 *
 * This module provides comprehensive account security features:
 * - Intelligent account lockout with exponential backoff
 * - Rate limiting for authentication attempts
 * - Suspicious activity detection
 * - IP-based and account-based tracking
 * - Redis-backed for scalability and persistence
 *
 * Security Features:
 * - Progressive lockout durations (1min → 5min → 15min → 1hr → 24hr)
 * - IP-based rate limiting to prevent distributed attacks
 * - Account-specific attempt tracking
 * - Automatic lockout expiry and cleanup
 * - Audit trail integration
 *
 * =============================================================================
 */

import { Redis } from "ioredis";
import { Request, Response, NextFunction } from "express";
import { SecurityAudit } from "./audit";
import { cacheRedis } from "../redis/config/redis.production.config";

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export interface AccountLockoutInfo {
  userId: string;
  email?: string;
  attemptCount: number;
  firstAttemptAt: string;
  lastAttemptAt: string;
  lockoutExpiresAt?: string;
  lockoutLevel: number;
  ipAddresses: string[];
}

export interface RateLimitInfo {
  key: string;
  attempts: number;
  windowStart: string;
  expiresAt: string;
}

export enum LockoutReason {
  MULTIPLE_FAILED_LOGINS = "MULTIPLE_FAILED_LOGINS",
  MULTIPLE_FAILED_OTP = "MULTIPLE_FAILED_OTP",
  SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
  BRUTE_FORCE_DETECTED = "BRUTE_FORCE_DETECTED",
  MANUAL_LOCK = "MANUAL_LOCK",
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const LOCKOUT_CONFIG = {
  // Maximum failed attempts before lockout - RELAXED BY 10X
  maxAttempts: {
    login: 50,
    otp: 30,
    passwordReset: 30,
  },

  // Lockout durations in minutes (progressive)
  lockoutDurations: [1, 5, 15, 60, 1440], // 1min, 5min, 15min, 1hr, 24hr

  // Time window for attempt counting (minutes)
  attemptWindow: 15,

  // Rate limit windows - INCREASED BY 10X
  rateLimits: {
    loginPerIP: { attempts: 100, windowMinutes: 5 },
    otpPerIP: { attempts: 50, windowMinutes: 10 },
    passwordResetPerIP: { attempts: 30, windowMinutes: 60 },
    signupPerIP: { attempts: 30, windowMinutes: 60 },
  },
};

// Redis key prefixes
const REDIS_KEYS = {
  accountLockout: (userId: string) => `security:lockout:account:${userId}`,
  ipRateLimit: (ip: string, action: string) => `security:ratelimit:ip:${ip}:${action}`,
  accountAttempts: (userId: string, action: string) => `security:attempts:${userId}:${action}`,
  suspiciousIPs: (ip: string) => `security:suspicious:ip:${ip}`,
};

// =============================================================================
// CORE ACCOUNT SECURITY CLASS
// =============================================================================

export class AccountSecurity {
  public redis: Redis; // Make public for OTP cooldown access

  constructor() {
    this.redis = cacheRedis as Redis;
  }

  // =============================================================================
  // ACCOUNT LOCKOUT MANAGEMENT
  // =============================================================================

  /**
   * Check if an account is currently locked
   */
  async isAccountLocked(userId: string): Promise<{
    isLocked: boolean;
    lockoutInfo?: AccountLockoutInfo;
    remainingTime?: number;
  }> {
    try {
      const lockoutKey = REDIS_KEYS.accountLockout(userId);
      const lockoutData = await this.redis.get(lockoutKey);

      if (!lockoutData) {
        return { isLocked: false };
      }

      const lockoutInfo: AccountLockoutInfo = JSON.parse(lockoutData);

      // Check if lockout has expired
      if (lockoutInfo.lockoutExpiresAt) {
        const expiryTime = new Date(lockoutInfo.lockoutExpiresAt).getTime();
        const now = Date.now();

        if (now >= expiryTime) {
          // Lockout expired, remove it
          await this.redis.del(lockoutKey);
          return { isLocked: false };
        }

        const remainingTime = Math.ceil((expiryTime - now) / 1000); // seconds
        return {
          isLocked: true,
          lockoutInfo,
          remainingTime,
        };
      }

      return { isLocked: false };
    } catch (error) {
      console.error("Error checking account lockout:", error);
      // Fail open for availability
      return { isLocked: false };
    }
  }

  /**
   * Record a failed authentication attempt
   */
  async recordFailedAttempt(
    req: Request,
    userId: string,
    email: string,
    attemptType: "login" | "otp" | "passwordReset" = "login"
  ): Promise<{
    shouldLock: boolean;
    attemptCount: number;
    lockoutDuration?: number;
  }> {
    const ipAddress = req.ip || req.connection?.remoteAddress || "unknown";
    const lockoutKey = REDIS_KEYS.accountLockout(userId);

    try {
      // Get current lockout info
      const currentData = await this.redis.get(lockoutKey);
      let lockoutInfo: AccountLockoutInfo;

      if (currentData) {
        lockoutInfo = JSON.parse(currentData);
        lockoutInfo.attemptCount += 1;
        lockoutInfo.lastAttemptAt = new Date().toISOString();
        if (!lockoutInfo.ipAddresses.includes(ipAddress)) {
          lockoutInfo.ipAddresses.push(ipAddress);
        }
      } else {
        lockoutInfo = {
          userId,
          email,
          attemptCount: 1,
          firstAttemptAt: new Date().toISOString(),
          lastAttemptAt: new Date().toISOString(),
          lockoutLevel: 0,
          ipAddresses: [ipAddress],
        };
      }

      const maxAttempts = LOCKOUT_CONFIG.maxAttempts[attemptType];

      if (lockoutInfo.attemptCount >= maxAttempts) {
        // Calculate lockout duration based on previous lockout level
        const lockoutLevel = Math.min(
          lockoutInfo.lockoutLevel,
          LOCKOUT_CONFIG.lockoutDurations.length - 1
        );
        const lockoutMinutes = LOCKOUT_CONFIG.lockoutDurations[lockoutLevel];
        const lockoutExpiresAt = new Date(Date.now() + lockoutMinutes * 60 * 1000);

        lockoutInfo.lockoutExpiresAt = lockoutExpiresAt.toISOString();
        lockoutInfo.lockoutLevel += 1;

        // Store lockout info
        await this.redis.setex(lockoutKey, lockoutMinutes * 60, JSON.stringify(lockoutInfo));

        // Log security event
        SecurityAudit.accountLocked(req, userId, lockoutInfo.attemptCount, lockoutMinutes);

        return {
          shouldLock: true,
          attemptCount: lockoutInfo.attemptCount,
          lockoutDuration: lockoutMinutes,
        };
      } else {
        // Store updated attempt count
        const ttl = LOCKOUT_CONFIG.attemptWindow * 60; // seconds
        await this.redis.setex(lockoutKey, ttl, JSON.stringify(lockoutInfo));

        return {
          shouldLock: false,
          attemptCount: lockoutInfo.attemptCount,
        };
      }
    } catch (error) {
      console.error("Error recording failed attempt:", error);
      return { shouldLock: false, attemptCount: 0 };
    }
  }

  /**
   * Clear account lockout (successful login)
   */
  async clearAccountLockout(userId: string): Promise<void> {
    try {
      const lockoutKey = REDIS_KEYS.accountLockout(userId);
      await this.redis.del(lockoutKey);
    } catch (error) {
      console.error("Error clearing account lockout:", error);
    }
  }

  // =============================================================================
  // IP-BASED RATE LIMITING
  // =============================================================================

  /**
   * Check if IP is rate limited for specific action
   */
  async checkRateLimit(
    req: Request,
    action: "login" | "otp" | "passwordReset" | "signup"
  ): Promise<{
    isLimited: boolean;
    attempts: number;
    limit: number;
    resetTime?: number;
  }> {
    const ipAddress = req.ip || req.connection?.remoteAddress || "unknown";
    const rateLimitKey = REDIS_KEYS.ipRateLimit(ipAddress, action);

    try {
      const config =
        LOCKOUT_CONFIG.rateLimits[`${action}PerIP` as keyof typeof LOCKOUT_CONFIG.rateLimits];
      const windowSeconds = config.windowMinutes * 60;

      const current = await this.redis.get(rateLimitKey);

      if (!current) {
        // First attempt in this window
        await this.redis.setex(rateLimitKey, windowSeconds, "1");
        return {
          isLimited: false,
          attempts: 1,
          limit: config.attempts,
        };
      }

      const attempts = parseInt(current);

      if (attempts >= config.attempts) {
        const ttl = await this.redis.ttl(rateLimitKey);
        SecurityAudit.rateLimitExceeded(req, action, config.attempts);

        return {
          isLimited: true,
          attempts,
          limit: config.attempts,
          resetTime: ttl > 0 ? ttl : 0,
        };
      }

      // Increment attempts
      await this.redis.incr(rateLimitKey);

      return {
        isLimited: false,
        attempts: attempts + 1,
        limit: config.attempts,
      };
    } catch (error) {
      console.error("Error checking rate limit:", error);
      // Fail open for availability
      return { isLimited: false, attempts: 0, limit: 1000 };
    }
  }

  // =============================================================================
  // SUSPICIOUS ACTIVITY DETECTION
  // =============================================================================

  /**
   * Detect and flag suspicious activity patterns
   */
  async detectSuspiciousActivity(
    req: Request,
    userId?: string
  ): Promise<{
    isSuspicious: boolean;
    reasons: string[];
    riskScore: number;
  }> {
    const ipAddress = req.ip || req.connection?.remoteAddress || "unknown";
    const userAgent = req.get("user-agent") || "";

    const suspiciousIndicators: { reason: string; score: number }[] = [];

    try {
      // Check 1: Multiple failed attempts from same IP
      const loginAttempts = await this.redis.get(REDIS_KEYS.ipRateLimit(ipAddress, "login"));
      if (loginAttempts && parseInt(loginAttempts) >= 8) {
        suspiciousIndicators.push({ reason: "High login failure rate from IP", score: 30 });
      }

      // Check 2: Suspicious user agent patterns
      const suspiciousUserAgents = ["bot", "crawler", "scraper", "automated"];
      if (suspiciousUserAgents.some((pattern) => userAgent.toLowerCase().includes(pattern))) {
        suspiciousIndicators.push({ reason: "Suspicious user agent pattern", score: 25 });
      }

      // Check 3: Multiple account attempts from same IP
      if (userId) {
        const recentIpActivity = await this.checkIpAccountAttempts(ipAddress);
        if (recentIpActivity > 5) {
          suspiciousIndicators.push({
            reason: "Multiple accounts accessed from same IP",
            score: 35,
          });
        }
      }

      // Check 4: Rapid-fire requests (basic check)
      const requestKey = `security:requests:${ipAddress}:${Math.floor(Date.now() / 1000)}`;
      const currentRequests = await this.redis.incr(requestKey);
      await this.redis.expire(requestKey, 1);

      if (currentRequests > 5) {
        suspiciousIndicators.push({ reason: "Rapid request pattern detected", score: 20 });
      }

      const totalRiskScore = suspiciousIndicators.reduce(
        (sum, indicator) => sum + indicator.score,
        0
      );
      const isSuspicious = totalRiskScore >= 50;

      if (isSuspicious) {
        SecurityAudit.suspiciousActivity(req, "Automated suspicious activity detection", {
          riskScore: totalRiskScore,
          indicators: suspiciousIndicators.map((i) => i.reason),
          userId,
        });

        // Flag IP as suspicious
        await this.redis.setex(
          REDIS_KEYS.suspiciousIPs(ipAddress),
          24 * 60 * 60,
          totalRiskScore.toString()
        );
      }

      return {
        isSuspicious,
        reasons: suspiciousIndicators.map((i) => i.reason),
        riskScore: totalRiskScore,
      };
    } catch (error) {
      console.error("Error detecting suspicious activity:", error);
      return { isSuspicious: false, reasons: [], riskScore: 0 };
    }
  }

  /**
   * Check how many different accounts an IP has attempted to access
   */
  private async checkIpAccountAttempts(ipAddress: string): Promise<number> {
    try {
      const key = `security:ip_accounts:${ipAddress}`;
      const accountCount = await this.redis.scard(key);
      return accountCount;
    } catch (error) {
      console.error("Error checking IP account attempts:", error);
      return 0;
    }
  }

  /**
   * Track IP to account mapping for suspicious activity detection
   */
  async trackIpAccountAccess(req: Request, userId: string): Promise<void> {
    const ipAddress = req.ip || req.connection?.remoteAddress || "unknown";

    try {
      const key = `security:ip_accounts:${ipAddress}`;
      await this.redis.sadd(key, userId);
      await this.redis.expire(key, 24 * 60 * 60); // 24 hours
    } catch (error) {
      console.error("Error tracking IP account access:", error);
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /**
   * Get comprehensive security status for an account
   */
  async getAccountSecurityStatus(userId: string): Promise<{
    lockoutInfo?: AccountLockoutInfo;
    recentAttempts: number;
    riskLevel: "low" | "medium" | "high";
  }> {
    try {
      const lockoutCheck = await this.isAccountLocked(userId);
      const lockoutKey = REDIS_KEYS.accountLockout(userId);
      const lockoutData = await this.redis.get(lockoutKey);

      let recentAttempts = 0;
      let riskLevel: "low" | "medium" | "high" = "low";

      if (lockoutData) {
        const lockoutInfo: AccountLockoutInfo = JSON.parse(lockoutData);
        recentAttempts = lockoutInfo.attemptCount;

        if (lockoutInfo.attemptCount >= 10) {
          riskLevel = "high";
        } else if (lockoutInfo.attemptCount >= 3) {
          riskLevel = "medium";
        }
      }

      return {
        lockoutInfo: lockoutCheck.lockoutInfo,
        recentAttempts,
        riskLevel,
      };
    } catch (error) {
      console.error("Error getting account security status:", error);
      return { recentAttempts: 0, riskLevel: "low" };
    }
  }

  /**
   * Manual account lockout (admin function)
   */
  async lockAccount(
    userId: string,
    reason: LockoutReason,
    durationMinutes: number,
    adminUserId?: string
  ): Promise<void> {
    try {
      const lockoutKey = REDIS_KEYS.accountLockout(userId);
      const lockoutExpiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

      const lockoutInfo: AccountLockoutInfo = {
        userId,
        attemptCount: 999, // Indicates manual lock
        firstAttemptAt: new Date().toISOString(),
        lastAttemptAt: new Date().toISOString(),
        lockoutExpiresAt: lockoutExpiresAt.toISOString(),
        lockoutLevel: 99, // Max level for manual locks
        ipAddresses: ["manual"],
      };

      await this.redis.setex(lockoutKey, durationMinutes * 60, JSON.stringify(lockoutInfo));

      console.log(`Account ${userId} manually locked by ${adminUserId || "system"} for ${reason}`);
    } catch (error) {
      console.error("Error manually locking account:", error);
    }
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

export const accountSecurity = new AccountSecurity();

// =============================================================================
// MIDDLEWARE HELPERS
// =============================================================================

/**
 * Express middleware to check account lockout
 */
export function checkAccountLockoutMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req.body.userId || req.body.emailOrUsername || req.body.email) as string;

      if (!userId) {
        return next();
      }

      const lockoutCheck = await accountSecurity.isAccountLocked(userId);

      if (lockoutCheck.isLocked) {
        return res.status(423).json({
          success: false,
          error: {
            message: `Account is temporarily locked. Try again in ${Math.ceil((lockoutCheck.remainingTime || 0) / 60)} minutes.`,
            code: "ACCOUNT_LOCKED",
            status: 423,
            timestamp: new Date().toISOString(),
            remainingTime: lockoutCheck.remainingTime,
          },
        });
      }

      next();
    } catch (error) {
      console.error("Error in account lockout middleware:", error);
      next(); // Fail open
    }
  };
}

/**
 * Express middleware to check rate limits
 */
export function rateLimitMiddleware(action: "login" | "otp" | "passwordReset" | "signup") {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rateLimitCheck = await accountSecurity.checkRateLimit(req, action);

      if (rateLimitCheck.isLimited) {
        return res.status(429).json({
          success: false,
          error: {
            message: `Too many ${action} attempts. Try again in ${Math.ceil((rateLimitCheck.resetTime || 0) / 60)} minutes.`,
            code: "RATE_LIMIT_EXCEEDED",
            status: 429,
            timestamp: new Date().toISOString(),
            resetTime: rateLimitCheck.resetTime,
            limit: rateLimitCheck.limit,
          },
        });
      }

      next();
    } catch (error) {
      console.error("Error in rate limit middleware:", error);
      next(); // Fail open
    }
  };
}
