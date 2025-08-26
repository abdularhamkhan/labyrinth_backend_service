"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enhancedWebSocketHandler = exports.handlePresenceMessage = exports.handleUserOffline = exports.handleUserOnline = exports.authenticateWebSocket = void 0;
const presence_service_1 = require("../services/presence.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
/**
 * Authenticate WebSocket connection using JWT token
 */
const authenticateWebSocket = (ws, token) => {
    try {
        console.log("=== AUTHENTICATING WEBSOCKET CONNECTION ===");
        if (!token) {
            console.error("No token provided for WebSocket authentication");
            return false;
        }
        // Verify JWT token
        const decoded = jsonwebtoken_1.default.verify(token, env_1.ENV.jwtSecret);
        if (!decoded || !decoded.id) {
            console.error("Invalid token payload:", decoded);
            return false;
        }
        // Attach user info to WebSocket connection
        ws.userId = decoded.id;
        ws.user = {
            id: decoded.id,
            email: decoded.email,
            username: decoded.username,
        };
        console.log("WebSocket authentication successful:", {
            userId: decoded.id,
            username: decoded.username,
        });
        return true;
    }
    catch (error) {
        console.error("WebSocket authentication failed:", error);
        return false;
    }
};
exports.authenticateWebSocket = authenticateWebSocket;
/**
 * Handle user coming online via WebSocket connection
 */
const handleUserOnline = async (ws, deviceInfo) => {
    if (!ws.userId) {
        console.error("Cannot mark user online: No userId on WebSocket connection");
        return;
    }
    try {
        console.log("=== MARKING USER ONLINE VIA WEBSOCKET ===");
        console.log("User ID:", ws.userId);
        console.log("Device Info:", deviceInfo);
        // Store device info on WebSocket connection
        ws.deviceInfo = deviceInfo;
        // Mark user as online in presence system
        await (0, presence_service_1.markUserOnline)(ws.userId, deviceInfo);
        // Send confirmation to client
        const confirmationMessage = {
            type: "presence_update",
            status: "online",
            userId: ws.userId,
            timestamp: new Date().toISOString(),
        };
        ws.send(JSON.stringify(confirmationMessage));
        console.log("User successfully marked online:", ws.userId);
    }
    catch (error) {
        console.error("Failed to mark user online:", error);
        // Send error to client
        const errorMessage = {
            type: "presence_error",
            error: "Failed to update presence status",
            timestamp: new Date().toISOString(),
        };
        ws.send(JSON.stringify(errorMessage));
    }
};
exports.handleUserOnline = handleUserOnline;
/**
 * Handle user going offline via WebSocket disconnection
 */
const handleUserOffline = async (ws) => {
    if (!ws.userId) {
        console.log("No userId found on disconnecting WebSocket");
        return;
    }
    try {
        console.log("=== MARKING USER OFFLINE VIA WEBSOCKET ===");
        console.log("User ID:", ws.userId);
        // Mark user as offline in presence system
        await (0, presence_service_1.markUserOffline)(ws.userId);
        console.log("User successfully marked offline:", ws.userId);
    }
    catch (error) {
        console.error("Failed to mark user offline:", error);
    }
};
exports.handleUserOffline = handleUserOffline;
/**
 * Handle incoming WebSocket messages for presence-related operations
 */
const handlePresenceMessage = async (ws, message) => {
    console.log("=== HANDLING PRESENCE MESSAGE ===");
    console.log("Message type:", message.type);
    console.log("User ID:", ws.userId);
    try {
        switch (message.type) {
            case "authenticate":
                if (message.token) {
                    const isAuthenticated = (0, exports.authenticateWebSocket)(ws, message.token);
                    const response = {
                        type: "authentication_result",
                        success: isAuthenticated,
                        userId: ws.userId || null,
                        timestamp: new Date().toISOString(),
                    };
                    ws.send(JSON.stringify(response));
                    // If authentication successful, mark user as online
                    if (isAuthenticated && ws.userId) {
                        await (0, exports.handleUserOnline)(ws, message.deviceInfo);
                    }
                }
                break;
            case "heartbeat":
                if (ws.userId) {
                    // Update heartbeat in presence system (handled automatically by service)
                    const response = {
                        type: "heartbeat_ack",
                        userId: ws.userId,
                        timestamp: new Date().toISOString(),
                    };
                    ws.send(JSON.stringify(response));
                }
                break;
            case "update_device_info":
                if (ws.userId && message.data?.deviceInfo) {
                    ws.deviceInfo = message.data.deviceInfo;
                    await (0, presence_service_1.markUserOnline)(ws.userId, message.data.deviceInfo);
                    const response = {
                        type: "device_info_updated",
                        userId: ws.userId,
                        timestamp: new Date().toISOString(),
                    };
                    ws.send(JSON.stringify(response));
                }
                break;
            default:
                console.log("Unknown presence message type:", message.type);
        }
    }
    catch (error) {
        console.error("Error handling presence message:", error);
        const errorResponse = {
            type: "error",
            error: "Failed to process presence message",
            timestamp: new Date().toISOString(),
        };
        ws.send(JSON.stringify(errorResponse));
    }
};
exports.handlePresenceMessage = handlePresenceMessage;
/**
 * Enhanced WebSocket connection handler with presence tracking
 */
const enhancedWebSocketHandler = (ws) => {
    console.log("=== NEW WEBSOCKET CONNECTION ===");
    // Send initial connection message
    const welcomeMessage = {
        type: "connection",
        message: "Welcome to With A Twist! Please authenticate to track presence.",
        timestamp: new Date().toISOString(),
    };
    ws.send(JSON.stringify(welcomeMessage));
    // Handle incoming messages
    ws.on("message", async (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log("Received WebSocket message:", message.type);
            // Handle presence-related messages
            await (0, exports.handlePresenceMessage)(ws, message);
            // Handle other game-related messages here...
            // You can add your existing game logic here
        }
        catch (error) {
            console.error("Failed to parse WebSocket message:", error);
            const errorResponse = {
                type: "error",
                error: "Invalid message format",
                timestamp: new Date().toISOString(),
            };
            ws.send(JSON.stringify(errorResponse));
        }
    });
    // Handle connection close
    ws.on("close", async () => {
        console.log("=== WEBSOCKET CONNECTION CLOSED ===");
        await (0, exports.handleUserOffline)(ws);
    });
    // Handle connection errors
    ws.on("error", async (error) => {
        console.error("=== WEBSOCKET ERROR ===", error);
        await (0, exports.handleUserOffline)(ws);
    });
};
exports.enhancedWebSocketHandler = enhancedWebSocketHandler;
exports.default = {
    authenticateWebSocket: exports.authenticateWebSocket,
    handleUserOnline: exports.handleUserOnline,
    handleUserOffline: exports.handleUserOffline,
    handlePresenceMessage: exports.handlePresenceMessage,
    enhancedWebSocketHandler: exports.enhancedWebSocketHandler,
};
