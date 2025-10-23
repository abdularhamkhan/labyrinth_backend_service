/**
 * =============================================================================
 * COMPREHENSIVE ERROR CONSTANTS
 * =============================================================================
 *
 * This file defines all possible error types, messages, and codes used throughout
 * the application. Each error is categorized by domain and includes:
 * - Error code (for API responses)
 * - User-friendly message
 * - HTTP status code
 * - Error type for proper handling
 *
 * Usage:
 * import { AUTH_ERRORS, USER_ERRORS, throwError } from '../constants/error';
 * throw throwError(AUTH_ERRORS.INVALID_CREDENTIALS);
 *
 * =============================================================================
 */

// Error structure interface
export interface ErrorDefinition {
  code: string;
  message: string;
  statusCode: number;
  type:
    | "AuthenticationError"
    | "AuthorizationError"
    | "ValidationError"
    | "NotFoundError"
    | "ConflictError"
    | "DatabaseError"
    | "ExternalServiceError"
    | "RateLimitError"
    | "AppError";
}

// =============================================================================
// AUTHENTICATION ERRORS (401)
// =============================================================================

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: {
    code: "AUTH_INVALID_CREDENTIALS",
    message: "Invalid email, username, or password provided",
    statusCode: 401,
    type: "AuthenticationError" as const,
  },
  TOKEN_INVALID: {
    code: "AUTH_TOKEN_INVALID",
    message: "Authentication token is invalid or malformed",
    statusCode: 401,
    type: "AuthenticationError" as const,
  },
  TOKEN_EXPIRED: {
    code: "AUTH_TOKEN_EXPIRED",
    message: "Authentication token has expired",
    statusCode: 401,
    type: "AuthenticationError" as const,
  },
  TOKEN_MISSING: {
    code: "AUTH_TOKEN_MISSING",
    message: "Authentication token is required",
    statusCode: 401,
    type: "AuthenticationError" as const,
  },
  SESSION_EXPIRED: {
    code: "AUTH_SESSION_EXPIRED",
    message: "Your session has expired. Please log in again",
    statusCode: 401,
    type: "AuthenticationError" as const,
  },
  OTP_INVALID: {
    code: "AUTH_OTP_INVALID",
    message: "Invalid or expired OTP code",
    statusCode: 401,
    type: "AuthenticationError" as const,
  },
  OTP_EXPIRED: {
    code: "AUTH_OTP_EXPIRED",
    message: "OTP code has expired. Please request a new one",
    statusCode: 401,
    type: "AuthenticationError" as const,
  },
  LOGIN_FAILED: {
    code: "AUTH_LOGIN_FAILED",
    message: "Login failed. Please check your credentials",
    statusCode: 401,
    type: "AuthenticationError" as const,
  },
  SIGNUP_FAILED: {
    code: "AUTH_SIGNUP_FAILED",
    message: "Account creation failed. Please try again",
    statusCode: 401,
    type: "AuthenticationError" as const,
  },
  RESET_TOKEN_INVALID: {
    code: "AUTH_RESET_TOKEN_INVALID",
    message: "Invalid or expired password reset token",
    statusCode: 401,
    type: "AuthenticationError" as const,
  },
  RESET_TOKEN_EXPIRED: {
    code: "AUTH_RESET_TOKEN_EXPIRED",
    message: "Password reset token has expired. Please request a new one",
    statusCode: 401,
    type: "AuthenticationError" as const,
  },
  RESET_TOKEN_USED: {
    code: "AUTH_RESET_TOKEN_USED",
    message: "This password reset token has already been used",
    statusCode: 401,
    type: "AuthenticationError" as const,
  },
  PASSWORD_RESET_FAILED: {
    code: "AUTH_PASSWORD_RESET_FAILED",
    message: "Password reset failed. Please try again",
    statusCode: 500,
    type: "ExternalServiceError" as const,
  },
} as const;

// =============================================================================
// AUTHORIZATION ERRORS (403)
// =============================================================================

