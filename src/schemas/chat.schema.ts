import z from "zod";

// =============================================================================
// CHAT SCHEMAS - LABYRINTH PLATFORM
// =============================================================================

/**
 * MESSAGE SCHEMA
 */
export const messageSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  messageType: z.enum(["TEXT", "IMAGE", "FILE"]),
  mediaUrl: z.string().url().nullable(),
  senderId: z.string().uuid(),
  chatId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  sender: z.object({
    id: z.string().uuid(),
    username: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
  }),
});

export type Message = z.infer<typeof messageSchema>;

/**
 * CHAT PARTICIPANT SCHEMA
 */
export const chatParticipantSchema = z.object({
  userId: z.string().uuid(),
  chatId: z.string().uuid(),
  user: z.object({
    id: z.string().uuid(),
    username: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    lastActive: z.date().nullable(),
  }),
});

export type ChatParticipant = z.infer<typeof chatParticipantSchema>;

/**
 * CHAT SCHEMA
 */
export const chatSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["DIRECT", "PROJECT"]),
  name: z.string().nullable(),
  projectId: z.string().uuid().nullable(),
  participants: z.array(chatParticipantSchema),
  messages: z.array(messageSchema),
  lastMessage: messageSchema.nullable(),
  unreadCount: z.number().int().default(0),
  otherParticipants: z.array(chatParticipantSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Chat = z.infer<typeof chatSchema>;

/**
 * CREATE DIRECT CHAT SCHEMA
 */
export const createDirectChatSchema = z.object({
  targetUserId: z.string().uuid(),
});

export type CreateDirectChatInput = z.infer<typeof createDirectChatSchema>;

/**
 * CREATE PROJECT CHAT SCHEMA
 */
export const createProjectChatSchema = z.object({
  projectId: z.string().uuid(),
});

export type CreateProjectChatInput = z.infer<typeof createProjectChatSchema>;

/**
 * SEND MESSAGE SCHEMA
 */
export const sendMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  messageType: z.enum(["TEXT", "IMAGE", "FILE"]).default("TEXT"),
  mediaUrl: z.string().url().optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

/**
 * TYPING INDICATOR SCHEMA
 */
export const typingIndicatorSchema = z.object({
  isTyping: z.boolean(),
});

export type TypingIndicatorInput = z.infer<typeof typingIndicatorSchema>;

/**
 * ADD USER TO PROJECT CHAT SCHEMA
 */
export const addUserToProjectChatSchema = z.object({
  userId: z.string().uuid(),
});

export type AddUserToProjectChatInput = z.infer<typeof addUserToProjectChatSchema>;

/**
 * CHAT MESSAGES RESPONSE SCHEMA
 */
export const chatMessagesResponseSchema = z.object({
  messages: z.array(messageSchema),
  pagination: z.object({
    currentPage: z.number().int().positive(),
    totalCount: z.number().int().nonnegative(),
    hasMore: z.boolean(),
    pageSize: z.number().int().positive(),
  }),
});

export type ChatMessagesResponse = z.infer<typeof chatMessagesResponseSchema>;

/**
 * USER CHATS RESPONSE SCHEMA
 */
export const userChatsResponseSchema = z.object({
  chats: z.array(chatSchema),
  totalCount: z.number().int().nonnegative(),
});

export type UserChatsResponse = z.infer<typeof userChatsResponseSchema>;

/**
 * WEBSOCKET EVENT SCHEMAS
 */
export const websocketMessageSchema = z.object({
  messageId: z.string().uuid(),
  chatId: z.string().uuid(),
  senderId: z.string().uuid(),
  content: z.string(),
  messageType: z.enum(["TEXT", "IMAGE", "FILE"]),
  mediaUrl: z.string().url().nullable(),
  sentAt: z.string().datetime(),
});

export const websocketTypingSchema = z.object({
  chatId: z.string().uuid(),
  userId: z.string().uuid(),
  isTyping: z.boolean(),
  timestamp: z.string().datetime(),
});

export const websocketPresenceSchema = z.object({
  userId: z.string().uuid(),
  username: z.string(),
  status: z.enum(["online", "away", "busy", "offline"]),
  updatedAt: z.string().datetime(),
});

export const websocketMatchSchema = z.object({
  matchId: z.string().uuid(),
  matchedUserId: z.string().uuid(),
  matchedAt: z.string().datetime(),
});

export const websocketJoinChatSchema = z.object({
  chatId: z.string().uuid(),
});

export const websocketMessageReadSchema = z.object({
  chatId: z.string().uuid(),
  messageId: z.string().uuid(),
});

export type WebSocketMessage = z.infer<typeof websocketMessageSchema>;
export type WebSocketTyping = z.infer<typeof websocketTypingSchema>;
export type WebSocketPresence = z.infer<typeof websocketPresenceSchema>;
export type WebSocketMatch = z.infer<typeof websocketMatchSchema>;
export type WebSocketJoinChat = z.infer<typeof websocketJoinChatSchema>;
export type WebSocketMessageRead = z.infer<typeof websocketMessageReadSchema>;
