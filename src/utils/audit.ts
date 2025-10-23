/**
 * =============================================================================
 * COMPREHENSIVE AUDIT LOGGING SYSTEM
 * =============================================================================
 *
 * This module provides enterprise-grade audit logging for ALL application events:
 * - Authentication & Authorization
 * - Game Events & Sessions
 * - User Management & Profile Changes
 * - Friend Requests & Social Features
 * - Leaderboard & Scoring
 * - Database Operations
 * - Security Events & Rate Limiting
 * - WebSocket Connections & Real-time Events
 *
 * Security Features:
 * - Structured logging with data sanitization
 * - PII anonymization and hashing
 * - Request correlation tracking
 * - Performance metrics integration
 * - External logging service ready
 *
 * =============================================================================
 */

import { Request } from "express";
import crypto from "crypto";

export enum AuditCategory {
  AUTH = "AUTH",
  USER = "USER",
  GAME = "GAME",
  SOCIAL = "SOCIAL",
  SECURITY = "SECURITY",
  DATABASE = "DATABASE",
  WEBSOCKET = "WEBSOCKET",
  SYSTEM = "SYSTEM",
  API = "API",
}

export enum AuditEventType {
  // Authentication Events
  LOGIN_SUCCESS = "AUTH.LOGIN.SUCCESS",
  LOGIN_FAILURE = "AUTH.LOGIN.FAILURE",
  LOGIN_BLOCKED = "AUTH.LOGIN.BLOCKED",
  SIGNUP_SUCCESS = "AUTH.SIGNUP.SUCCESS",
  SIGNUP_FAILURE = "AUTH.SIGNUP.FAILURE",
  SIGNUP_DUPLICATE = "AUTH.SIGNUP.DUPLICATE",
  OTP_SENT = "AUTH.OTP.SENT",
  OTP_VERIFY_SUCCESS = "AUTH.OTP.VERIFY.SUCCESS",
  OTP_VERIFY_FAILURE = "AUTH.OTP.VERIFY.FAILURE",
  PASSWORD_RESET_REQUEST = "AUTH.PASSWORD.RESET.REQUEST",
  PASSWORD_RESET_SUCCESS = "AUTH.PASSWORD.RESET.SUCCESS",
  FORGOT_USERNAME_REQUEST = "AUTH.FORGOT_USERNAME.REQUEST",

  // User Management Events
  PROFILE_UPDATE_SUCCESS = "USER.PROFILE.UPDATE.SUCCESS",
  PROFILE_UPDATE_FAILURE = "USER.PROFILE.UPDATE.FAILURE",
  AVATAR_UPLOAD_SUCCESS = "USER.AVATAR.UPLOAD.SUCCESS",
  AVATAR_UPLOAD_FAILURE = "USER.AVATAR.UPLOAD.FAILURE",
  ACCOUNT_STATUS_CHANGE = "USER.ACCOUNT.STATUS.CHANGE",
  USER_DELETION = "USER.DELETION",

  // Game Events
  GAME_SESSION_CREATED = "GAME.SESSION.CREATED",
  GAME_SESSION_JOINED = "GAME.SESSION.JOINED",
  GAME_SESSION_LEFT = "GAME.SESSION.LEFT",
  GAME_SESSION_STARTED = "GAME.SESSION.STARTED",
  GAME_SESSION_COMPLETED = "GAME.SESSION.COMPLETED",
  GAME_ROUND_COMPLETED = "GAME.ROUND.COMPLETED",
  GAME_SCORE_RECORDED = "GAME.SCORE.RECORDED",
  DAILY_CHALLENGE_COMPLETED = "GAME.DAILY_CHALLENGE.COMPLETED",
  PUZZLE_GENERATED = "GAME.PUZZLE.GENERATED",

  // Social Events
  FRIEND_REQUEST_SENT = "SOCIAL.FRIEND_REQUEST.SENT",
  FRIEND_REQUEST_ACCEPTED = "SOCIAL.FRIEND_REQUEST.ACCEPTED",
  FRIEND_REQUEST_REJECTED = "SOCIAL.FRIEND_REQUEST.REJECTED",
  FRIENDSHIP_REMOVED = "SOCIAL.FRIENDSHIP.REMOVED",
  USER_BLOCKED = "SOCIAL.USER.BLOCKED",
  USER_UNBLOCKED = "SOCIAL.USER.UNBLOCKED",
  USER_SEARCH = "SOCIAL.USER.SEARCH",

  // Leaderboard Events
  LEADERBOARD_UPDATED = "LEADERBOARD.UPDATED",
  LEADERBOARD_QUERIED = "LEADERBOARD.QUERIED",
  USER_RANK_CHANGED = "LEADERBOARD.RANK.CHANGED",

