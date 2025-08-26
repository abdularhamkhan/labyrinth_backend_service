/**
 * =============================================================================
 * REDIS SESSION MANAGEMENT - User Sessions and Authentication
 * =============================================================================
 *
 * This module handles storing and retrieving user session information in Redis,
 * providing fast access and efficient management for active user sessions.
 *
 * Features:
 * - Efficient session storage with expiration
 * - Quick retrieval of session data
 * - Support for concurrent sessions with unique tokens
 * - Ability to terminate sessions remotely
 *
 * =============================================================================
 */

import { sessionRedis } from "../config/redis.production.config";

// =============================================================================
// SESSION INTERFACES
// =============================================================================

interface UserSession {
  userId: string;
  sessionToken: string;
  deviceInfo?: string;
  lastActivity: number;
  expiresAt: number;
}

// =============================================================================
// SESSION MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Create a new session in Redis
 */
export async function createSession(session: UserSession): Promise<void> {
  const { sessionToken, expiresAt, ...sessionData } = session;
  const ttl = Math.floor((expiresAt - Date.now()) / 1000);

  await sessionRedis.setex(`session:${sessionToken}`, ttl, JSON.stringify(sessionData));
  console.log(`✅ Created session for user ${session.userId}`);
}

/**
 * Retrieve a session from Redis using session token
 */
export async function getSession(sessionToken: string): Promise<UserSession | null> {
  const sessionData = await sessionRedis.get(`session:${sessionToken}`);
  return sessionData ? JSON.parse(sessionData) : null;
}

/**
 * Update a session's last activity timestamp
 */
export async function updateSessionActivity(sessionToken: string): Promise<void> {
  const session = await getSession(sessionToken);
  if (!session) return;

  session.lastActivity = Date.now();
  await createSession({ ...session, sessionToken });
}

/**
 * Terminate a session in Redis
 */
export async function terminateSession(sessionToken: string): Promise<void> {
  await sessionRedis.del(`session:${sessionToken}`);
  console.log(`🛑 Terminated session with token ${sessionToken}`);
}

/**
 * Check if a session is still valid
 */
export async function isSessionValid(sessionToken: string): Promise<boolean> {
  const session = await getSession(sessionToken);
  return !!session && session.expiresAt > Date.now();
}
