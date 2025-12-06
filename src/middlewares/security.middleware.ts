import { Request, Response, NextFunction } from "express";
import { logger, isError } from "../utils/logger";
import { prisma } from "../config/prisma";
import { redis as redisClient } from "../config/redis";
import {
  createError,
  AuthorizationError,
  RateLimitError,
  ValidationError,
} from "../constants/error";
import { AuthRequest } from "../types/auth.types";

/**
 * =============================================================================
 * ENHANCED SECURITY MIDDLEWARE - LABYRINTH COLLABORATION PLATFORM
 * =============================================================================
 *
 * Comprehensive security middleware suite for the Labyrinth platform providing:
 *
 * - Dynamic rate limiting based on user actions and endpoints
 * - Project-based access control and permissions
 * - API key validation for service-to-service communication
 * - Content validation and sanitization
 * - Activity monitoring and anomaly detection
 * - Resource ownership validation
 * - Collaboration permission checks
 *
 * =============================================================================
 */

// =============================================================================
// RATE LIMITING CONFIGURATIONS
// =============================================================================

/**
 * Dynamic rate limiting based on endpoint sensitivity
 */
export const createDynamicRateLimit = (config: {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}) => {
  return ((req: Request, res: Response, next: NextFunction) => {
    // Temporary rate limiting implementation
    next();
  }) as any;
};

// Specific rate limiters for different use cases
export const authRateLimit = createDynamicRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  message: "Too many authentication attempts, please try again later",
  skipSuccessfulRequests: true,
});

export const uploadRateLimit = createDynamicRateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // 20 uploads per 10 minutes
  message: "Upload rate limit exceeded",
});

export const apiRateLimit = createDynamicRateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: "API rate limit exceeded",
});

export const sensitiveActionRateLimit = createDynamicRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 sensitive actions per hour
  message: "Too many sensitive actions, please try again later",
});

// User-specific rate limiting
export const createUserRateLimit = (config: {
  windowMs: number;
  max: number;
  message?: string;
}) => {
  return createDynamicRateLimit({
    ...config,
    keyGenerator: (req: AuthRequest) => {
      return req.user?.id || req.ip || "anonymous";
    },
  });
};

// =============================================================================
// INPUT VALIDATION AND SANITIZATION
// =============================================================================

/**
 * Content security validator
 */