  // Security Events
  ACCOUNT_LOCKED = "SECURITY.ACCOUNT.LOCKED",
  SUSPICIOUS_ACTIVITY = "SECURITY.SUSPICIOUS.ACTIVITY",
  RATE_LIMIT_EXCEEDED = "SECURITY.RATE_LIMIT.EXCEEDED",
  TOKEN_MANIPULATION = "SECURITY.TOKEN.MANIPULATION",
  UNAUTHORIZED_ACCESS_ATTEMPT = "SECURITY.UNAUTHORIZED.ACCESS",

  // WebSocket Events
  WS_CONNECTION_ESTABLISHED = "WEBSOCKET.CONNECTION.ESTABLISHED",
  WS_CONNECTION_CLOSED = "WEBSOCKET.CONNECTION.CLOSED",
  WS_MESSAGE_SENT = "WEBSOCKET.MESSAGE.SENT",
  WS_MESSAGE_RECEIVED = "WEBSOCKET.MESSAGE.RECEIVED",
  WS_ROOM_JOINED = "WEBSOCKET.ROOM.JOINED",
  WS_ROOM_LEFT = "WEBSOCKET.ROOM.LEFT",

  // Database Events
  DB_QUERY_SLOW = "DATABASE.QUERY.SLOW",
  DB_CONNECTION_ERROR = "DATABASE.CONNECTION.ERROR",
  DB_TRANSACTION_FAILED = "DATABASE.TRANSACTION.FAILED",
  DB_MIGRATION_COMPLETED = "DATABASE.MIGRATION.COMPLETED",

  // System Events
  SERVER_STARTUP = "SYSTEM.SERVER.STARTUP",
  SERVER_SHUTDOWN = "SYSTEM.SERVER.SHUTDOWN",
  HEALTH_CHECK_FAILED = "SYSTEM.HEALTH_CHECK.FAILED",
  REDIS_CONNECTION_ERROR = "SYSTEM.REDIS.CONNECTION.ERROR",
  EXTERNAL_API_ERROR = "SYSTEM.EXTERNAL_API.ERROR",
}

export enum AuditSeverity {
  DEBUG = "debug",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export interface AuditEvent {
  category: AuditCategory;
  eventType: AuditEventType;
  severity: AuditSeverity;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  gameSessionId?: string;
  ipAddress: string;
  userAgent?: string;
  requestId?: string;
  correlationId?: string;
  details?: Record<string, any>;
  metadata?: {
    duration?: number;
    errorCode?: string;
    stackTrace?: string;
    performanceMetrics?: Record<string, number>;
  };
}

/**
 * Sanitize and anonymize sensitive data for logging
 */
function sanitizeForLogging(data: any): any {
  if (typeof data !== "object" || data === null) {
    return data;
  }

  const sanitized = { ...data };

  // Remove sensitive fields entirely
  const sensitiveFields = [
    "password",
    "token",
    "otp",
    "secret",
    "key",
    "apiKey",
    "resetToken",
    "sessionToken",
    "accessToken",
    "refreshToken",
    "privateKey",
    "credential",
    "authorization",
  ];

  sensitiveFields.forEach((field) => {
    if (field in sanitized) {
      delete sanitized[field];
    }
  });

  // Hash PII fields
  const piiFields = ["email", "phone", "firstName", "lastName"];
  piiFields.forEach((field) => {
    if (sanitized[field]) {
      sanitized[`${field}Hash`] = hashForLogging(sanitized[field]);
      delete sanitized[field];
    }
  });

  return sanitized;
}

/**
 * Hash sensitive data for logging (one-way hash for privacy)
 */
function hashForLogging(data: string): string {
  return crypto
    .createHash("sha256")
    .update(data + process.env.AUDIT_SALT || "default_salt")
    .digest("hex")
    .substring(0, 16);
}

/**
 * Extract request metadata for audit logging
 */
function extractRequestMetadata(req?: Request): {
  ipAddress: string;
  userAgent?: string;
  requestId?: string;
  userId?: string;
} {
  if (!req) {
    return { ipAddress: "system" };
  }

  return {
    ipAddress: req.ip || req.connection?.remoteAddress || "unknown",
    userAgent: req.get("user-agent"),
    requestId: (req as any).requestId,
    userId: (req as any).user?.id,
  };
}

/**
 * Core audit logging function
 */
export function logAuditEvent(event: AuditEvent): void {
  const auditLog = {
    ...event,
    details: sanitizeForLogging(event.details),
    timestamp: event.timestamp || new Date().toISOString(),
  };

  // In development, log to console with formatting
  if (process.env.NODE_ENV === "development") {
    const severity = event.severity.toUpperCase();
    const emoji = getEmojiForSeverity(event.severity);
    console.log(
      `${emoji} [AUDIT:${event.category}] ${event.eventType}:`,
      JSON.stringify(auditLog, null, 2)
    );
  } else {
    // In production, log structured JSON
    console.log(JSON.stringify({ type: "AUDIT", ...auditLog }));
  }

  // TODO: Send to external logging service
  // await sendToExternalLogging(auditLog);
}

function getEmojiForSeverity(severity: AuditSeverity): string {
  switch (severity) {
    case AuditSeverity.CRITICAL:
      return "🚨";
    case AuditSeverity.ERROR:
      return "❌";
    case AuditSeverity.WARNING:
      return "⚠️";
    case AuditSeverity.INFO:
      return "📝";
    case AuditSeverity.DEBUG:
      return "🔍";
    default:
      return "📋";
  }
}

// =============================================================================
// SPECIALIZED LOGGING FUNCTIONS FOR EACH CATEGORY
// =============================================================================

/**
 * Authentication Event Loggers
 */
export class AuthAudit {
  static loginSuccess(req: Request, userId: string): void {
    logAuditEvent({
      category: AuditCategory.AUTH,
      eventType: AuditEventType.LOGIN_SUCCESS,
      severity: AuditSeverity.INFO,
      timestamp: new Date().toISOString(),
      userId,
      ...extractRequestMetadata(req),
    });
  }