export const AUTHORIZATION_ERRORS = {
  ACCESS_DENIED: {
    code: "AUTH_ACCESS_DENIED",
    message: "You do not have permission to access this resource",
    statusCode: 403,
    type: "AuthorizationError" as const,
  },
  INSUFFICIENT_PERMISSIONS: {
    code: "AUTH_INSUFFICIENT_PERMISSIONS",
    message: "Insufficient permissions to perform this action",
    statusCode: 403,
    type: "AuthorizationError" as const,
  },
  ACCOUNT_SUSPENDED: {
    code: "AUTH_ACCOUNT_SUSPENDED",
    message: "Your account has been suspended. Contact support for assistance",
    statusCode: 403,
    type: "AuthorizationError" as const,
  },
  ACCOUNT_LOCKED: {
    code: "AUTH_ACCOUNT_LOCKED",
    message: "Your account has been temporarily locked due to security reasons",
    statusCode: 403,
    type: "AuthorizationError" as const,
  },
} as const;

// =============================================================================
// VALIDATION ERRORS (400)
// =============================================================================

export const VALIDATION_ERRORS = {
  INVALID_INPUT: {
    code: "VALIDATION_INVALID_INPUT",
    message: "Invalid input data provided",
    statusCode: 400,
    type: "ValidationError" as const,
  },
  MISSING_REQUIRED_FIELDS: {
    code: "VALIDATION_MISSING_FIELDS",
    message: "Required fields are missing",
    statusCode: 400,
    type: "ValidationError" as const,
  },
  INVALID_EMAIL_FORMAT: {
    code: "VALIDATION_INVALID_EMAIL",
    message: "Invalid email format provided",
    statusCode: 400,
    type: "ValidationError" as const,
  },
  INVALID_PASSWORD_FORMAT: {
    code: "VALIDATION_INVALID_PASSWORD",
    message:
      "Password must be at least 8 characters long with uppercase, lowercase, number, and special character",
    statusCode: 400,
    type: "ValidationError" as const,
  },
  INVALID_USERNAME_FORMAT: {
    code: "VALIDATION_INVALID_USERNAME",
    message:
      "Username must be 3-50 characters long and contain only letters, numbers, underscores, and hyphens",
    statusCode: 400,
    type: "ValidationError" as const,
  },
  INVALID_FILE_TYPE: {
    code: "VALIDATION_INVALID_FILE_TYPE",
    message: "Invalid file type. Only images are allowed",
    statusCode: 400,
    type: "ValidationError" as const,
  },
  FILE_TOO_LARGE: {
    code: "VALIDATION_FILE_TOO_LARGE",
    message: "File size exceeds the maximum limit of 5MB",
    statusCode: 400,
    type: "ValidationError" as const,
  },
  INVALID_JSON: {
    code: "VALIDATION_INVALID_JSON",
    message: "Invalid JSON format in request body",
    statusCode: 400,
    type: "ValidationError" as const,
  },
  INVALID_PHONE_FORMAT: {
    code: "VALIDATION_INVALID_PHONE",
    message: "Invalid phone number format. Please use international format (e.g., +1234567890)",
    statusCode: 400,
    type: "ValidationError" as const,
  },
} as const;

// =============================================================================
// USER ERRORS (404, 409)
// =============================================================================

