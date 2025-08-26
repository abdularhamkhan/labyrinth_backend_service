import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import leaderBoardRouter from "./routes/leaderBoard.routes";
import friendsRouter from "./routes/friends.routes";
import presenceRouter from "./routes/presence.routes";
import { errorHandler, notFoundHandler, requestIdMiddleware } from "./middlewares/error.middleware";

/**
 * =============================================================================
 * EXPRESS APPLICATION SETUP
 * =============================================================================
 *
 * This file configures the main Express application with:
 * - Environment variables loading
 * - Middleware setup (CORS, JSON parsing)
 * - Route mounting
 * - Basic health check endpoint
 *
 * Architecture:
 * - /api/auth/* - Public authentication routes
 * - /api/user/* - Protected user routes (require authentication)
 *
 * =============================================================================
 */

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// =============================================================================
// ROUTES SETUP
// =============================================================================

// Health check endpoint
// Used to verify that the API is running and accessible
app.get("/", (req, res) => {
  res.send("API is running");
});

// Mount authentication routes (public)
// Handles signup, login, and OTP verification
app.use("/api/auth", authRouter);

// Mount user routes (protected)
// Handles user profile management and other authenticated operations
app.use("/api/user", userRouter);

app.use("/api/app", leaderBoardRouter);

// Mount friends routes (protected)
// Handles friendship management, friend requests, user search, etc.
app.use("/api/friends", friendsRouter);

// Mount presence/users routes (protected)
// Handles online/offline user presence and status tracking
app.use("/api/users", presenceRouter);

// =============================================================================
// ERROR HANDLING MIDDLEWARE (must be last)
// =============================================================================

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handler (must be the very last middleware)
app.use(errorHandler);

// Export the configured Express application
export default app;