export const validateContent = (options: {
  maxLength?: number;
  allowHtml?: boolean;
  restrictedPatterns?: RegExp[];
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const content = req.body.content || req.body.message || req.body.description;

      if (content) {
        // Length validation
        if (options.maxLength && content.length > options.maxLength) {
          throw new ValidationError(
            `Content exceeds maximum length of ${options.maxLength} characters`,
            "CONTENT_TOO_LONG",
            { maxLength: options.maxLength, actualLength: content.length }
          );
        }

        // HTML validation
        if (!options.allowHtml && /<[^>]*>/g.test(content)) {
          throw new ValidationError("HTML content is not allowed", "HTML_NOT_ALLOWED");
        }

        // Restricted patterns check
        if (options.restrictedPatterns) {
          for (const pattern of options.restrictedPatterns) {
            if (pattern.test(content)) {
              throw new ValidationError(
                "Content contains restricted patterns",
                "RESTRICTED_CONTENT"
              );
            }
          }
        }

        // Basic XSS prevention
        const xssPatterns = [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /javascript:/gi,
          /on\w+\s*=/gi,
        ];

        for (const pattern of xssPatterns) {
          if (pattern.test(content)) {
            throw new ValidationError(
              "Content contains potentially dangerous scripts",
              "XSS_DETECTED"
            );
          }
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * File upload security validator
 */
export const validateFileUpload = (options: {
  allowedMimeTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      const file = req.file as Express.Multer.File | undefined;

      const uploadedFiles = files || (file ? [file] : []);

      if (uploadedFiles.length === 0) {
        return next();
      }

      // File count validation
      if (options.maxFiles && uploadedFiles.length > options.maxFiles) {
        throw new ValidationError(`Maximum ${options.maxFiles} files allowed`, "TOO_MANY_FILES", {
          maxFiles: options.maxFiles,
          actualFiles: uploadedFiles.length,
        });
      }

      // Validate each file
      for (const uploadedFile of uploadedFiles) {
        // MIME type validation
        if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(uploadedFile.mimetype)) {
          throw new ValidationError(
            `File type ${uploadedFile.mimetype} is not allowed`,
            "INVALID_FILE_TYPE",
            { allowedTypes: options.allowedMimeTypes, actualType: uploadedFile.mimetype }
          );
        }

        // File size validation
        if (options.maxFileSize && uploadedFile.size > options.maxFileSize) {
          throw new ValidationError(
            `File size exceeds maximum of ${options.maxFileSize} bytes`,
            "FILE_TOO_LARGE",
            { maxSize: options.maxFileSize, actualSize: uploadedFile.size }
          );
        }

        // Filename sanitization
        const dangerousChars = /[<>:"|?*\x00-\x1f]/g;
        if (dangerousChars.test(uploadedFile.originalname)) {
          throw new ValidationError("Filename contains dangerous characters", "DANGEROUS_FILENAME");
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// =============================================================================
// ACCESS CONTROL AND PERMISSIONS
// =============================================================================

/**
 * Project ownership validator
 */
export const validateProjectOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const projectId = req.params.projectId || req.body.projectId;
    const userId = req.user!.id;

    if (!projectId) {
      throw new ValidationError("Project ID is required", "MISSING_PROJECT_ID");
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: {
          userId: userId,
        },
      },
    });

    if (!project) {
      throw new AuthorizationError(
        "Access denied: You don't own this project",
        "PROJECT_ACCESS_DENIED",
        { projectId, userId }
      );
    }

    // Attach project to request for use in controllers
    (req as any).project = project;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Project collaboration validator (for non-owners who have access)
 */
export const validateProjectCollaboration = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const projectId = req.params.projectId || req.body.projectId;
    const userId = req.user!.id;

    if (!projectId) {
      throw new ValidationError("Project ID is required", "MISSING_PROJECT_ID");
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          {
            workspace: {
              userId: userId,
            },
          },
          {
            collaborators: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
      include: {
        workspace: true,
        collaborators: true,
      },
    });

    if (!project) {
      throw new AuthorizationError(
        "Access denied: You don't have access to this project",
        "PROJECT_ACCESS_DENIED",
        { projectId, userId }
      );
    }

    // Attach project and user role to request
    const isOwner = project.workspace.userId === userId;
    const isCollaborator = project.collaborators.some((collaborator) => collaborator.id === userId);

    (req as any).project = project;
    (req as any).projectRole = isOwner ? "owner" : isCollaborator ? "collaborator" : null;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Resource ownership validator (generic)
 */
export const validateResourceOwnership = (resourceName: string, idField: string = "id") => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resourceId = req.params[idField] || req.body[idField];
      const userId = req.user!.id;

      if (!resourceId) {
        throw new ValidationError(`${resourceName} ID is required`, "MISSING_RESOURCE_ID");
      }

      // Cache key for resource ownership
      const cacheKey = `resource:${resourceName}:${resourceId}:owner`;
      const cachedOwner = await redisClient.get(cacheKey);

      let ownerId: string;

      if (cachedOwner) {
        ownerId = cachedOwner;
      } else {
        // Dynamically query the appropriate table
        const tableName = resourceName.toLowerCase();
        const resource = await (prisma as any)[tableName].findUnique({
          where: { id: resourceId },
          select: { uploadedBy: true, userId: true, createdBy: true }, // Try common owner fields
        });

        if (!resource) {
          throw new ValidationError(`${resourceName} not found`, "RESOURCE_NOT_FOUND");
        }

        ownerId = resource.uploadedBy || resource.userId || resource.createdBy;

        if (ownerId) {
          // Cache for 5 minutes
          await redisClient.setex(cacheKey, 300, ownerId);
        }
      }

      if (!ownerId || ownerId !== userId) {
        throw new AuthorizationError(
          `Access denied: You don't own this ${resourceName}`,
          "RESOURCE_ACCESS_DENIED",
          { resourceName, resourceId, userId }
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// =============================================================================
// ACTIVITY MONITORING
// =============================================================================

/**
 * Activity logging middleware
 */
export const logActivity = (action: string, sensitive: boolean = false) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const metadata = {
        ip: req.ip,
        userAgent: req.get("user-agent"),
        method: req.method,
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
      };

      // Log to Redis for real-time monitoring
      const activityKey = `activity:${userId}:${Date.now()}`;
      await redisClient.setex(
        activityKey,
        86400,
        JSON.stringify({
          action,
          sensitive,
          ...metadata,
        })
      ); // Keep for 24 hours

      // For sensitive actions, also log to database
      if (sensitive && userId) {
        // This would be implemented with a dedicated audit log table
        logger.info("Sensitive action performed", {
          userId,
          action,
          ...metadata,
        });
      }

      next();
    } catch (error) {
      // Don't fail the request if activity logging fails
      logger.error("Failed to log activity:", isError(error) ? error : new Error(String(error)));
      next();
    }
  };
};

/**
 * Anomaly detection middleware
 */
export const detectAnomalies = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next();
    }

    const now = Date.now();
    const windowMs = 60000; // 1 minute window
    const requestKey = `requests:${userId}:${Math.floor(now / windowMs)}`;

    const requestCount = await redisClient.incr(requestKey);
    await redisClient.expire(requestKey, 60);

    // Threshold for suspicious activity (configurable)
    const suspiciousThreshold = parseInt(process.env.ANOMALY_THRESHOLD || "50");

    if (requestCount > suspiciousThreshold) {
      logger.warn("Suspicious activity detected", {
        userId,
        requestCount,
        threshold: suspiciousThreshold,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      });

      // Could trigger additional security measures here
      // For now, just continue with increased logging
    }

    next();
  } catch (error) {
    // Don't fail the request if anomaly detection fails
    logger.error("Anomaly detection error:", isError(error) ? error : new Error(String(error)));
    next();
  }
};

// =============================================================================
// API KEY VALIDATION (for service-to-service communication)
// =============================================================================

/**
 * API key validation middleware for internal services
 */
export const validateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.headers["x-api-key"] as string;

    if (!apiKey) {
      throw new AuthorizationError("API key required", "MISSING_API_KEY");
    }

    // In production, you'd validate against a secure store
    const validApiKeys = process.env.VALID_API_KEYS?.split(",") || [];

    if (!validApiKeys.includes(apiKey)) {
      throw new AuthorizationError("Invalid API key", "INVALID_API_KEY");
    }

    // Mark request as API-authenticated
    (req as any).isApiAuthenticated = true;
    next();
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// COMPOSITE MIDDLEWARE BUILDERS
// =============================================================================

/**
 * Create comprehensive security stack for sensitive endpoints
 */
export const createSecureEndpoint = (options: {
  requireAuth?: boolean;
  rateLimit?: any;
  validateOwnership?: string;
  logActivity?: string;
  validateContent?: boolean;
}) => {
  const middleware: any[] = [];

  // Rate limiting
  if (options.rateLimit) {
    middleware.push(options.rateLimit);
  }

  // Authentication is handled by authMiddleware separately

  // Content validation
  if (options.validateContent) {
    middleware.push(validateContent({ maxLength: 10000 }));
  }

  // Resource ownership validation
  if (options.validateOwnership) {
    middleware.push(validateResourceOwnership(options.validateOwnership));
  }

  // Activity logging
  if (options.logActivity) {
    middleware.push(logActivity(options.logActivity, true));
  }

  // Anomaly detection
  middleware.push(detectAnomalies);

  return middleware;
};

/**
 * Project-specific security middleware
 */
export const createProjectSecurityStack = (requireOwnership: boolean = false) => {
  return [
    apiRateLimit,
    requireOwnership ? validateProjectOwnership : validateProjectCollaboration,
    logActivity("project_access"),
    detectAnomalies,
  ];
};

export default {
  authRateLimit,
  uploadRateLimit,
  apiRateLimit,
  sensitiveActionRateLimit,
  createUserRateLimit,
  validateContent,
  validateFileUpload,
  validateProjectOwnership,
  validateProjectCollaboration,
  validateResourceOwnership,
  logActivity,
  detectAnomalies,
  validateApiKey,
  createSecureEndpoint,
  createProjectSecurityStack,
};