export const USER_ERRORS = {
  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    message: "User not found",
    statusCode: 404,
    type: "NotFoundError" as const,
  },
  USER_ALREADY_EXISTS: {
    code: "USER_ALREADY_EXISTS",
    message: "A user with this email or username already exists",
    statusCode: 409,
    type: "ConflictError" as const,
  },
  EMAIL_ALREADY_EXISTS: {
    code: "USER_EMAIL_EXISTS",
    message: "This email is already registered",
    statusCode: 409,
    type: "AuthenticationError" as const,
  },
  USERNAME_ALREADY_EXISTS: {
    code: "USER_USERNAME_EXISTS",
    message: "This username is already taken",
    statusCode: 409,
    type: "ConflictError" as const,
  },
  PHONE_ALREADY_EXISTS: {
    code: "USER_PHONE_EXISTS",
    message: "An account with this phone number already exists",
    statusCode: 409,
    type: "ConflictError" as const,
  },
  PROFILE_UPDATE_FAILED: {
    code: "USER_PROFILE_UPDATE_FAILED",
    message: "Failed to update user profile",
    statusCode: 500,
    type: "DatabaseError" as const,
  },
  AVATAR_UPLOAD_FAILED: {
    code: "USER_AVATAR_UPLOAD_FAILED",
    message: "Failed to upload avatar image",
    statusCode: 500,
    type: "ExternalServiceError" as const,
  },
  AVATAR_DELETE_FAILED: {
    code: "USER_AVATAR_DELETE_FAILED",
    message: "Failed to delete avatar image",
    statusCode: 500,
    type: "ExternalServiceError" as const,
  },
} as const;

// =============================================================================
// GAME ERRORS (404, 409, 400)
// =============================================================================

export const GAME_ERRORS = {
  GAME_NOT_FOUND: {
    code: "GAME_NOT_FOUND",
    message: "Game session not found",
    statusCode: 404,
    type: "NotFoundError" as const,
  },
  GAME_ALREADY_STARTED: {
    code: "GAME_ALREADY_STARTED",
    message: "Game session has already started",
    statusCode: 409,
    type: "ConflictError" as const,
  },
  GAME_ALREADY_FINISHED: {
    code: "GAME_ALREADY_FINISHED",
    message: "Game session has already finished",
    statusCode: 409,
    type: "ConflictError" as const,
  },
  INVALID_MOVE: {
    code: "GAME_INVALID_MOVE",
    message: "Invalid game move",
    statusCode: 400,
    type: "ValidationError" as const,
  },
  NOT_PLAYER_TURN: {
    code: "GAME_NOT_PLAYER_TURN",
    message: "It is not your turn",
    statusCode: 400,
    type: "ValidationError" as const,
  },
  PLAYER_NOT_IN_GAME: {
    code: "GAME_PLAYER_NOT_FOUND",
    message: "Player is not part of this game",
    statusCode: 403,
    type: "AuthorizationError" as const,
  },
  GAME_FULL: {
    code: "GAME_FULL",
    message: "Game session is full",
    statusCode: 409,
    type: "ConflictError" as const,
  },
} as const;

// =============================================================================
// LEADERBOARD ERRORS (404, 500)
// =============================================================================

export const LEADERBOARD_ERRORS = {
  LEADERBOARD_NOT_FOUND: {
    code: "LEADERBOARD_NOT_FOUND",
    message: "Leaderboard not found",
    statusCode: 404,
    type: "NotFoundError" as const,
  },
  LEADERBOARD_UPDATE_FAILED: {
    code: "LEADERBOARD_UPDATE_FAILED",
    message: "Failed to update leaderboard",
    statusCode: 500,
    type: "DatabaseError" as const,
  },
  STATS_NOT_FOUND: {
    code: "STATS_NOT_FOUND",
    message: "User statistics not found",
    statusCode: 404,
    type: "NotFoundError" as const,
  },
} as const;

// =============================================================================
// FRIENDSHIP ERRORS (400, 404, 409)
// =============================================================================

