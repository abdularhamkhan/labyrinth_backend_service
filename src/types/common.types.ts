/**
 * =============================================================================
 * COMMON TYPES - SHARED APPLICATION INTERFACES
 * =============================================================================
 *
 * These interfaces define common types used across multiple services
 * and components in the application.
 *
 * =============================================================================
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  requestId?: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  limit: number;
  offset: number;
  page?: number;
  total?: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Database entity timestamps
 */
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * User status enumeration
 */
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";

/**
 * Game status enumeration
 */
export type GameStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "ABANDONED";

/**
 * Notification types
 */
export type NotificationType =
  | "FRIEND_REQUEST"
  | "GAME_INVITATION"
  | "GAME_RESULT"
  | "ACHIEVEMENT_UNLOCKED"
  | "LEADERBOARD_POSITION"
  | "DAILY_CHALLENGE"
  | "SYSTEM_MESSAGE";

/**
 * Error severity levels
 */
export type ErrorSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/**
 * Service health status
 */
export interface ServiceHealth {
  service: string;
  status: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
  lastCheck: string;
  responseTime: number;
  details?: Record<string, any>;
}

/**
 * Audit log entry
 */
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: string;
}

/**
 * Configuration environment
 */
export type Environment = "development" | "staging" | "production" | "test";