  static loginFailure(
    req: Request,
    identifier: string,
    reason: string,
    attemptCount?: number
  ): void {
    logAuditEvent({
      category: AuditCategory.AUTH,
      eventType: AuditEventType.LOGIN_FAILURE,
      severity: AuditSeverity.WARNING,
      timestamp: new Date().toISOString(),
      ...extractRequestMetadata(req),
      details: {
        identifierHash: hashForLogging(identifier),
        reason,
        attemptCount,
      },
    });
  }

  static signupSuccess(req: Request, userId: string, email: string): void {
    logAuditEvent({
      category: AuditCategory.AUTH,
      eventType: AuditEventType.SIGNUP_SUCCESS,
      severity: AuditSeverity.INFO,
      timestamp: new Date().toISOString(),
      userId,
      ...extractRequestMetadata(req),
      details: { email },
    });
  }

  static otpEvent(eventType: AuditEventType, req: Request, email: string, success: boolean): void {
    logAuditEvent({
      category: AuditCategory.AUTH,
      eventType,
      severity: success ? AuditSeverity.INFO : AuditSeverity.WARNING,
      timestamp: new Date().toISOString(),
      ...extractRequestMetadata(req),
      details: { email, success },
    });
  }

  static passwordResetEvent(eventType: AuditEventType, req: Request, email: string): void {
    logAuditEvent({
      category: AuditCategory.AUTH,
      eventType,
      severity: AuditSeverity.INFO,
      timestamp: new Date().toISOString(),
      ...extractRequestMetadata(req),
      details: { email },
    });
  }
}

/**
 * Game Event Loggers
 */
export class GameAudit {
  static sessionCreated(
    req: Request,
    gameSessionId: string,
    gameType: string,
    userId: string
  ): void {
    logAuditEvent({
      category: AuditCategory.GAME,
      eventType: AuditEventType.GAME_SESSION_CREATED,
      severity: AuditSeverity.INFO,
      timestamp: new Date().toISOString(),
      userId,
      gameSessionId,
      ...extractRequestMetadata(req),
      details: { gameType },
    });
  }

  static sessionJoined(userId: string, gameSessionId: string, playerCount: number): void {
    logAuditEvent({
      category: AuditCategory.GAME,
      eventType: AuditEventType.GAME_SESSION_JOINED,
      severity: AuditSeverity.INFO,
      timestamp: new Date().toISOString(),
      userId,
      gameSessionId,
      ipAddress: "websocket",
      details: { playerCount },
    });
  }

  static scoreRecorded(
    userId: string,
    gameSessionId: string,
    score: number,
    roundNumber: number
  ): void {
    logAuditEvent({
      category: AuditCategory.GAME,
      eventType: AuditEventType.GAME_SCORE_RECORDED,
      severity: AuditSeverity.INFO,
      timestamp: new Date().toISOString(),
      userId,
      gameSessionId,
      ipAddress: "websocket",
      details: { score, roundNumber },
    });
  }
}

/**
 * Social Event Loggers
 */
export class SocialAudit {
  static friendRequestSent(req: Request, requesterId: string, receiverId: string): void {
    logAuditEvent({
      category: AuditCategory.SOCIAL,
      eventType: AuditEventType.FRIEND_REQUEST_SENT,
      severity: AuditSeverity.INFO,
      timestamp: new Date().toISOString(),
      userId: requesterId,
      ...extractRequestMetadata(req),
      details: { receiverId },
    });
  }

  static userBlocked(req: Request, blockerId: string, blockedId: string): void {
    logAuditEvent({
      category: AuditCategory.SOCIAL,
      eventType: AuditEventType.USER_BLOCKED,
      severity: AuditSeverity.WARNING,
      timestamp: new Date().toISOString(),
      userId: blockerId,
      ...extractRequestMetadata(req),
      details: { blockedId },
    });
  }