export const FRIENDSHIP_ERRORS = {
  CANNOT_FRIEND_YOURSELF: {
    code: "FRIENDSHIP_CANNOT_FRIEND_YOURSELF",
    message: "Cannot send friend request to yourself",
    statusCode: 400,
    type: "ValidationError" as const,
  },
  ALREADY_FRIENDS: {
    code: "FRIENDSHIP_ALREADY_FRIENDS",
    message: "You are already friends with this user",
    statusCode: 409,
    type: "ConflictError" as const,
  },
  REQUEST_ALREADY_SENT: {
    code: "FRIENDSHIP_REQUEST_ALREADY_SENT",
    message: "Friend request already sent to this user",
    statusCode: 409,
    type: "ConflictError" as const,
  },
  REQUEST_ALREADY_RECEIVED: {
    code: "FRIENDSHIP_REQUEST_ALREADY_RECEIVED",
    message: "You have already received a friend request from this user",
    statusCode: 409,
    type: "ConflictError" as const,
  },
  USER_BLOCKED: {
    code: "FRIENDSHIP_USER_BLOCKED",
    message: "Cannot interact with blocked user",
    statusCode: 403,
    type: "AuthorizationError" as const,
  },
  USER_NOT_AVAILABLE: {
    code: "FRIENDSHIP_USER_NOT_AVAILABLE",
    message: "User is not available for friend requests",
    statusCode: 400,
    type: "ValidationError" as const,
  },
  FRIENDSHIP_NOT_FOUND: {
    code: "FRIENDSHIP_NOT_FOUND",
    message: "Friendship not found",
    statusCode: 404,
    type: "NotFoundError" as const,
  },
  NOT_AUTHORIZED: {
    code: "FRIENDSHIP_NOT_AUTHORIZED",
    message: "You are not authorized to perform this action",
    statusCode: 403,
    type: "AuthorizationError" as const,
  },
  INVALID_STATUS_TRANSITION: {
    code: "FRIENDSHIP_INVALID_STATUS_TRANSITION",
    message: "Invalid friendship status transition",
    statusCode: 400,
    type: "ValidationError" as const,
  },
  USER_NOT_BLOCKED: {
    code: "FRIENDSHIP_USER_NOT_BLOCKED",
    message: "User is not currently blocked",
    statusCode: 400,
    type: "ValidationError" as const,
  },
} as const;

// =============================================================================
// DATABASE ERRORS (500)
// =============================================================================

export const DATABASE_ERRORS = {
  CONNECTION_FAILED: {
    code: "DB_CONNECTION_FAILED",
    message: "Database connection failed",
    statusCode: 500,
    type: "DatabaseError" as const,
  },
  QUERY_FAILED: {
    code: "DB_QUERY_FAILED",
    message: "Database query failed",
    statusCode: 500,
    type: "DatabaseError" as const,
  },
  TRANSACTION_FAILED: {
    code: "DB_TRANSACTION_FAILED",
    message: "Database transaction failed",
    statusCode: 500,
    type: "DatabaseError" as const,
  },
  DUPLICATE_ENTRY: {
    code: "DB_DUPLICATE_ENTRY",
    message: "A record with this information already exists",
    statusCode: 409,
    type: "ConflictError" as const,
  },
  RECORD_NOT_FOUND: {
    code: "DB_RECORD_NOT_FOUND",
    message: "The requested record was not found",
    statusCode: 404,
    type: "NotFoundError" as const,
  },
  CONSTRAINT_VIOLATION: {
    code: "DB_CONSTRAINT_VIOLATION",
    message: "Database constraint violation",
    statusCode: 400,
    type: "ValidationError" as const,
  },
} as const;

// =============================================================================
// REDIS ERRORS (500, 503)
// =============================================================================

export const REDIS_ERRORS = {
  CONNECTION_FAILED: {
    code: "REDIS_CONNECTION_FAILED",
    message: "Redis connection failed",
    statusCode: 503,
    type: "ExternalServiceError" as const,
  },
  OPERATION_FAILED: {
    code: "REDIS_OPERATION_FAILED",
    message: "Redis operation failed",
    statusCode: 500,
    type: "ExternalServiceError" as const,
  },
  CACHE_MISS: {
    code: "REDIS_CACHE_MISS",
    message: "Data not found in cache",
    statusCode: 404,
    type: "NotFoundError" as const,
  },
  SESSION_EXPIRED: {
    code: "REDIS_SESSION_EXPIRED",
    message: "Session has expired",
    statusCode: 401,
    type: "AuthenticationError" as const,
  },
} as const;

// =============================================================================
// EXTERNAL SERVICE ERRORS (502, 503)
// =============================================================================

