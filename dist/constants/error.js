"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_ERRORS = exports.ERROR_MESSAGES = exports.ExternalServiceError = exports.DatabaseError = exports.RateLimitError = exports.ConflictError = exports.NotFoundError = exports.BadRequestError = exports.ValidationError = exports.AuthorizationError = exports.AuthenticationError = exports.AppError = exports.SERVER_ERRORS = exports.RATE_LIMIT_ERRORS = exports.EXTERNAL_SERVICE_ERRORS = exports.REDIS_ERRORS = exports.DATABASE_ERRORS = exports.FRIENDSHIP_ERRORS = exports.LEADERBOARD_ERRORS = exports.GAME_ERRORS = exports.USER_ERRORS = exports.VALIDATION_ERRORS = exports.AUTHORIZATION_ERRORS = exports.AUTH_ERRORS = void 0;
exports.createError = createError;
exports.throwError = throwError;
// =============================================================================
// AUTHENTICATION ERRORS (401)
// =============================================================================
exports.AUTH_ERRORS = {
    INVALID_CREDENTIALS: {
        code: "AUTH_INVALID_CREDENTIALS",
        message: "Invalid email, username, or password provided",
        statusCode: 401,
        type: "AuthenticationError",
    },
    TOKEN_INVALID: {
        code: "AUTH_TOKEN_INVALID",
        message: "Authentication token is invalid or malformed",
        statusCode: 401,
        type: "AuthenticationError",
    },
    TOKEN_EXPIRED: {
        code: "AUTH_TOKEN_EXPIRED",
        message: "Authentication token has expired",
        statusCode: 401,
        type: "AuthenticationError",
    },
    TOKEN_MISSING: {
        code: "AUTH_TOKEN_MISSING",
        message: "Authentication token is required",
        statusCode: 401,
        type: "AuthenticationError",
    },
    SESSION_EXPIRED: {
        code: "AUTH_SESSION_EXPIRED",
        message: "Your session has expired. Please log in again",
        statusCode: 401,
        type: "AuthenticationError",
    },
    OTP_INVALID: {
        code: "AUTH_OTP_INVALID",
        message: "Invalid or expired OTP code",
        statusCode: 401,
        type: "AuthenticationError",
    },
    OTP_EXPIRED: {
        code: "AUTH_OTP_EXPIRED",
        message: "OTP code has expired. Please request a new one",
        statusCode: 401,
        type: "AuthenticationError",
    },
    LOGIN_FAILED: {
        code: "AUTH_LOGIN_FAILED",
        message: "Login failed. Please check your credentials",
        statusCode: 401,
        type: "AuthenticationError",
    },
    SIGNUP_FAILED: {
        code: "AUTH_SIGNUP_FAILED",
        message: "Account creation failed. Please try again",
        statusCode: 401,
        type: "AuthenticationError",
    },
    RESET_TOKEN_INVALID: {
        code: "AUTH_RESET_TOKEN_INVALID",
        message: "Invalid or expired password reset token",
        statusCode: 401,
        type: "AuthenticationError",
    },
    RESET_TOKEN_EXPIRED: {
        code: "AUTH_RESET_TOKEN_EXPIRED",
        message: "Password reset token has expired. Please request a new one",
        statusCode: 401,
        type: "AuthenticationError",
    },
    RESET_TOKEN_USED: {
        code: "AUTH_RESET_TOKEN_USED",
        message: "This password reset token has already been used",
        statusCode: 401,
        type: "AuthenticationError",
    },
    PASSWORD_RESET_FAILED: {
        code: "AUTH_PASSWORD_RESET_FAILED",
        message: "Password reset failed. Please try again",
        statusCode: 500,
        type: "ExternalServiceError",
    },
};
// =============================================================================
// AUTHORIZATION ERRORS (403)
// =============================================================================
exports.AUTHORIZATION_ERRORS = {
    ACCESS_DENIED: {
        code: "AUTH_ACCESS_DENIED",
        message: "You do not have permission to access this resource",
        statusCode: 403,
        type: "AuthorizationError",
    },
    INSUFFICIENT_PERMISSIONS: {
        code: "AUTH_INSUFFICIENT_PERMISSIONS",
        message: "Insufficient permissions to perform this action",
        statusCode: 403,
        type: "AuthorizationError",
    },
    ACCOUNT_SUSPENDED: {
        code: "AUTH_ACCOUNT_SUSPENDED",
        message: "Your account has been suspended. Contact support for assistance",
        statusCode: 403,
        type: "AuthorizationError",
    },
    ACCOUNT_LOCKED: {
        code: "AUTH_ACCOUNT_LOCKED",
        message: "Your account has been temporarily locked due to security reasons",
        statusCode: 403,
        type: "AuthorizationError",
    },
};
// =============================================================================
// VALIDATION ERRORS (400)
// =============================================================================
exports.VALIDATION_ERRORS = {
    INVALID_INPUT: {
        code: "VALIDATION_INVALID_INPUT",
        message: "Invalid input data provided",
        statusCode: 400,
        type: "ValidationError",
    },
    MISSING_REQUIRED_FIELDS: {
        code: "VALIDATION_MISSING_FIELDS",
        message: "Required fields are missing",
        statusCode: 400,
        type: "ValidationError",
    },
    INVALID_EMAIL_FORMAT: {
        code: "VALIDATION_INVALID_EMAIL",
        message: "Invalid email format provided",
        statusCode: 400,
        type: "ValidationError",
    },
    INVALID_PASSWORD_FORMAT: {
        code: "VALIDATION_INVALID_PASSWORD",
        message: "Password must be at least 8 characters long with uppercase, lowercase, number, and special character",
        statusCode: 400,
        type: "ValidationError",
    },
    INVALID_USERNAME_FORMAT: {
        code: "VALIDATION_INVALID_USERNAME",
        message: "Username must be 3-50 characters long and contain only letters, numbers, underscores, and hyphens",
        statusCode: 400,
        type: "ValidationError",
    },
    INVALID_FILE_TYPE: {
        code: "VALIDATION_INVALID_FILE_TYPE",
        message: "Invalid file type. Only images are allowed",
        statusCode: 400,
        type: "ValidationError",
    },
    FILE_TOO_LARGE: {
        code: "VALIDATION_FILE_TOO_LARGE",
        message: "File size exceeds the maximum limit of 5MB",
        statusCode: 400,
        type: "ValidationError",
    },
    INVALID_JSON: {
        code: "VALIDATION_INVALID_JSON",
        message: "Invalid JSON format in request body",
        statusCode: 400,
        type: "ValidationError",
    },
    INVALID_PHONE_FORMAT: {
        code: "VALIDATION_INVALID_PHONE",
        message: "Invalid phone number format. Please use international format (e.g., +1234567890)",
        statusCode: 400,
        type: "ValidationError",
    },
};
// =============================================================================
// USER ERRORS (404, 409)
// =============================================================================
exports.USER_ERRORS = {
    USER_NOT_FOUND: {
        code: "USER_NOT_FOUND",
        message: "User not found",
        statusCode: 404,
        type: "NotFoundError",
    },
    USER_ALREADY_EXISTS: {
        code: "USER_ALREADY_EXISTS",
        message: "A user with this email or username already exists",
        statusCode: 409,
        type: "ConflictError",
    },
    EMAIL_ALREADY_EXISTS: {
        code: "USER_EMAIL_EXISTS",
        message: "An account with this email address already exists",
        statusCode: 409,
        type: "ConflictError",
    },
    USERNAME_ALREADY_EXISTS: {
        code: "USER_USERNAME_EXISTS",
        message: "This username is already taken",
        statusCode: 409,
        type: "ConflictError",
    },
    PHONE_ALREADY_EXISTS: {
        code: "USER_PHONE_EXISTS",
        message: "An account with this phone number already exists",
        statusCode: 409,
        type: "ConflictError",
    },
    PROFILE_UPDATE_FAILED: {
        code: "USER_PROFILE_UPDATE_FAILED",
        message: "Failed to update user profile",
        statusCode: 500,
        type: "DatabaseError",
    },
    AVATAR_UPLOAD_FAILED: {
        code: "USER_AVATAR_UPLOAD_FAILED",
        message: "Failed to upload avatar image",
        statusCode: 500,
        type: "ExternalServiceError",
    },
    AVATAR_DELETE_FAILED: {
        code: "USER_AVATAR_DELETE_FAILED",
        message: "Failed to delete avatar image",
        statusCode: 500,
        type: "ExternalServiceError",
    },
};
// =============================================================================
// GAME ERRORS (404, 409, 400)
// =============================================================================
exports.GAME_ERRORS = {
    GAME_NOT_FOUND: {
        code: "GAME_NOT_FOUND",
        message: "Game session not found",
        statusCode: 404,
        type: "NotFoundError",
    },
    GAME_ALREADY_STARTED: {
        code: "GAME_ALREADY_STARTED",
        message: "Game session has already started",
        statusCode: 409,
        type: "ConflictError",
    },
    GAME_ALREADY_FINISHED: {
        code: "GAME_ALREADY_FINISHED",
        message: "Game session has already finished",
        statusCode: 409,
        type: "ConflictError",
    },
    INVALID_MOVE: {
        code: "GAME_INVALID_MOVE",
        message: "Invalid game move",
        statusCode: 400,
        type: "ValidationError",
    },
    NOT_PLAYER_TURN: {
        code: "GAME_NOT_PLAYER_TURN",
        message: "It is not your turn",
        statusCode: 400,
        type: "ValidationError",
    },
    PLAYER_NOT_IN_GAME: {
        code: "GAME_PLAYER_NOT_FOUND",
        message: "Player is not part of this game",
        statusCode: 403,
        type: "AuthorizationError",
    },
    GAME_FULL: {
        code: "GAME_FULL",
        message: "Game session is full",
        statusCode: 409,
        type: "ConflictError",
    },
};
// =============================================================================
// LEADERBOARD ERRORS (404, 500)
// =============================================================================
exports.LEADERBOARD_ERRORS = {
    LEADERBOARD_NOT_FOUND: {
        code: "LEADERBOARD_NOT_FOUND",
        message: "Leaderboard not found",
        statusCode: 404,
        type: "NotFoundError",
    },
    LEADERBOARD_UPDATE_FAILED: {
        code: "LEADERBOARD_UPDATE_FAILED",
        message: "Failed to update leaderboard",
        statusCode: 500,
        type: "DatabaseError",
    },
    STATS_NOT_FOUND: {
        code: "STATS_NOT_FOUND",
        message: "User statistics not found",
        statusCode: 404,
        type: "NotFoundError",
    },
};
// =============================================================================
// FRIENDSHIP ERRORS (400, 404, 409)
// =============================================================================
exports.FRIENDSHIP_ERRORS = {
    CANNOT_FRIEND_YOURSELF: {
        code: "FRIENDSHIP_CANNOT_FRIEND_YOURSELF",
        message: "Cannot send friend request to yourself",
        statusCode: 400,
        type: "ValidationError",
    },
    ALREADY_FRIENDS: {
        code: "FRIENDSHIP_ALREADY_FRIENDS",
        message: "You are already friends with this user",
        statusCode: 409,
        type: "ConflictError",
    },
    REQUEST_ALREADY_SENT: {
        code: "FRIENDSHIP_REQUEST_ALREADY_SENT",
        message: "Friend request already sent to this user",
        statusCode: 409,
        type: "ConflictError",
    },
    REQUEST_ALREADY_RECEIVED: {
        code: "FRIENDSHIP_REQUEST_ALREADY_RECEIVED",
        message: "You have already received a friend request from this user",
        statusCode: 409,
        type: "ConflictError",
    },
    USER_BLOCKED: {
        code: "FRIENDSHIP_USER_BLOCKED",
        message: "Cannot interact with blocked user",
        statusCode: 403,
        type: "AuthorizationError",
    },
    USER_NOT_AVAILABLE: {
        code: "FRIENDSHIP_USER_NOT_AVAILABLE",
        message: "User is not available for friend requests",
        statusCode: 400,
        type: "ValidationError",
    },
    FRIENDSHIP_NOT_FOUND: {
        code: "FRIENDSHIP_NOT_FOUND",
        message: "Friendship not found",
        statusCode: 404,
        type: "NotFoundError",
    },
    NOT_AUTHORIZED: {
        code: "FRIENDSHIP_NOT_AUTHORIZED",
        message: "You are not authorized to perform this action",
        statusCode: 403,
        type: "AuthorizationError",
    },
    INVALID_STATUS_TRANSITION: {
        code: "FRIENDSHIP_INVALID_STATUS_TRANSITION",
        message: "Invalid friendship status transition",
        statusCode: 400,
        type: "ValidationError",
    },
    USER_NOT_BLOCKED: {
        code: "FRIENDSHIP_USER_NOT_BLOCKED",
        message: "User is not currently blocked",
        statusCode: 400,
        type: "ValidationError",
    },
};
// =============================================================================
// DATABASE ERRORS (500)
// =============================================================================
exports.DATABASE_ERRORS = {
    CONNECTION_FAILED: {
        code: "DB_CONNECTION_FAILED",
        message: "Database connection failed",
        statusCode: 500,
        type: "DatabaseError",
    },
    QUERY_FAILED: {
        code: "DB_QUERY_FAILED",
        message: "Database query failed",
        statusCode: 500,
        type: "DatabaseError",
    },
    TRANSACTION_FAILED: {
        code: "DB_TRANSACTION_FAILED",
        message: "Database transaction failed",
        statusCode: 500,
        type: "DatabaseError",
    },
    DUPLICATE_ENTRY: {
        code: "DB_DUPLICATE_ENTRY",
        message: "A record with this information already exists",
        statusCode: 409,
        type: "ConflictError",
    },
    RECORD_NOT_FOUND: {
        code: "DB_RECORD_NOT_FOUND",
        message: "The requested record was not found",
        statusCode: 404,
        type: "NotFoundError",
    },
    CONSTRAINT_VIOLATION: {
        code: "DB_CONSTRAINT_VIOLATION",
        message: "Database constraint violation",
        statusCode: 400,
        type: "ValidationError",
    },
};
// =============================================================================
// REDIS ERRORS (500, 503)
// =============================================================================
exports.REDIS_ERRORS = {
    CONNECTION_FAILED: {
        code: "REDIS_CONNECTION_FAILED",
        message: "Redis connection failed",
        statusCode: 503,
        type: "ExternalServiceError",
    },
    OPERATION_FAILED: {
        code: "REDIS_OPERATION_FAILED",
        message: "Redis operation failed",
        statusCode: 500,
        type: "ExternalServiceError",
    },
    CACHE_MISS: {
        code: "REDIS_CACHE_MISS",
        message: "Data not found in cache",
        statusCode: 404,
        type: "NotFoundError",
    },
    SESSION_EXPIRED: {
        code: "REDIS_SESSION_EXPIRED",
        message: "Session has expired",
        statusCode: 401,
        type: "AuthenticationError",
    },
};
// =============================================================================
// EXTERNAL SERVICE ERRORS (502, 503)
// =============================================================================
exports.EXTERNAL_SERVICE_ERRORS = {
    SUPABASE_ERROR: {
        code: "EXTERNAL_SUPABASE_ERROR",
        message: "Authentication service is temporarily unavailable",
        statusCode: 503,
        type: "ExternalServiceError",
    },
    STORAGE_ERROR: {
        code: "EXTERNAL_STORAGE_ERROR",
        message: "File storage service is temporarily unavailable",
        statusCode: 503,
        type: "ExternalServiceError",
    },
    EMAIL_SERVICE_ERROR: {
        code: "EXTERNAL_EMAIL_ERROR",
        message: "Email service is temporarily unavailable",
        statusCode: 503,
        type: "ExternalServiceError",
    },
    THIRD_PARTY_API_ERROR: {
        code: "EXTERNAL_API_ERROR",
        message: "External API service is temporarily unavailable",
        statusCode: 502,
        type: "ExternalServiceError",
    },
};
// =============================================================================
// RATE LIMITING ERRORS (429)
// =============================================================================
exports.RATE_LIMIT_ERRORS = {
    TOO_MANY_REQUESTS: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests. Please try again later",
        statusCode: 429,
        type: "RateLimitError",
    },
    TOO_MANY_LOGIN_ATTEMPTS: {
        code: "RATE_LIMIT_LOGIN_ATTEMPTS",
        message: "Too many login attempts. Please try again in 15 minutes",
        statusCode: 429,
        type: "RateLimitError",
    },
    TOO_MANY_OTP_REQUESTS: {
        code: "RATE_LIMIT_OTP_REQUESTS",
        message: "Too many OTP requests. Please wait before requesting another",
        statusCode: 429,
        type: "RateLimitError",
    },
};
// =============================================================================
// SERVER ERRORS (500)
// =============================================================================
exports.SERVER_ERRORS = {
    INTERNAL_SERVER_ERROR: {
        code: "SERVER_INTERNAL_ERROR",
        message: "An unexpected error occurred. Please try again later",
        statusCode: 500,
        type: "AppError",
    },
    SERVICE_UNAVAILABLE: {
        code: "SERVER_SERVICE_UNAVAILABLE",
        message: "Service is temporarily unavailable. Please try again later",
        statusCode: 503,
        type: "AppError",
    },
    MAINTENANCE_MODE: {
        code: "SERVER_MAINTENANCE",
        message: "Server is under maintenance. Please try again later",
        statusCode: 503,
        type: "AppError",
    },
};
// =============================================================================
// UTILITY FUNCTIONS FOR ERROR HANDLING
// =============================================================================
// =============================================================================
// ERROR CLASSES (to replace error.middleware.ts classes)
// =============================================================================
// Base application error class
class AppError extends Error {
    constructor(message, statusCode = 500, errorCode = "INTERNAL_ERROR", isOperational = true, details) {
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
    setRequestId(requestId) {
        this.requestId = requestId;
        return this;
    }
}
exports.AppError = AppError;
// Authentication errors
class AuthenticationError extends AppError {
    constructor(message = "Authentication failed", errorCode = "AUTH_FAILED", details) {
        super(message, 401, errorCode, true, details);
    }
}
exports.AuthenticationError = AuthenticationError;
// Authorization errors
class AuthorizationError extends AppError {
    constructor(message = "Access denied", errorCode = "ACCESS_DENIED", details) {
        super(message, 403, errorCode, true, details);
    }
}
exports.AuthorizationError = AuthorizationError;
// Validation errors
class ValidationError extends AppError {
    constructor(message = "Invalid input data", errorCode = "VALIDATION_ERROR", details) {
        super(message, 400, errorCode, true, details);
    }
}
exports.ValidationError = ValidationError;
// Bad request errors (400 - general client errors)
class BadRequestError extends AppError {
    constructor(message = "Bad request", errorCode = "BAD_REQUEST", details) {
        super(message, 400, errorCode, true, details);
    }
}
exports.BadRequestError = BadRequestError;
// Resource not found errors
class NotFoundError extends AppError {
    constructor(message = "Resource not found", errorCode = "NOT_FOUND", details) {
        super(message, 404, errorCode, true, details);
    }
}
exports.NotFoundError = NotFoundError;
// Conflict errors (duplicate resources, etc.)
class ConflictError extends AppError {
    constructor(message = "Resource conflict", errorCode = "CONFLICT", details) {
        super(message, 409, errorCode, true, details);
    }
}
exports.ConflictError = ConflictError;
// Rate limiting errors
class RateLimitError extends AppError {
    constructor(message = "Rate limit exceeded", errorCode = "RATE_LIMIT_EXCEEDED", details) {
        super(message, 429, errorCode, true, details);
    }
}
exports.RateLimitError = RateLimitError;
// Database errors
class DatabaseError extends AppError {
    constructor(message = "Database operation failed", errorCode = "DATABASE_ERROR", details) {
        super(message, 500, errorCode, true, details);
    }
}
exports.DatabaseError = DatabaseError;
// External service errors
class ExternalServiceError extends AppError {
    constructor(message = "External service error", errorCode = "EXTERNAL_SERVICE_ERROR", details) {
        super(message, 502, errorCode, true, details);
    }
}
exports.ExternalServiceError = ExternalServiceError;
// =============================================================================
// UTILITY FUNCTIONS FOR ERROR CREATION
// =============================================================================
/**
 * Creates an error object with the proper structure for throwing
 */
function createError(errorDef, details) {
    // Use the generic AppError class with all parameters
    return new AppError(errorDef.message, errorDef.statusCode, errorDef.code, true, details);
}
/**
 * Throws an error with the proper structure
 */
function throwError(errorDef, details) {
    throw createError(errorDef, details);
}
/**
 * Get the appropriate error class based on error type
 */
function getErrorClass(type) {
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
exports.ERROR_MESSAGES = {
    INVALID_CREDENTIALS: exports.AUTH_ERRORS.INVALID_CREDENTIALS.message,
    USER_NOT_FOUND: exports.USER_ERRORS.USER_NOT_FOUND.message,
    SIGNUP_FAILED: exports.AUTH_ERRORS.SIGNUP_FAILED.message,
    DB_ERROR: exports.DATABASE_ERRORS.QUERY_FAILED.message,
};
// =============================================================================
// EXPORTS FOR EASY IMPORTING
// =============================================================================
exports.ALL_ERRORS = {
    ...exports.AUTH_ERRORS,
    ...exports.AUTHORIZATION_ERRORS,
    ...exports.VALIDATION_ERRORS,
    ...exports.USER_ERRORS,
    ...exports.GAME_ERRORS,
    ...exports.LEADERBOARD_ERRORS,
    ...exports.FRIENDSHIP_ERRORS,
    ...exports.DATABASE_ERRORS,
    ...exports.REDIS_ERRORS,
    ...exports.EXTERNAL_SERVICE_ERRORS,
    ...exports.RATE_LIMIT_ERRORS,
    ...exports.SERVER_ERRORS,
};
