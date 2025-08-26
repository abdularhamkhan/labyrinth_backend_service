"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const app_1 = __importDefault(require("./app"));
require("./config/redis");
const env_1 = require("./config/env");
/**
 * =============================================================================
 * SERVER SETUP - HTTP + WEBSOCKET SERVER
 * =============================================================================
 *
 * This file sets up the main server infrastructure with:
 * - HTTP server for REST API endpoints
 * - WebSocket server for real-time communication
 * - Redis configuration loading
 * - Environment-based port configuration
 *
 * Architecture:
 * - HTTP Server: Handles REST API requests (auth, user management)
 * - WebSocket Server: Handles real-time game communication
 * - Redis: Session storage and caching (loaded via import)
 *
 * Usage:
 * - Development: npm run dev
 * - Production: npm start
 *
 * =============================================================================
 */
// =============================================================================
// SERVER CONFIGURATION
// =============================================================================
// Port configuration
const PORT = env_1.ENV.port;
// Create HTTP server using the Express app
// This handles all REST API endpoints defined in app.ts
const server = http_1.default.createServer(app_1.default);
// Create WebSocket server attached to HTTP server
// Path: /ws - Used for real-time game communication
const web_socket_server = new ws_1.WebSocketServer({
    server,
    path: "/ws",
});
// =============================================================================
// WEBSOCKET EVENT HANDLERS
// =============================================================================
/**
 * WebSocket Connection Handler
 *
 * Triggered when a new client connects to the WebSocket server.
 * Sends welcome message and sets up client-specific event handlers.
 *
 * Usage: Frontend connects to ws://localhost:3000/ws
 */
web_socket_server.on("connection", (ws) => {
    console.log("=== NEW WEBSOCKET CONNECTION ===");
    console.log("WebSocket connection established:", {
        readyState: ws.readyState,
        timestamp: new Date().toISOString(),
    });
    // Send welcome message to newly connected client
    const welcomeMessage = {
        type: "connection",
        message: "Welcome to With A Twist!",
        timestamp: new Date().toISOString(),
    };
    ws.send(JSON.stringify(welcomeMessage));
    console.log("Welcome message sent to client");
    // Set up client disconnection handler
    ws.on("close", () => {
        console.log("=== WEBSOCKET CONNECTION CLOSED ===");
        console.log("Client disconnected:", {
            timestamp: new Date().toISOString(),
        });
    });
    // Set up error handler
    ws.on("error", (error) => {
        console.error("=== WEBSOCKET ERROR ===");
        console.error("WebSocket error:", {
            error: error.message,
            timestamp: new Date().toISOString(),
        });
    });
    // Set up message handler for incoming messages
    ws.on("message", (message) => {
        console.log("=== WEBSOCKET MESSAGE RECEIVED ===");
        try {
            const parsedMessage = JSON.parse(message.toString());
            console.log("Received message:", {
                type: parsedMessage.type,
                timestamp: new Date().toISOString(),
            });
            // Handle different message types here
            // Example: game moves, chat messages, etc.
        }
        catch (error) {
            console.error("Failed to parse WebSocket message:", {
                error: error instanceof Error ? error.message : "Unknown error",
                rawMessage: message.toString(),
            });
        }
    });
});
// =============================================================================
// SERVER STARTUP
// =============================================================================
/**
 * Start the HTTP + WebSocket server
 *
 * This starts both the REST API server and WebSocket server on the same port.
 * The server will be accessible at:
 * - HTTP API: http://localhost:PORT/api/...
 * - WebSocket: ws://localhost:PORT/ws
 */
server.listen(PORT, () => {
    console.log("=== SERVER STARTUP COMPLETE ===");
    console.log(`🚀 HTTP + WebSocket Server Running on port ${PORT}`);
    console.log(`📡 REST API available at: http://localhost:${PORT}/api`);
    console.log(`⚡ WebSocket server available at: ws://localhost:${PORT}/ws`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`⏰ Server started at: ${new Date().toISOString()}`);
    console.log("===============================================");
});
// =============================================================================
// GRACEFUL SHUTDOWN HANDLERS
// =============================================================================
/**
 * Handle graceful shutdown on SIGTERM (production deployment)
 */
process.on("SIGTERM", () => {
    console.log("=== SIGTERM RECEIVED - GRACEFUL SHUTDOWN ===");
    server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
    });
});
/**
 * Handle graceful shutdown on SIGINT (Ctrl+C in development)
 */
process.on("SIGINT", () => {
    console.log("\n=== SIGINT RECEIVED - GRACEFUL SHUTDOWN ===");
    server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
    });
});
/**
 * Handle unhandled promise rejections
 */
process.on("unhandledRejection", (reason, promise) => {
    console.error("=== UNHANDLED PROMISE REJECTION ===");
    console.error("Reason:", reason);
    console.error("Promise:", promise);
    // In production, you might want to restart the server
    // For development, we'll just log the error
});
/**
 * Handle uncaught exceptions
 */
process.on("uncaughtException", (error) => {
    console.error("=== UNCAUGHT EXCEPTION ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);
    // In production, you should restart the server
    process.exit(1);
});
