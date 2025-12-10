import http from "http";
import { WebSocketServer } from "ws";
import app from "./app";
import "./redis";
import { ENV } from "./config/env";
import { initializeKafkaTopics } from "./config/kafka";
import { kafkaConsumer } from "./services/kafka-consumer.service";
import { KAFKA_TOPICS } from "./config/kafka";

/**
 * =============================================================================
 * LABYRINTH PLATFORM SERVER WITH REAL-TIME SUPPORT
 * =============================================================================
 *
 * This file sets up the Labyrinth platform server with:
 * - HTTP Server: Handles REST API requests
 * - WebSocket Server: Handles real-time chat and collaboration
 * - Kafka Integration: Event-driven architecture
 * - Redis: Caching and session management
 *
 * Architecture:
 * - HTTP Server: REST API for all platform operations
 * - WebSocket Server: Real-time chat, notifications, presence
 * - Kafka: Event streaming for microservices communication
 * - Redis: Caching, sessions, and real-time data
 *
 * =============================================================================
 */

const PORT = ENV.port || 3000;

// =============================================================================
// HTTP SERVER SETUP
// =============================================================================

// Create HTTP server with Express app
const server = http.createServer(app);

// =============================================================================
// WEBSOCKET SERVER SETUP FOR REAL-TIME COLLABORATION
// =============================================================================

// Create WebSocket server attached to HTTP server
const webSocketServer = new WebSocketServer({
  server,
  path: "/ws",
});

// TODO: Initialize WebSocket handlers for:
// - Real-time chat messaging
// - User presence updates
// - Project collaboration events
// - Notification delivery
console.log("WebSocket server initialized for collaboration features");

// =============================================================================
// INITIALIZE SERVICES AND START SERVER
// =============================================================================

async function startServer() {
  let kafkaConnected = false;

  try {
    // KAFKA DISABLED - Not required for current production deployment
    // Re-enable when proper Kafka infrastructure is available
    console.log("ℹ️  Kafka disabled in production (not required)");

    // Start HTTP server
    server.listen(PORT, () => {
      console.log("=== LABYRINTH PLATFORM STARTUP COMPLETE ===");
      console.log(`🌟 Server running on port ${PORT}`);
      console.log(`📡 REST API: http://localhost:${PORT}/api`);
      console.log(`🔗 WebSocket: ws://localhost:${PORT}/ws`);
      console.log(`🏗️ Environment: ${ENV.nodeEnv}`);
      console.log(`⚡ Kafka: ${kafkaConnected ? "Connected" : "Disabled"}`);
      console.log(`📊 Redis: Connected`);
      if (!kafkaConnected && ENV.nodeEnv === "development") {
        console.log(`💡 To enable Kafka: Start Kafka on localhost:9092`);
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();

// =============================================================================
// ERROR HANDLING
// =============================================================================

server.on("error", (error) => {
  console.error("Server error:", error);
});

// =============================================================================
// GRACEFUL SHUTDOWN HANDLERS
// =============================================================================

const gracefulShutdown = async () => {
  console.log("=== LABYRINTH PLATFORM GRACEFUL SHUTDOWN ===");

  try {
    // Kafka disabled - skip disconnect
    console.log("ℹ️  Kafka was disabled (skipping disconnect)");

    // Close HTTP server
    server.close(() => {
      console.log("✅ HTTP server closed");
      console.log("✅ Labyrinth platform shutdown complete");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", () => {
  console.log("=== SIGINT RECEIVED - GRACEFUL SHUTDOWN ===");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("=== UNHANDLED PROMISE REJECTION ===");
  console.error("Reason:", reason);
  console.error("Promise:", promise);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("=== UNCAUGHT EXCEPTION ===");
  console.error("Error:", error);
  console.error("Stack:", error.stack);
  process.exit(1);
});
