"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalServiceError = exports.DatabaseError = exports.RateLimitError = exports.ConflictError = exports.NotFoundError = exports.ValidationError = exports.AuthorizationError = exports.AuthenticationError = exports.AppError = exports.asyncHandler = exports.notFoundHandler = exports.requestIdMiddleware = exports.errorHandler = void 0;
const zod_1 = require("zod");
const error_1 = require("../constants/error");
Object.defineProperty(exports, "AppError", { enumerable: true, get: function () { return error_1.AppError; } });
Object.defineProperty(exports, "AuthenticationError", { enumerable: true, get: function () { return error_1.AuthenticationError; } });
Object.defineProperty(exports, "AuthorizationError", { enumerable: true, get: function () { return error_1.AuthorizationError; } });
Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function () { return error_1.ValidationError; } });
Object.defineProperty(exports, "NotFoundError", { enumerable: true, get: function () { return error_1.NotFoundError; } });
Object.defineProperty(exports, "ConflictError", { enumerable: true, get: function () { return error_1.ConflictError; } });
Object.defineProperty(exports, "RateLimitError", { enumerable: true, get: function () { return error_1.RateLimitError; } });
Object.defineProperty(exports, "DatabaseError", { enumerable: true, get: function () { return error_1.DatabaseError; } });
Object.defineProperty(exports, "ExternalServiceError", { enumerable: true, get: function () { return error_1.ExternalServiceError; } });
/**
 * =============================================================================
 * CENTRALIZED ERROR HANDLING MIDDLEWARE
 * =============================================================================
 *
 * This middleware provides comprehensive error handling for the entire application:
 * - Uses unified error classes from constants/error.ts
 * - Structured error responses with proper HTTP status codes
 * - Request ID tracking for debugging
 * - Security-conscious error messages (no sensitive data exposure)
 * - Integration with monitoring and logging systems
 * - Development vs Production error detail levels
 *
 * =============================================================================
 */
// Environment check
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";
/**
 * =============================================================================
 * UTILITY FUNCTIONS
 * =============================================================================
 */
// Generate unique request ID
function generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
// Sanitize error details for production
function sanitizeErrorDetails(details) {
    if (isProduction) {
        // In production, remove sensitive information
        if (typeof details === "object" && details !== null) {
            const sanitized = { ...details };
            // Remove common sensitive fields
            delete sanitized.password;
            delete sanitized.token;
            delete sanitized.secret;
            delete sanitized.key;
            delete sanitized.apiKey;
            delete sanitized.connectionString;
            return sanitized;
        }
        return undefined;
    }
    return details;
}
// Log error for monitoring
function logError(error, req, requestId) {
    const errorLog = {
        requestId,
        timestamp: new Date().toISOString(),
        error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
        },
        request: {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userAgent: req.get("user-agent"),
            userId: req.user?.id,
        },
    };
    // In production, you would send this to your logging service
    // (e.g., Winston, Datadog, Sentry, etc.)
    if (isDevelopment) {
        console.error("🚨 ERROR LOGGED:", JSON.stringify(errorLog, null, 2));
    }
    else {
        console.error("ERROR:", JSON.stringify(errorLog));
    }
    // TODO: Send to external monitoring service
    // Examples:
    // - Sentry.captureException(error, { extra: errorLog });
    // - logger.error(errorLog);
    // - metrics.increment('api.errors', { status: error.statusCode });
}
/**
 * =============================================================================
 * MAIN ERROR HANDLING MIDDLEWARE
 * =============================================================================
 */