export const EXTERNAL_SERVICE_ERRORS = {
  SUPABASE_ERROR: {
    code: "EXTERNAL_SUPABASE_ERROR",
    message: "Authentication service is temporarily unavailable",
    statusCode: 503,
    type: "ExternalServiceError" as const,
  },
  STORAGE_ERROR: {
    code: "EXTERNAL_STORAGE_ERROR",
    message: "File storage service is temporarily unavailable",
    statusCode: 503,
    type: "ExternalServiceError" as const,
  },
  EMAIL_SERVICE_ERROR: {
    code: "EXTERNAL_EMAIL_ERROR",
    message: "Email service is temporarily unavailable",
    statusCode: 503,
    type: "ExternalServiceError" as const,
  },
  EMAIL_SEND_FAILED: {
    code: "EXTERNAL_EMAIL_SEND_FAILED",
    message: "Email delivery failed. Please check your email address or contact support",
    statusCode: 502,
    type: "ExternalServiceError" as const,
  },
  THIRD_PARTY_API_ERROR: {
    code: "EXTERNAL_API_ERROR",
    message: "External API service is temporarily unavailable",
    statusCode: 502,
    type: "ExternalServiceError" as const,
  },
} as const;

// =============================================================================
// RATE LIMITING ERRORS (429)
// =============================================================================

export const RATE_LIMIT_ERRORS = {
  TOO_MANY_REQUESTS: {
    code: "RATE_LIMIT_EXCEEDED",
    message: "Too many requests. Please try again later",
    statusCode: 429,
    type: "RateLimitError" as const,
  },
  TOO_MANY_LOGIN_ATTEMPTS: {
    code: "RATE_LIMIT_LOGIN_ATTEMPTS",
    message: "Too many login attempts. Please try again in 15 minutes",
    statusCode: 429,
    type: "RateLimitError" as const,
  },
  TOO_MANY_OTP_REQUESTS: {
    code: "RATE_LIMIT_OTP_REQUESTS",
    message: "Too many OTP requests. Please wait before requesting another",
    statusCode: 429,
    type: "RateLimitError" as const,
  },
} as const;

// =============================================================================
// SERVER ERRORS (500)
// =============================================================================

export const SERVER_ERRORS = {
  INTERNAL_SERVER_ERROR: {
    code: "SERVER_INTERNAL_ERROR",
    message: "A server error occurred while processing your request",
    statusCode: 500,
    type: "AppError" as const,
  },
  SERVICE_UNAVAILABLE: {
    code: "SERVER_SERVICE_UNAVAILABLE",
    message: "The requested service is currently unavailable",
    statusCode: 503,
    type: "AppError" as const,
  },
  MAINTENANCE_MODE: {
    code: "SERVER_MAINTENANCE",
    message: "The server is currently undergoing maintenance. Please check back shortly",
    statusCode: 503,
    type: "AppError" as const,
  },
} as const;

// =============================================================================
// UTILITY FUNCTIONS FOR ERROR HANDLING
// =============================================================================

// =============================================================================
// ERROR CLASSES (to replace error.middleware.ts classes)
// =============================================================================

// Base application error class
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errorCode: string;
  public readonly details?: any;
  public readonly timestamp: string;
  public readonly requestId?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = "INTERNAL_ERROR",
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorCode = errorCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.name = this.constructor.name;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  setRequestId(requestId: string): this {
    (this as any).requestId = requestId;
    return this;
  }
}

// Authentication errors
export class AuthenticationError extends AppError {
  constructor(
    message: string = "Authentication failed",
    errorCode: string = "AUTH_FAILED",
    details?: any
  ) {
    super(message, 401, errorCode, true, details);
  }
}

// Authorization errors
export class AuthorizationError extends AppError {
  constructor(
    message: string = "Access denied",
    errorCode: string = "ACCESS_DENIED",
    details?: any
  ) {
    super(message, 403, errorCode, true, details);
  }
}

