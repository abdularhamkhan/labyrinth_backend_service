"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const leaderBoard_routes_1 = __importDefault(require("./routes/leaderBoard.routes"));
const friends_routes_1 = __importDefault(require("./routes/friends.routes"));
const presence_routes_1 = __importDefault(require("./routes/presence.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
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
dotenv_1.default.config();
// Initialize Express application
const app = (0, express_1.default)();
// =============================================================================
// MIDDLEWARE SETUP
// =============================================================================
// Request ID middleware (should be first)
// Generates unique ID for each request for tracking
app.use(error_middleware_1.requestIdMiddleware);
// Enable CORS for all routes
// Allows frontend applications to make requests to this API
app.use((0, cors_1.default)());
// Parse incoming JSON requests
// Enables req.body to contain parsed JSON data
app.use(express_1.default.json());
// Security headers
app.use((0, helmet_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
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
app.use("/api/auth", auth_routes_1.default);
// Mount user routes (protected)
// Handles user profile management and other authenticated operations
app.use("/api/user", user_routes_1.default);
app.use("/api/app", leaderBoard_routes_1.default);
// Mount friends routes (protected)
// Handles friendship management, friend requests, user search, etc.
app.use("/api/friends", friends_routes_1.default);
// Mount presence/users routes (protected)
// Handles online/offline user presence and status tracking
app.use("/api/users", presence_routes_1.default);
// =============================================================================
// ERROR HANDLING MIDDLEWARE (must be last)
// =============================================================================
// 404 handler for unmatched routes
app.use(error_middleware_1.notFoundHandler);
// Global error handler (must be the very last middleware)
app.use(error_middleware_1.errorHandler);
// Export the configured Express application
exports.default = app;
