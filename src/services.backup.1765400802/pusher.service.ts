import { pusher, isPusherEnabled } from "../config/pusher";

/**
 * =============================================================================
 * PUSHER SERVICE - REAL-TIME EVENT BROADCASTING
 * =============================================================================
 *
 * Handles all real-time event broadcasting via Pusher channels.
 * Provides a clean abstraction over Pusher API for the application.
 *
 * Channel Types:
 * - private-chat-{chatId} - Private chat messages
 * - private-user-{userId} - User-specific notifications
 * - presence-chat-{chatId} - Presence tracking in chats
 *
 * =============================================================================
 */

interface PusherEvent {
  channel: string;
  name: string; // Pusher uses 'name' not 'event'
  data: any;
}

/**
 * Broadcast a new chat message to a chat channel
 */
export const broadcastMessage = async (
  chatId: string,
  messageData: {
    id: string;
    content: string;
    messageType: string;
    mediaUrl?: string | null;
    senderId: string;
    sender: {
      id: string;
      username: string;
      firstName: string | null;
      lastName: string | null;
    };
    createdAt: Date;
  }
): Promise<void> => {
  if (!isPusherEnabled()) return;

  try {
    await pusher.trigger(`private-chat-${chatId}`, "new-message", {
      message: messageData,
    });
  } catch (error) {
    console.error("Failed to broadcast message via Pusher:", error);
  }
};

/**
 * Broadcast typing indicator to a chat channel
 */
export const broadcastTypingIndicator = async (
  chatId: string,
  userId: string,
  username: string,
  isTyping: boolean
): Promise<void> => {
  if (!isPusherEnabled()) return;

  try {
    await pusher.trigger(`private-chat-${chatId}`, "typing", {
      userId,
      username,
      isTyping,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to broadcast typing indicator via Pusher:", error);
  }
};

/**
 * Notify user about a new chat created
 */
export const notifyUserNewChat = async (
  userId: string,
  chatData: {
    chatId: string;
    type: string;
    otherParticipant?: {
      id: string;
      username: string;
      firstName: string | null;
      lastName: string | null;
    };
  }
): Promise<void> => {
  if (!isPusherEnabled()) return;

  try {
    await pusher.trigger(`private-user-${userId}`, "new-chat", {
      chat: chatData,
    });
  } catch (error) {
    console.error("Failed to notify user about new chat via Pusher:", error);
  }
};

/**
 * Notify user they were added to a chat
 */
export const notifyUserAddedToChat = async (
  userId: string,
  chatId: string,
  addedBy: string
): Promise<void> => {
  if (!isPusherEnabled()) return;

  try {
    await pusher.trigger(`private-user-${userId}`, "added-to-chat", {
      chatId,
      addedBy,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to notify user about being added to chat via Pusher:", error);
  }
};

/**
 * Broadcast message deletion to a chat channel
 */
export const broadcastMessageDeleted = async (
  chatId: string,
  messageId: string
): Promise<void> => {
  if (!isPusherEnabled()) return;

  try {
    await pusher.trigger(`private-chat-${chatId}`, "message-deleted", {
      messageId,
      deletedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to broadcast message deletion via Pusher:", error);
  }
};

/**
 * Notify user about a new match
 */
export const notifyUserNewMatch = async (
  userId: string,
  matchData: {
    matchId: string;
    matchedUser: {
      id: string;
      username: string;
      firstName: string | null;
      lastName: string | null;
    };
  }
): Promise<void> => {
  if (!isPusherEnabled()) return;

  try {
    await pusher.trigger(`private-user-${userId}`, "new-match", {
      match: matchData,
    });
  } catch (error) {
    console.error("Failed to notify user about new match via Pusher:", error);
  }
};

/**
 * Batch broadcast multiple events at once (more efficient)
 */
export const broadcastBatch = async (events: PusherEvent[]): Promise<void> => {
  if (!isPusherEnabled() || events.length === 0) return;

  try {
    await pusher.triggerBatch(events);
  } catch (error) {
    console.error("Failed to broadcast batch events via Pusher:", error);
  }
};

/**
 * Authenticate user for private/presence channels
 * This is called by the client to get authorization for private channels
 */
export const authenticateChannel = (
  socketId: string,
  channelName: string,
  userId: string
): any => {
  if (!isPusherEnabled()) {
    throw new Error("Pusher is not configured");
  }

  // Verify user has access to this channel
  // For private-user-{userId} channels, userId must match
  if (channelName.startsWith("private-user-")) {
    const channelUserId = channelName.replace("private-user-", "");
    if (channelUserId !== userId) {
      throw new Error("Unauthorized: Cannot access another user's private channel");
    }
  }

  // For private-chat-{chatId} channels, we should verify user is participant
  // This is handled by the controller which queries the database

  // Generate auth signature
  return pusher.authorizeChannel(socketId, channelName);
};

/**
 * Authenticate user for presence channels with user data
 */
export const authenticatePresenceChannel = (
  socketId: string,
  channelName: string,
  userId: string,
  userData: {
    id: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
  }
): any => {
  if (!isPusherEnabled()) {
    throw new Error("Pusher is not configured");
  }

  return pusher.authorizeChannel(socketId, channelName, {
    user_id: userId,
    user_info: userData,
  });
};