  static userSearch(req: Request, userId: string, searchQuery: string, resultsCount: number): void {
    logAuditEvent({
      category: AuditCategory.SOCIAL,
      eventType: AuditEventType.USER_SEARCH,
      severity: AuditSeverity.INFO,
      timestamp: new Date().toISOString(),
      userId,
      ...extractRequestMetadata(req),
      details: { searchQueryHash: hashForLogging(searchQuery), resultsCount },
    });
  }
}

/**
 * Security Event Loggers
 */
export class SecurityAudit {
  static accountLocked(
    req: Request,
    userId: string,
    attemptCount: number,
    lockoutDuration: number
  ): void {
    logAuditEvent({
      category: AuditCategory.SECURITY,
      eventType: AuditEventType.ACCOUNT_LOCKED,
      severity: AuditSeverity.CRITICAL,
      timestamp: new Date().toISOString(),
      userId,
      ...extractRequestMetadata(req),
      details: { attemptCount, lockoutDuration },
    });
  }

  static rateLimitExceeded(req: Request, endpoint: string, limit: number): void {
    logAuditEvent({
      category: AuditCategory.SECURITY,
      eventType: AuditEventType.RATE_LIMIT_EXCEEDED,
      severity: AuditSeverity.WARNING,
      timestamp: new Date().toISOString(),
      ...extractRequestMetadata(req),
      details: { endpoint, limit },
    });
  }

  static suspiciousActivity(req: Request, activity: string, details?: any): void {
    logAuditEvent({
      category: AuditCategory.SECURITY,
      eventType: AuditEventType.SUSPICIOUS_ACTIVITY,
      severity: AuditSeverity.CRITICAL,
      timestamp: new Date().toISOString(),
      ...extractRequestMetadata(req),
      details: { activity, ...details },
    });
  }
}

/**
 * WebSocket Event Loggers
 */
export class WebSocketAudit {
  static connectionEstablished(userId: string, connectionId: string, ipAddress: string): void {
    logAuditEvent({
      category: AuditCategory.WEBSOCKET,
      eventType: AuditEventType.WS_CONNECTION_ESTABLISHED,
      severity: AuditSeverity.INFO,
      timestamp: new Date().toISOString(),
      userId,
      ipAddress,
      details: { connectionId },
    });
  }

  static roomJoined(userId: string, roomId: string, roomType: string): void {
    logAuditEvent({
      category: AuditCategory.WEBSOCKET,
      eventType: AuditEventType.WS_ROOM_JOINED,
      severity: AuditSeverity.INFO,
      timestamp: new Date().toISOString(),
      userId,
      ipAddress: "websocket",
      details: { roomId, roomType },
    });
  }
}

/**
 * System Event Loggers
 */
export class SystemAudit {
  static serverStartup(port: number, environment: string): void {
    logAuditEvent({
      category: AuditCategory.SYSTEM,
      eventType: AuditEventType.SERVER_STARTUP,
      severity: AuditSeverity.INFO,
      timestamp: new Date().toISOString(),
      ipAddress: "system",
      details: { port, environment },
    });
  }

  static healthCheckFailed(service: string, error: string): void {
    logAuditEvent({
      category: AuditCategory.SYSTEM,
      eventType: AuditEventType.HEALTH_CHECK_FAILED,
      severity: AuditSeverity.ERROR,
      timestamp: new Date().toISOString(),
      ipAddress: "system",
      details: { service, error },
    });
  }

  static redisConnectionError(clientType: string, error: string): void {
    logAuditEvent({
      category: AuditCategory.SYSTEM,
      eventType: AuditEventType.REDIS_CONNECTION_ERROR,
      severity: AuditSeverity.ERROR,
      timestamp: new Date().toISOString(),
      ipAddress: "system",
      details: { clientType, error },
    });
  }
}

/**
 * Database Event Loggers
 */
export class DatabaseAudit {
  static slowQuery(query: string, duration: number, userId?: string): void {
    logAuditEvent({
      category: AuditCategory.DATABASE,
      eventType: AuditEventType.DB_QUERY_SLOW,
      severity: AuditSeverity.WARNING,
      timestamp: new Date().toISOString(),
      userId,
      ipAddress: "database",
      details: { queryHash: hashForLogging(query), duration },
    });
  }

  static transactionFailed(operation: string, error: string, userId?: string): void {
    logAuditEvent({
      category: AuditCategory.DATABASE,
      eventType: AuditEventType.DB_TRANSACTION_FAILED,
      severity: AuditSeverity.ERROR,
      timestamp: new Date().toISOString(),
      userId,
      ipAddress: "database",
      details: { operation, error },
    });
  }
}