// Validation errors
export class ValidationError extends AppError {
  constructor(
    message: string = "Invalid input data",
    errorCode: string = "VALIDATION_ERROR",
    details?: any
  ) {
    super(message, 400, errorCode, true, details);
  }
}

// Bad request errors (400 - general client errors)
export class BadRequestError extends AppError {
  constructor(message: string = "Bad request", errorCode: string = "BAD_REQUEST", details?: any) {
    super(message, 400, errorCode, true, details);
  }
}

// Resource not found errors
export class NotFoundError extends AppError {
  constructor(
    message: string = "Resource not found",
    errorCode: string = "NOT_FOUND",
    details?: any
  ) {
    super(message, 404, errorCode, true, details);
  }
}

// Conflict errors (duplicate resources, etc.)
export class ConflictError extends AppError {
  constructor(
    message: string = "Resource conflict",
    errorCode: string = "CONFLICT",
    details?: any
  ) {
    super(message, 409, errorCode, true, details);
  }
}

// Rate limiting errors
export class RateLimitError extends AppError {
  constructor(
    message: string = "Rate limit exceeded",
    errorCode: string = "RATE_LIMIT_EXCEEDED",
    details?: any
  ) {
    super(message, 429, errorCode, true, details);
  }
}

// Database errors
export class DatabaseError extends AppError {
  constructor(
    message: string = "Database operation failed",
    errorCode: string = "DATABASE_ERROR",
    details?: any
  ) {
    super(message, 500, errorCode, true, details);
  }
}

// External service errors
export class ExternalServiceError extends AppError {
  constructor(
    message: string = "External service error",
    errorCode: string = "EXTERNAL_SERVICE_ERROR",
    details?: any
  ) {
    super(message, 502, errorCode, true, details);
  }
}

// =============================================================================
// UTILITY FUNCTIONS FOR ERROR CREATION
// =============================================================================

/**
 * Creates an error object with the proper structure for throwing
 */
export function createError(errorDef: ErrorDefinition, details?: any): AppError {
  // Use the generic AppError class with all parameters
  return new AppError(errorDef.message, errorDef.statusCode, errorDef.code, true, details);
}

/**
 * Throws an error with the proper structure
 */
export function throwError(errorDef: ErrorDefinition, details?: any): never {
  throw createError(errorDef, details);
}

/**
 * Get the appropriate error class based on error type
 */
function getErrorClass(type: ErrorDefinition["type"]) {
  switch (type) {
    case "AuthenticationError":
      return AuthenticationError;
    case "AuthorizationError":
      return AuthorizationError;
    case "ValidationError":
      return ValidationError;
    case "NotFoundError":
      return NotFoundError;
    case "ConflictError":
      return ConflictError;
    case "RateLimitError":
      return RateLimitError;
    case "DatabaseError":
      return DatabaseError;
    case "ExternalServiceError":
      return ExternalServiceError;
    default:
      return AppError;
  }
}

// =============================================================================
// LEGACY SUPPORT (for backward compatibility)
// =============================================================================

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: AUTH_ERRORS.INVALID_CREDENTIALS.message,
  USER_NOT_FOUND: USER_ERRORS.USER_NOT_FOUND.message,
  SIGNUP_FAILED: AUTH_ERRORS.SIGNUP_FAILED.message,
  DB_ERROR: DATABASE_ERRORS.QUERY_FAILED.message,
} as const;

// =============================================================================
// EXPORTS FOR EASY IMPORTING
// =============================================================================

export const ALL_ERRORS = {
  ...AUTH_ERRORS,
  ...AUTHORIZATION_ERRORS,
  ...VALIDATION_ERRORS,
  ...USER_ERRORS,
  ...GAME_ERRORS,
  ...LEADERBOARD_ERRORS,
  ...FRIENDSHIP_ERRORS,
  ...DATABASE_ERRORS,
  ...REDIS_ERRORS,
  ...EXTERNAL_SERVICE_ERRORS,
  ...RATE_LIMIT_ERRORS,
  ...SERVER_ERRORS,
} as const;

export type ErrorCode = keyof typeof ALL_ERRORS;
