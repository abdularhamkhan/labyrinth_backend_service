import { Request } from "express";

/**
 * =============================================================================
 * AUTHENTICATION TYPE DEFINITIONS
 * =============================================================================
 *
 * This file contains all type definitions related to authentication,
 * including extended Request interfaces and user authentication data.
 *
 * =============================================================================
 */

/**
 * User data attached to authenticated requests
 */
export interface AuthUser {
  id: string;
  email: string;
  aud: string;
  role: string;
  isAnonymous: boolean;
}

/**
 * Extended Request interface that includes authenticated user data.
 * This is used by routes that require authentication.
 */
export interface AuthRequest extends Request {
  user?: AuthUser;
}

/**
 * JWT payload structure for token verification
 */
export interface JWTPayload {
  sub: string; // user ID
  email?: string;
  aud: string;
  role: string;
  iat: number;
  exp: number;
  iss?: string;
  session_id?: string;
  token_type?: "access" | "refresh";
}

/**
 * Authentication response structure
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  token?: string;
  error?: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

/**
 * Password reset request payload
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password update request payload
 */
export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}