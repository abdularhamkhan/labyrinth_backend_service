// import http2 from "http2";
// import https from "https";
// import fs from "fs";
// import { WebSocketServer } from "ws";
// import app from "./app";
// import "./config/redis";
// import { ENV } from "./config/env";

// /**
//  * =============================================================================
//  * HTTP/2 SERVER SETUP WITH WEBSOCKET SUPPORT
//  * =============================================================================
//  *
//  * This file sets up an HTTP/2 server with fallback support for WebSockets.
//  * HTTP/2 doesn't directly support WebSockets, so we run both HTTP/2 and
//  * HTTP/1.1 servers on different ports, with Nginx handling the routing.
//  *
//  * Architecture:
//  * - HTTP/2 Server: Handles REST API requests with improved performance
//  * - HTTP/1.1 Server: Dedicated for WebSocket connections
//  * - Nginx: Routes traffic based on upgrade headers and paths
//  *
//  * =============================================================================
//  */

// // =============================================================================
// // SSL CERTIFICATE CONFIGURATION
// // =============================================================================

// const sslOptions = {
//   key: fs.readFileSync('/etc/letsencrypt/live/wat.vcern.com/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/wat.vcern.com/fullchain.pem'),
// };

// // =============================================================================
// // HTTP/2 SERVER SETUP
// // =============================================================================

// const PORT = ENV.port as number;
// const WS_PORT = (ENV.port as number) + 1; // WebSocket on PORT + 1

// // Create HTTP/2 secure server for API endpoints
// const http2Server = http2.createSecureServer({
//   ...sslOptions,
//   allowHTTP2: true,
// });

// // Handle HTTP/2 requests using Express app
// http2Server.on('stream', (stream, headers) => {
//   // Convert HTTP/2 stream to Express-compatible request/response
//   const req = Object.assign(stream, {
//     method: headers[':method'],
//     url: headers[':path'],
//     headers: headers,
//     httpVersion: '2.0',
//   }) as any;

//   const res = Object.assign(stream, {
//     writeHead: (statusCode: number, headers?: any) => {
//       stream.respond({
//         ':status': statusCode,
//         ...headers,
//       });
//     },
//     write: (chunk: any) => stream.write(chunk),
//     end: (chunk?: any) => {
//       if (chunk) stream.write(chunk);
//       stream.end();
//     },
//   }) as any;

//   // Pass to Express app
//   app(req, res);
// });

// // =============================================================================
// // HTTP/1.1 SERVER FOR WEBSOCKETS
// // =============================================================================

// // Create separate HTTPS server for WebSocket connections
// const httpsServer = https.createServer(sslOptions);

// // Create WebSocket server attached to HTTPS server
// const webSocketServer = new WebSocketServer({
//   server: httpsServer,
//   path: "/ws",
// });

// // =============================================================================
// // WEBSOCKET EVENT HANDLERS (Same as original)
// // =============================================================================

// webSocketServer.on("connection", (ws) => {
//   console.log("=== NEW WEBSOCKET CONNECTION ===");
//   console.log("WebSocket connection established:", {
//     readyState: ws.readyState,
//     timestamp: new Date().toISOString(),
//   });

//   const welcomeMessage = {
//     type: "connection",
//     message: "Welcome to With A Twist! (HTTP/2 + WebSocket)",
//     timestamp: new Date().toISOString(),
//   };

//   ws.send(JSON.stringify(welcomeMessage));
//   console.log("Welcome message sent to client");

//   ws.on("close", () => {
//     console.log("=== WEBSOCKET CONNECTION CLOSED ===");
//     console.log("Client disconnected:", {
//       timestamp: new Date().toISOString(),
//     });
//   });

//   ws.on("error", (error) => {
//     console.error("=== WEBSOCKET ERROR ===");
//     console.error("WebSocket error:", {
//       error: error.message,
//       timestamp: new Date().toISOString(),
//     });
//   });

//   ws.on("message", (message) => {
//     console.log("=== WEBSOCKET MESSAGE RECEIVED ===");
//     try {
//       const parsedMessage = JSON.parse(message.toString());
//       console.log("Received message:", {
//         type: parsedMessage.type,
//         timestamp: new Date().toISOString(),
//       });
//     } catch (error) {
//       console.error("Failed to parse WebSocket message:", {
//         error: error instanceof Error ? error.message : "Unknown error",
//         rawMessage: message.toString(),
//       });
//     }
//   });
// });

// // =============================================================================
// // SERVER STARTUP
// // =============================================================================

// // Start HTTP/2 server
// http2Server.listen(PORT, () => {
//   console.log("=== HTTP/2 SERVER STARTUP COMPLETE ===");
//   console.log(`🚀 HTTP/2 Server Running on port ${PORT}`);
//   console.log(`📡 REST API available at: https://wat.vcern.com/api`);
//   console.log(`⚡ HTTP/2 multiplexing enabled`);
//   console.log(`🔒 TLS 1.3 encryption active`);
// });

// // Start WebSocket server
// httpsServer.listen(WS_PORT, () => {
//   console.log(`⚡ WebSocket Server Running on port ${WS_PORT}`);
//   console.log(`🌐 WebSocket available at: wss://wat.vcern.com:${WS_PORT}/ws`);
// });

// // =============================================================================
// // GRACEFUL SHUTDOWN HANDLERS
// // =============================================================================

// const gracefulShutdown = () => {
//   console.log("=== GRACEFUL SHUTDOWN INITIATED ===");

//   http2Server.close(() => {
//     console.log("HTTP/2 server closed");
//   });

//   httpsServer.close(() => {
//     console.log("WebSocket server closed");
//     process.exit(0);
//   });
// };

// process.on("SIGTERM", gracefulShutdown);
// process.on("SIGINT", gracefulShutdown);

// process.on("unhandledRejection", (reason, promise) => {
//   console.error("=== UNHANDLED PROMISE REJECTION ===");
//   console.error("Reason:", reason);
//   console.error("Promise:", promise);
// });

// process.on("uncaughtException", (error) => {
//   console.error("=== UNCAUGHT EXCEPTION ===");
//   console.error("Error:", error);
//   console.error("Stack:", error.stack);
//   process.exit(1);
// });
