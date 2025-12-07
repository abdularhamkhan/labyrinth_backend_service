import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { asyncHandler } from "../middlewares/error.middleware";
import {
  createDirectChat,
  createProjectChatController,
  sendMessageController,
  getChatMessagesController,
  getUserChatsController,
  setTypingIndicatorController,
  deleteMessageController,
  getUnreadCountController,
  addUserToProjectChatController,
  getChatDetails,
  pusherAuthController,
  getDMMembersController,
} from "../controllers/chat.controller";

// =============================================================================
// CHAT ROUTES - LABYRINTH COLLABORATION PLATFORM
// =============================================================================

const router = Router();

// All chat routes require authentication
router.use(authenticateUser);

// =============================================================================
// CHAT MANAGEMENT
// =============================================================================

// Get all user chats
// Usage: GET /api/chat
// Headers: Authorization: Bearer <jwt_token>
router.get("/", asyncHandler(getUserChatsController));

// Get unread message count for user
// Usage: GET /api/chat/unread-count
// Headers: Authorization: Bearer <jwt_token>
router.get("/unread-count", asyncHandler(getUnreadCountController));

// Get DM members (users with whom authenticated user has DM chats)
// Usage: GET /api/chat/dmmembers?search=<query>
// Headers: Authorization: Bearer <jwt_token>
router.get("/dmmembers", asyncHandler(getDMMembersController));

// Create or get direct chat between two users
// Usage: POST /api/chat/direct
// Headers: Authorization: Bearer <jwt_token>
// Body: { targetUserId: string }
router.post("/direct", asyncHandler(createDirectChat));

// Create project chat
// Usage: POST /api/chat/project
// Headers: Authorization: Bearer <jwt_token>
// Body: { projectId: string }
router.post("/project", asyncHandler(createProjectChatController));

// Get specific chat details
// Usage: GET /api/chat/:chatId
// Headers: Authorization: Bearer <jwt_token>
router.get("/:chatId", asyncHandler(getChatDetails));

// =============================================================================
// PUSHER REAL-TIME AUTHENTICATION
// =============================================================================

// Authenticate Pusher channel subscriptions
// Usage: POST /api/chat/pusher/auth
// Headers: Authorization: Bearer <jwt_token>
// Body: { socket_id: string, channel_name: string }
router.post("/pusher/auth", asyncHandler(pusherAuthController));

// =============================================================================
// MESSAGE MANAGEMENT
// =============================================================================

// Get messages for a specific chat
// Usage: GET /api/chat/:chatId/messages?page=1&limit=50
// Headers: Authorization: Bearer <jwt_token>
router.get("/:chatId/messages", asyncHandler(getChatMessagesController));

// Send message to a chat
// Usage: POST /api/chat/:chatId/messages
// Headers: Authorization: Bearer <jwt_token>
// Body: { content: string, messageType?: 'TEXT' | 'IMAGE' | 'FILE', mediaUrl?: string }
router.post("/:chatId/messages", asyncHandler(sendMessageController));

// Delete a message
// Usage: DELETE /api/chat/messages/:messageId
// Headers: Authorization: Bearer <jwt_token>
router.delete("/messages/:messageId", asyncHandler(deleteMessageController));

// =============================================================================
// REAL-TIME FEATURES
// =============================================================================

// Set typing indicator
// Usage: POST /api/chat/:chatId/typing
// Headers: Authorization: Bearer <jwt_token>
// Body: { isTyping: boolean }
router.post("/:chatId/typing", asyncHandler(setTypingIndicatorController));

// =============================================================================
// PROJECT CHAT MANAGEMENT
// =============================================================================

// Add user to project chat
// Usage: POST /api/chat/project/:projectId/add-user
// Headers: Authorization: Bearer <jwt_token>
// Body: { userId: string }
router.post("/project/:projectId/add-user", asyncHandler(addUserToProjectChatController));

export default router;
