import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf8"));
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import friendsRouter from "./routes/friends.routes";
import presenceRouter from "./routes/presence.routes";
import matchmakingRouter from "./routes/matchmaking.routes";
import chatRouter from "./routes/chat.routes";
import projectRouter from "./routes/project.routes";
import mediaRouter from "./routes/media.routes";
import { errorHandler, notFoundHandler, requestIdMiddleware } from "./middlewares/error.middleware";
import { rateLimit } from "./redis/middleware/redisMiddleware";

/**
 * =============================================================================
 * LABYRINTH PLATFORM EXPRESS APPLICATION
 * =============================================================================
 *
 * This file configures the main Express application with:
 * - Environment variables loading
 * - Middleware setup (CORS, JSON parsing)
 * - Route mounting for collaboration platform
 * - Basic health check endpoint
 *
 * Architecture:
 * - /api/auth/* - Public authentication routes
 * - /api/user/* - Protected user profile routes
 * - /api/friends/* - Friend management and networking
 * - /api/users/* - Online presence and user status
 * - /api/matchmaking/* - Matchmaking and recommendation system
 * - /api/chat/* - Real-time chat and messaging system
 * - /api/projects/* - Project management and collaboration
 * - /api/media/* - Comprehensive media management system
 *
 * =============================================================================
 */

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Trust Railway proxy (required for rate limiting and IP detection)
app.set("trust proxy", 1);

// Serve Swagger UI at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// =============================================================================
// MIDDLEWARE SETUP
// =============================================================================

// Request ID middleware (should be first)
// Generates unique ID for each request for tracking
app.use(requestIdMiddleware);

// Enable CORS for all routes
// Allows frontend applications to make requests to this API
app.use(cors());

// Parse incoming JSON requests
// Enables req.body to contain parsed JSON data
app.use(express.json());

// Security headers
app.use(helmet());

// Rate limiting - Custom Redis-based implementation
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 1000, // limit each IP to 1000 requests per windowMs
});
app.use(limiter);

// =============================================================================
// ROUTES SETUP
// =============================================================================

// Health check endpoint
// Used to verify that the Labyrinth API is running and accessible
app.get("/", (req, res) => {
  res.json({
    message: "Labyrinth Collaboration Platform API",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

// Mount authentication routes (public)
// Handles signup, login, and OTP verification
app.use("/api/auth", authRouter);

// Mount user routes (protected)
// Handles user profile management and other authenticated operations
app.use("/api/user", userRouter);

// Mount friends routes (protected)
// Handles friendship management, friend requests, user search, etc.
app.use("/api/friends", friendsRouter);

// Mount presence/users routes (protected)
// Handles online/offline user presence and status tracking for collaboration
app.use("/api/users", presenceRouter);

// Mount matchmaking routes (protected)
// Handles user and project recommendations, swipe functionality, and matches
app.use("/api/matchmaking", matchmakingRouter);

// Mount chat routes (protected)
// Handles real-time messaging, direct chats, project chats, and message management
app.use("/api/chat", chatRouter);

// Mount project routes (protected)
// Handles project creation, collaboration management, and task tracking
app.use("/api/projects", projectRouter);

// Mount media routes (protected)
// Handles file uploads, media management, and storage operations across all categories
app.use("/api/media", mediaRouter);

// =============================================================================
// ERROR HANDLING MIDDLEWARE (must be last)
// =============================================================================

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handler (must be the very last middleware)
app.use(errorHandler);

// Export the configured Express application
export default app;
