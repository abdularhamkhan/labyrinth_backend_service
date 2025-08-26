"use strict";
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import compression from "compression";
// import authRouter from "./routes/auth.routes";
// import userRouter from "./routes/user.routes";
// import leaderBoardRouter from "./routes/leaderBoard.routes";
// /**
//  * =============================================================================
//  * HTTP/2 OPTIMIZED EXPRESS APPLICATION
//  * =============================================================================
//  *
//  * Enhanced Express application with HTTP/2 specific optimizations:
//  * - Server Push capabilities for critical resources
//  * - Enhanced compression for multiplexed streams
//  * - Optimized headers for HPACK compression
//  * - Performance monitoring and metrics
//  *
//  * =============================================================================
//  */
// dotenv.config();
// const app = express();
// // =============================================================================
// // HTTP/2 OPTIMIZED MIDDLEWARE SETUP
// // =============================================================================
// // Enhanced CORS with HTTP/2 considerations
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production'
//     ? ['https://wat.vcern.com', 'https://www.wat.vcern.com']
//     : ['http://localhost:3000', 'http://localhost:3001'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   // Optimize for HTTP/2 header compression
//   optionsSuccessStatus: 200,
// }));
// // Enhanced compression for HTTP/2 streams
// app.use(compression({
//   // Higher compression level for HTTP/2 (we can afford it due to multiplexing)
//   level: 9,
//   threshold: 1024,
//   filter: (req, res) => {
//     // Don't compress responses with this request header
//     if (req.headers['x-no-compression']) {
//       return false;
//     }
//     // Use compression filter function
//     return compression.filter(req, res);
//   },
// }));
// app.use(express.json({
//   limit: '10mb',
//   // Optimize JSON parsing for HTTP/2
//   verify: (req: any, res, buf) => {
//     req.rawBody = buf;
//   }
// }));
// // =============================================================================
// // HTTP/2 PERFORMANCE MIDDLEWARE
// // =============================================================================
// // Add HTTP/2 server push middleware
// app.use((req: any, res: any, next) => {
//   // Add HTTP/2 push capabilities
//   if (res.push && req.httpVersion === '2.0') {
//     res.http2Push = (path: string, headers: any = {}) => {
//       try {
//         const stream = res.push({
//           ':path': path,
//           ':method': 'GET',
//           ...headers
//         });
//         if (stream) {
//           // Log server push for monitoring
//           console.log(`HTTP/2 Server Push: ${path}`);
//           return stream;
//         }
//       } catch (error) {
//         console.warn(`HTTP/2 Push failed for ${path}:`, error);
//       }
//       return null;
//     };
//   }
//   next();
// });
// // Performance monitoring middleware
// app.use((req, res, next) => {
//   const startTime = Date.now();
//   res.on('finish', () => {
//     const duration = Date.now() - startTime;
//     const protocol = req.httpVersion === '2.0' ? 'HTTP/2' : 'HTTP/1.1';
//     console.log(`${protocol} ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
//     // Add performance headers for monitoring
//     res.setHeader('X-Response-Time', `${duration}ms`);
//     res.setHeader('X-Protocol', protocol);
//   });
//   next();
// });
// // =============================================================================
// // ROUTES SETUP WITH HTTP/2 OPTIMIZATIONS
// // =============================================================================
// // Enhanced health check with HTTP/2 features
// app.get("/", (req: any, res: any) => {
//   const protocol = req.httpVersion === '2.0' ? 'HTTP/2' : 'HTTP/1.1';
//   const features = [];
//   if (req.httpVersion === '2.0') {
//     features.push('Multiplexing', 'Header Compression', 'Server Push');
//   }
//   // Server push critical resources on root request
//   if (res.http2Push) {
//     // Push API documentation or critical assets
//     res.http2Push('/api/health', {
//       'content-type': 'application/json'
//     });
//   }
//   res.json({
//     message: "API is running",
//     protocol: protocol,
//     features: features,
//     timestamp: new Date().toISOString(),
//     nodeVersion: process.version,
//     uptime: process.uptime()
//   });
// });
// // Health check endpoint for load balancers
// app.get("/api/health", (req, res) => {
//   res.status(200).json({
//     status: "healthy",
//     protocol: req.httpVersion === '2.0' ? 'HTTP/2' : 'HTTP/1.1',
//     timestamp: new Date().toISOString(),
//     memory: process.memoryUsage(),
//     uptime: process.uptime()
//   });
// });
// // Mount routes with HTTP/2 awareness
// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);
// app.use("/api/app", leaderBoardRouter);
// // =============================================================================
// // HTTP/2 SPECIFIC ERROR HANDLING
// // =============================================================================
// // Enhanced error handler for HTTP/2
// app.use((err: any, req: any, res: any, next: any) => {
//   console.error('Application Error:', {
//     error: err.message,
//     stack: err.stack,
//     protocol: req.httpVersion === '2.0' ? 'HTTP/2' : 'HTTP/1.1',
//     url: req.url,
//     method: req.method,
//     timestamp: new Date().toISOString()
//   });
//   // Send appropriate error response
//   const statusCode = err.statusCode || 500;
//   const message = process.env.NODE_ENV === 'production'
//     ? 'Internal Server Error'
//     : err.message;
//   res.status(statusCode).json({
//     error: {
//       message,
//       status: statusCode,
//       protocol: req.httpVersion === '2.0' ? 'HTTP/2' : 'HTTP/1.1',
//       timestamp: new Date().toISOString()
//     }
//   });
// });
// // 404 handler
// app.use((req: any, res) => {
//   res.status(404).json({
//     error: {
//       message: 'Route not found',
//       status: 404,
//       protocol: req.httpVersion === '2.0' ? 'HTTP/2' : 'HTTP/1.1',
//       path: req.url,
//       timestamp: new Date().toISOString()
//     }
//   });
// });
// export default app;
