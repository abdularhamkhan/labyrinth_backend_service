import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/jwt.middleware";
import {
  createOrGetDirectChat,
  createProjectChat,
  sendMessage,
  getChatMessages,
  getUserChats,
  setTypingIndicator,
  deleteMessage,
  getUnreadMessageCount,
  addUserToProjectChat,
} from "../services/chat.service";
import { ValidationError } from "../constants/error";

// =============================================================================
// CHAT CONTROLLERS - LABYRINTH COLLABORATION PLATFORM
// =============================================================================

/**
 * CREATE OR GET DIRECT CHAT
 * Route: POST /api/chat/direct
 * Auth: Required
 * Body: { targetUserId: string }
 */
export const createDirectChat = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { targetUserId } = req.body;

  if (!targetUserId || typeof targetUserId !== 'string') {
    throw new ValidationError("targetUserId is required");
  }

  const chat = await createOrGetDirectChat(userId, targetUserId);

  res.status(200).json({
    success: true,
    message: "Direct chat created or retrieved successfully",
    data: { chat },
  });
};

/**
 * CREATE PROJECT CHAT
 * Route: POST /api/chat/project
 * Auth: Required
 * Body: { projectId: string }
 */
export const createProjectChatController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { projectId } = req.body;

  if (!projectId || typeof projectId !== 'string') {
    throw new ValidationError("projectId is required");
  }

  const chat = await createProjectChat(projectId, userId);

  res.status(201).json({
    success: true,
    message: "Project chat created successfully",
    data: { chat },
  });
};

/**
 * SEND MESSAGE
 * Route: POST /api/chat/:chatId/messages
 * Auth: Required
 * Body: { content: string, messageType?: string, mediaUrl?: string }
 */
export const sendMessageController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { chatId } = req.params;
  const { content, messageType = "TEXT", mediaUrl } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    throw new ValidationError("Message content is required");
  }

  if (content.length > 2000) {
    throw new ValidationError("Message content cannot exceed 2000 characters");
  }

  const validMessageTypes = ["TEXT", "IMAGE", "FILE"];
  if (!validMessageTypes.includes(messageType)) {
    throw new ValidationError("Invalid message type");
  }

  const message = await sendMessage(chatId, userId, content.trim(), messageType, mediaUrl);

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: { message },
  });
};

/**
 * GET CHAT MESSAGES
 * Route: GET /api/chat/:chatId/messages
 * Auth: Required
 * Query: ?page=1&limit=50
 */
export const getChatMessagesController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { chatId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 50, 100); // Max 100 messages per request

  if (page < 1) {
    throw new ValidationError("Page must be greater than 0");
  }

  if (limit < 1) {
    throw new ValidationError("Limit must be greater than 0");
  }

  const result = await getChatMessages(chatId, userId, page, limit);

  res.status(200).json({
    success: true,
    message: "Chat messages retrieved successfully",
    data: {
      messages: result.messages,
      pagination: {
        currentPage: page,
        totalCount: result.totalCount,
        hasMore: result.hasMore,
        pageSize: limit,
      },
    },
  });
};

/**
 * GET USER CHATS
 * Route: GET /api/chat
 * Auth: Required
 */
export const getUserChatsController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  const chats = await getUserChats(userId);

  res.status(200).json({
    success: true,
    message: "User chats retrieved successfully",
    data: {
      chats,
      totalCount: chats.length,
    },
  });
};

/**
 * SET TYPING INDICATOR
 * Route: POST /api/chat/:chatId/typing
 * Auth: Required
 * Body: { isTyping: boolean }
 */
export const setTypingIndicatorController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { chatId } = req.params;
  const { isTyping } = req.body;

  if (typeof isTyping !== 'boolean') {
    throw new ValidationError("isTyping must be a boolean");
  }

  await setTypingIndicator(chatId, userId, isTyping);

  res.status(200).json({
    success: true,
    message: "Typing indicator updated successfully",
    data: { chatId, isTyping },
  });
};

/**
 * DELETE MESSAGE
 * Route: DELETE /api/chat/messages/:messageId
 * Auth: Required
 */
export const deleteMessageController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { messageId } = req.params;

  const deletedMessage = await deleteMessage(messageId, userId);

  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
    data: { message: deletedMessage },
  });
};

/**
 * GET UNREAD MESSAGE COUNT
 * Route: GET /api/chat/unread-count
 * Auth: Required
 */
export const getUnreadCountController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  const unreadCount = await getUnreadMessageCount(userId);

  res.status(200).json({
    success: true,
    message: "Unread message count retrieved successfully",
    data: { unreadCount },
  });
};

/**
 * ADD USER TO PROJECT CHAT
 * Route: POST /api/chat/project/:projectId/add-user
 * Auth: Required
 * Body: { userId: string }
 */
export const addUserToProjectChatController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const currentUserId = req.user!.id;
  const { projectId } = req.params;
  const { userId } = req.body;

  if (!userId || typeof userId !== 'string') {
    throw new ValidationError("userId is required");
  }

  await addUserToProjectChat(projectId, userId, currentUserId);

  res.status(200).json({
    success: true,
    message: "User added to project chat successfully",
    data: { projectId, addedUserId: userId },
  });
};

/**
 * GET CHAT DETAILS
 * Route: GET /api/chat/:chatId
 * Auth: Required
 */
export const getChatDetails = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const { chatId } = req.params;

  // Get chat with participants and recent message
  const chats = await getUserChats(userId);
  const chat = chats.find(c => c.id === chatId);

  if (!chat) {
    throw new ValidationError("Chat not found or access denied");
  }

  res.status(200).json({
    success: true,
    message: "Chat details retrieved successfully",
    data: { chat },
  });
};