const errorHandler = (error, req, res, next) => {
    // Generate request ID if not already present
    const requestId = req.requestId || generateRequestId();
    // Set request ID for tracking
    if (error instanceof error_1.AppError && !error.requestId) {
        error.setRequestId(requestId);
    }
    // Log the error
    logError(error, req, requestId);
    // Handle different error types
    let statusCode = 500;
    let errorCode = "INTERNAL_ERROR";
    let message = "An unexpected error occurred";
    let details = undefined;
    if (error instanceof error_1.AppError) {
        // Custom application errors
        statusCode = error.statusCode;
        errorCode = error.errorCode;
        message = error.message;
        details = sanitizeErrorDetails(error.details);
    }
    else if (error.name === "ValidationError" || error.name === "ZodError") {
        // Zod validation errors
        statusCode = 400;
        errorCode = "VALIDATION_ERROR";
        message = "Invalid input data";
        if (error instanceof zod_1.z.ZodError) {
            details = isDevelopment
                ? {
                    issues: error.issues.map((issue) => ({
                        path: issue.path.join("."),
                        message: issue.message,
                        code: issue.code,
                    })),
                }
                : undefined;
        }
    }
    else if (error.name === "PrismaClientKnownRequestError") {
        // Prisma database errors
        statusCode = 500;
        errorCode = "DATABASE_ERROR";
        message = "Database operation failed";
        // Handle specific Prisma error codes
        const prismaError = error;
        if (prismaError.code === "P2002") {
            statusCode = 409;
            errorCode = "DUPLICATE_ENTRY";
            message = "A record with this information already exists";
        }
        else if (prismaError.code === "P2025") {
            statusCode = 404;
            errorCode = "RECORD_NOT_FOUND";
            message = "The requested record was not found";
        }
    }
    else if (error.name === "JsonWebTokenError") {
        // JWT errors
        statusCode = 401;
        errorCode = "INVALID_TOKEN";
        message = "Invalid authentication token";
    }
    else if (error.name === "TokenExpiredError") {
        // JWT expiration errors
        statusCode = 401;
        errorCode = "TOKEN_EXPIRED";
        message = "Authentication token has expired";
    }
    else if (error.name === "SyntaxError" && error.message.includes("JSON")) {
        // JSON parsing errors
        statusCode = 400;
        errorCode = "INVALID_JSON";
        message = "Invalid JSON in request body";
    }
    // Build error response
    const errorResponse = {
        success: false,
        error: {
            message,
            code: errorCode,
            status: statusCode,
            timestamp: new Date().toISOString(),
            requestId,
            ...(details && { details }),
            ...(isDevelopment && error.stack && { stack: error.stack }),
        },
    };
    // Send error response
    res.status(statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
/**
 * =============================================================================
 * REQUEST ID MIDDLEWARE
 * =============================================================================
 */
const requestIdMiddleware = (req, res, next) => {
    const requestId = generateRequestId();
    req.requestId = requestId;
    res.setHeader("X-Request-ID", requestId);
    next();
};
exports.requestIdMiddleware = requestIdMiddleware;
/**
 * =============================================================================
 * NOT FOUND MIDDLEWARE
 * =============================================================================
 */
const notFoundHandler = (req, res, next) => {
    const error = new error_1.NotFoundError(`Route ${req.method} ${req.originalUrl} not found`, "ROUTE_NOT_FOUND", {
        method: req.method,
        path: req.originalUrl,
        availableRoutes: [
            "GET /",
            "POST /api/auth/register",
            "POST /api/auth/login",
            "POST /api/auth/verify-otp",
            "GET /api/user/profile",
            "PUT /api/user/profile",
            "GET /api/app/leaderboard",
        ],
    });
    next(error);
};
exports.notFoundHandler = notFoundHandler;
/**
 * =============================================================================
 * ASYNC ERROR WRAPPER
 * =============================================================================
 */
// Wrapper for async route handlers to catch errors automatically
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
/**
 * =============================================================================
 * USAGE EXAMPLES
 * =============================================================================
 *
 * 1. IN APP.TS:
 *    import { errorHandler, notFoundHandler, requestIdMiddleware } from './middlewares/error.middleware';
 *
 *    app.use(requestIdMiddleware);
 *    // ... other middleware and routes
 *    app.use(notFoundHandler);
 *    app.use(errorHandler);
 *
 * 2. IN CONTROLLERS:
 *    import { ValidationError, NotFoundError } from '../middlewares/error.middleware';
 *
 *    if (!user) {
 *      throw new NotFoundError('User not found', 'USER_NOT_FOUND', { userId });
 *    }
 *
 * 3. WITH ASYNC WRAPPER:
 *    import { asyncHandler } from '../middlewares/error.middleware';
 *
 *    router.get('/users', asyncHandler(async (req, res) => {
 *      const users = await getUsersFromDB();
 *      res.json(users);
 *    }));
 *
 * =============================================================================
 */
