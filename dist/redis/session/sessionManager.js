"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = createSession;
exports.getSession = getSession;
exports.updateSessionActivity = updateSessionActivity;
exports.terminateSession = terminateSession;
exports.isSessionValid = isSessionValid;
const redis_production_config_1 = require("../config/redis.production.config");
// =============================================================================
// SESSION MANAGEMENT FUNCTIONS
// =============================================================================
/**
 * Create a new session in Redis
 */
async function createSession(session) {
    const { sessionToken, expiresAt, ...sessionData } = session;
    const ttl = Math.floor((expiresAt - Date.now()) / 1000);
    await redis_production_config_1.sessionRedis.setex(`session:${sessionToken}`, ttl, JSON.stringify(sessionData));
    console.log(`✅ Created session for user ${session.userId}`);
}
/**
 * Retrieve a session from Redis using session token
 */
async function getSession(sessionToken) {
    const sessionData = await redis_production_config_1.sessionRedis.get(`session:${sessionToken}`);
    return sessionData ? JSON.parse(sessionData) : null;
}
/**
 * Update a session's last activity timestamp
 */
async function updateSessionActivity(sessionToken) {
    const session = await getSession(sessionToken);
    if (!session)
        return;
    session.lastActivity = Date.now();
    await createSession({ ...session, sessionToken });
}
/**
 * Terminate a session in Redis
 */
async function terminateSession(sessionToken) {
    await redis_production_config_1.sessionRedis.del(`session:${sessionToken}`);
    console.log(`🛑 Terminated session with token ${sessionToken}`);
}
/**
 * Check if a session is still valid
 */
async function isSessionValid(sessionToken) {
    const session = await getSession(sessionToken);
    return !!session && session.expiresAt > Date.now();
}
