import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  ExternalServiceError,
  AUTH_ERRORS,
  VALIDATION_ERRORS,
  DATABASE_ERRORS,
  REDIS_ERRORS,
  EXTERNAL_SERVICE_ERRORS,
} from "../constants/error";

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
 * ERROR RESPONSE INTERFACE
 * =============================================================================
 */

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
    timestamp: string;
    requestId?: string;
    details?: any;
    stack?: string; // Only in development
  };
}

/**
 * =============================================================================
 * UTILITY FUNCTIONS
 * =============================================================================
 */

// Generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Sanitize error details for production
function sanitizeErrorDetails(details: any): any {
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
function logError(error: Error, req: Request, requestId: string) {
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
      userId: (req as any).user?.id,
    },
  };

  // In production, you would send this to your logging service
  // (e.g., Winston, Datadog, Sentry, etc.)
  if (isDevelopment) {
    console.error("🚨 ERROR LOGGED:", JSON.stringify(errorLog, null, 2));
  } else {
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

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Generate request ID if not already present
  const requestId = (req as any).requestId || generateRequestId();

  // Set request ID for tracking
  if (error instanceof AppError && !error.requestId) {
    error.setRequestId(requestId);
  }

  // Log the error
  logError(error, req, requestId);

  // Handle different error types
  let statusCode = 500;
  let errorCode = "INTERNAL_ERROR";
  let message = "An unexpected error occurred";
  let details: any = undefined;

  if (error instanceof AppError) {
    // Custom application errors
    statusCode = error.statusCode;
    errorCode = error.errorCode;
    message = error.message;
    details = sanitizeErrorDetails(error.details);
  } else if (error.name === "ValidationError" || error.name === "ZodError") {
    // Zod validation errors - Use constants
    statusCode = VALIDATION_ERRORS.INVALID_INPUT.statusCode;
    errorCode = VALIDATION_ERRORS.INVALID_INPUT.code;
    message = VALIDATION_ERRORS.INVALID_INPUT.message;

    if (error instanceof z.ZodError) {
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
  } else if (error.name === "PrismaClientKnownRequestError") {
    // Prisma database errors - Use constants
    const prismaError = error as any;
    if (prismaError.code === "P2002") {
      statusCode = DATABASE_ERRORS.DUPLICATE_ENTRY.statusCode;
      errorCode = DATABASE_ERRORS.DUPLICATE_ENTRY.code;
      message = DATABASE_ERRORS.DUPLICATE_ENTRY.message;
    } else if (prismaError.code === "P2025") {
      statusCode = DATABASE_ERRORS.RECORD_NOT_FOUND.statusCode;
      errorCode = DATABASE_ERRORS.RECORD_NOT_FOUND.code;
      message = DATABASE_ERRORS.RECORD_NOT_FOUND.message;
    } else {
      statusCode = DATABASE_ERRORS.QUERY_FAILED.statusCode;
      errorCode = DATABASE_ERRORS.QUERY_FAILED.code;
      message = DATABASE_ERRORS.QUERY_FAILED.message;
    }
  } else if (error.name === "JsonWebTokenError") {
    // JWT errors - Use constants
    statusCode = AUTH_ERRORS.TOKEN_INVALID.statusCode;
    errorCode = AUTH_ERRORS.TOKEN_INVALID.code;
    message = AUTH_ERRORS.TOKEN_INVALID.message;
  } else if (error.name === "TokenExpiredError") {
    // JWT expiration errors - Use constants
    statusCode = AUTH_ERRORS.TOKEN_EXPIRED.statusCode;
    errorCode = AUTH_ERRORS.TOKEN_EXPIRED.code;
    message = AUTH_ERRORS.TOKEN_EXPIRED.message;
  } else if (error.name === "SyntaxError" && error.message.includes("JSON")) {
    // JSON parsing errors - Use constants
    statusCode = VALIDATION_ERRORS.INVALID_JSON.statusCode;
    errorCode = VALIDATION_ERRORS.INVALID_JSON.code;
    message = VALIDATION_ERRORS.INVALID_JSON.message;
  } else if (error.message && error.message.includes("Redis")) {
    // Redis errors - Use constants
    statusCode = REDIS_ERRORS.OPERATION_FAILED.statusCode;
    errorCode = REDIS_ERRORS.OPERATION_FAILED.code;
    message = REDIS_ERRORS.OPERATION_FAILED.message;
    details = isDevelopment ? { originalError: error.message } : undefined;
  }

  // Build error response
  const errorResponse: ErrorResponse = {
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

/**
 * =============================================================================
 * REQUEST ID MIDDLEWARE
 * =============================================================================
 */

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = generateRequestId();
  (req as any).requestId = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
};

/**
 * =============================================================================
 * NOT FOUND MIDDLEWARE
 * =============================================================================
 */

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new NotFoundError(
    `Route ${req.method} ${req.originalUrl} not found`,
    "ROUTE_NOT_FOUND",
    {
      method: req.method,
      path: req.originalUrl,
      availableRoutes: [
        "GET /",
        "POST /api/auth/signup",
        "POST /api/auth/login",
        "POST /api/auth/verify-otp",
        "GET /api/user/profile",
        "PUT /api/user/profile",
        "GET /api/app/leaderboard",
      ],
    }
  );
  next(error);
};

/**
 * =============================================================================
 * ASYNC ERROR WRAPPER
 * =============================================================================
 */

// Wrapper for async route handlers to catch errors automatically
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * =============================================================================
 * EXPORT ALL ERROR CLASSES AND UTILITIES
 * =============================================================================
 */

export {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  ExternalServiceError,
};

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
