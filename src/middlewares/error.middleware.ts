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
    // Zod validation errors
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";
    message = "Invalid input data";

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
    // Prisma database errors
    statusCode = 500;
    errorCode = "DATABASE_ERROR";
    message = "Database operation failed";

    // Handle specific Prisma error codes
    const prismaError = error as any;
    if (prismaError.code === "P2002") {
      statusCode = 409;
      errorCode = "DUPLICATE_ENTRY";
      message = "A record with this information already exists";
    } else if (prismaError.code === "P2025") {
      statusCode = 404;
      errorCode = "RECORD_NOT_FOUND";
      message = "The requested record was not found";
    }
  } else if (error.name === "JsonWebTokenError") {
    // JWT errors
    statusCode = 401;
    errorCode = "INVALID_TOKEN";
    message = "Invalid authentication token";
  } else if (error.name === "TokenExpiredError") {
    // JWT expiration errors
    statusCode = 401;
    errorCode = "TOKEN_EXPIRED";
    message = "Authentication token has expired";
  } else if (error.name === "SyntaxError" && error.message.includes("JSON")) {
    // JSON parsing errors
    statusCode = 400;
    errorCode = "INVALID_JSON";
    message = "Invalid JSON in request body";
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
