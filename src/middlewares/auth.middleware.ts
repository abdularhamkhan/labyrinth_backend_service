import { Request, Response, NextFunction } from "express";
import supabase from "../config/supabase";
import { AuthRequest } from "../types/auth.types";

/**
 * =============================================================================
 * AUTH MIDDLEWARE - SUPABASE JWT TOKEN VERIFICATION
 * =============================================================================
 *
 * Purpose: Protect routes by verifying Supabase JWT tokens
 * Usage: Add to routes that require authentication
 *
 * Flow:
 * 1. Extract token from Authorization header
 * 2. Verify token with Supabase
 * 3. Attach user data to request object
 * 4. Allow request to continue to protected route
 *
 * Example Usage:
 * router.get('/profile', authenticateUser, getUserProfile);
 * router.put('/profile', authenticateUser, updateUserProfile);
 *
 * =============================================================================
 */

// Using centralized AuthRequest type from types/auth.types

/**
 * =============================================================================
 * MAIN AUTHENTICATION MIDDLEWARE
 * =============================================================================
 *
 * This middleware REQUIRES a valid JWT token to proceed.
 * If no token or invalid token, it returns 401 Unauthorized.
 *
 * Use this for routes that MUST have an authenticated user.
 *
 * @param req - Express request object (extended with user property)
 * @param res - Express response object
 * @param next - Express next function to continue to next middleware/controller
 */
export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Extract Authorization header
    const authHeader = req.headers.authorization;

    // Validate header format: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided or invalid format.",
        error: "MISSING_OR_INVALID_AUTH_HEADER",
        expected: "Authorization: Bearer <jwt_token>",
      });
    }

    // Extract JWT token from header
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix (7 characters)

    // Verify token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    // Handle verification errors
    if (error) {
      return res.status(401).json({
        message: "Invalid or expired token.",
        error: "TOKEN_VERIFICATION_FAILED",
        details: error.message,
      });
    }

    // Handle case where no error but no user returned
    if (!user) {
      return res.status(401).json({
        message: "Invalid token - no user found.",
        error: "NO_USER_FOUND",
      });
    }

    // Attach user data to request object
    req.user = {
      id: user.id,
      email: user.email || "",
      aud: user.aud || "authenticated",
      role: user.role || "authenticated",
      isAnonymous: user.is_anonymous || false,
    };

    // Continue to protected route
    next();
  } catch (middlewareError) {
    // Handle unexpected errors in middleware
    return res.status(500).json({
      message: "Authentication service error.",
      error: "INTERNAL_AUTH_ERROR",
    });
  }
};

/**
 * =============================================================================
 * OPTIONAL AUTHENTICATION MIDDLEWARE
 * =============================================================================
 *
 * This middleware attempts to authenticate but doesn't fail if no token.
 * If token exists and is valid, it attaches user data to request.
 * If no token or invalid token, it continues without user data.
 *
 * Use this for routes that can work with or without authentication.
 * Example: Public posts that show different content for logged-in users.
 *
 * @param req - Express request object (extended with user property)
 * @param res - Express response object
 * @param next - Express next function to continue to next middleware/controller
 */
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(); // Continue without user data
    }

    // Try to authenticate if token exists
    const token = authHeader.substring(7);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (!error && user) {
      // Authentication successful - attach user data
      req.user = {
        id: user.id,
        email: user.email || "",
        aud: user.aud || "authenticated",
        role: user.role || "authenticated",
        isAnonymous: user.is_anonymous || false,
      };
    }

    next();
  } catch (optionalAuthError) {
    // Continue without user data even on error
    next();
  }
};

/**
 * =============================================================================
 * ROLE-BASED AUTHENTICATION MIDDLEWARE
 * =============================================================================
 *
 * This middleware requires authentication AND checks for specific roles.
 * Use this for admin-only routes or role-specific features.
 *
 * @param allowedRoles - Array of roles that can access the route
 * @returns Middleware function
 */
export const requireRole = (allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // First, ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required for role-based access.",
        error: "NO_USER_DATA",
      });
    }

    // Check if user's role is in allowed roles
    const userRole = req.user.role;
    const hasPermission = allowedRoles.includes(userRole);

    if (!hasPermission) {
      return res.status(403).json({
        message: "Insufficient permissions for this resource.",
        error: "INSUFFICIENT_PERMISSIONS",
        required: allowedRoles,
        current: userRole,
      });
    }

    next();
  };
};

// Note: AuthRequest type is imported from types/auth.types
// This provides centralized type definitions for authenticated requests

// Main auth middleware alias (used throughout the application)
export const authMiddleware = authenticateUser;

/**
 * =============================================================================
 * USAGE EXAMPLES
 * =============================================================================
 *
 * 1. REQUIRED AUTHENTICATION:
 *    router.get('/profile', authenticateUser, getUserProfile);
 *    router.put('/settings', authenticateUser, updateSettings);
 *
 * 2. OPTIONAL AUTHENTICATION:
 *    router.get('/posts', optionalAuth, getPublicPosts);
 *    router.get('/feed', optionalAuth, getFeed);
 *
 * 3. ROLE-BASED ACCESS:
 *    router.get('/admin', authenticateUser, requireRole(['admin']), adminDashboard);
 *    router.delete('/users/:id', authenticateUser, requireRole(['admin', 'moderator']), deleteUser);
 *
 * 4. IN CONTROLLER:
 *    import { AuthRequest } from '../types/auth.types';
 *
 *    const getUserProfile = async (req: AuthRequest, res: Response) => {
 *        const userId = req.user!.id; // TypeScript knows user exists
 *        const userEmail = req.user!.email;
 *        // ... controller logic
 *    };
 *
 * =============================================================================
 */
