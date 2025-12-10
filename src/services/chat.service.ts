import { prisma } from "../config/prisma";

import {
  DATABASE_ERRORS,
  USER_ERRORS,
  VALIDATION_ERRORS,
  NotFoundError,
  ValidationError,
  DatabaseError,
  ConflictError,
} from "../constants/error";
// Kafka disabled - import commented out
// import { kafkaProducer } from "./kafka-producer.service";
import {
  broadcastMessage,
  broadcastTypingIndicator,
  notifyUserNewChat,
  notifyUserAddedToChat,
  broadcastMessageDeleted,
} from "./pusher.service";
import { getOrSetCache, CacheKeys, CACHE_TTL, deleteCache } from "../utils/cache.util";

// =============================================================================
// REAL-TIME CHAT SERVICE - LABYRINTH PLATFORM
// =============================================================================

/**
 * Create or get existing chat between users (Direct Message)
 */
export const createOrGetDirectChat = async (user1Id: string, user2Id: string): Promise<any> => {
  try {
    if (user1Id === user2Id) {
      throw new ValidationError("Cannot create chat with yourself");
    }

    // Check if chat already exists between these users
    const existingChat = await prisma.chat.findFirst({
      where: {
        type: "DIRECT",
        participants: {
          every: {
            userId: { in: [user1Id, user2Id] },
          },
        },
        AND: [
          {
            participants: {
              some: { userId: user1Id },
            },
          },
          {
            participants: {
              some: { userId: user2Id },
            },
          },
        ],
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                lastActive: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (existingChat) {
      return existingChat;
    }

    // Create new chat
    const newChat = await prisma.chat.create({
      data: {
        type: "DIRECT",
        name: null, // Direct chats don't have names
        participants: {
          create: [{ userId: user1Id }, { userId: user2Id }],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                lastActive: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    // Publish chat created event
    // await kafkaProducer.publishEvent({
    //   type: "DIRECT_CHAT_CREATED",
    //   data: {
    //     chatId: newChat.id,
    //     participants: [user1Id, user2Id],
    //     createdAt: new Date().toISOString(),
    //   },
    // });

    // Notify both users via Pusher about new chat
    const otherParticipants = newChat.participants.filter((p) => p.userId !== user1Id);
    if (otherParticipants.length > 0) {
      await notifyUserNewChat(user2Id, {
        chatId: newChat.id,
        type: newChat.type || "DIRECT",
        otherParticipant: {
          id: user1Id,
          username: newChat.participants.find((p) => p.userId === user1Id)?.user.username || "",
          firstName: newChat.participants.find((p) => p.userId === user1Id)?.user.firstName || null,
          lastName: newChat.participants.find((p) => p.userId === user1Id)?.user.lastName || null,
        },
      });
    }

    return newChat;
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Create project chat
 */
export const createProjectChat = async (projectId: string, creatorId: string): Promise<any> => {
  try {
    // Verify project exists and user has access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        collaborators: {
          some: { id: creatorId },
        },
      },
      include: {
        collaborators: {
          select: { id: true },
        },
      },
    });

    if (!project) {
      throw new NotFoundError("Project not found or access denied", "PROJECT_NOT_FOUND");
    }

    // Create project chat
    const projectChat = await prisma.chat.create({
      data: {
        type: "PROJECT",
        name: `${project.title} Discussion`,
        projectId: project.id,
        participants: {
          create: project.collaborators.map((collaborator) => ({
            userId: collaborator.id,
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                lastActive: true,
              },
            },
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    // Publish project chat created event
    // await kafkaProducer.publishEvent({
    //   type: "PROJECT_CHAT_CREATED",
    //   data: {
    //     chatId: projectChat.id,
    //     projectId: project.id,
    //     participantCount: project.collaborators.length,
    //     createdBy: creatorId,
    //     createdAt: new Date().toISOString(),
    //   },
    // });

    return projectChat;
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Send message in chat
 */
export const sendMessage = async (
  chatId: string,
  senderId: string,
  content: string,
  messageType: "TEXT" | "IMAGE" | "FILE" = "TEXT",
  mediaUrl?: string
): Promise<any> => {
  try {
    // Verify user is participant in chat
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        participants: {
          some: { userId: senderId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, username: true },
            },
          },
        },
      },
    });

    if (!chat) {
      throw new NotFoundError("Chat not found or access denied", "CHAT_NOT_FOUND");
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        messageType,
        mediaUrl,
        senderId,
        chatId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        chat: {
          select: {
            id: true,
            type: true,
            name: true,
            projectId: true,
          },
        },
      },
    });

    // Update chat's last message timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        updatedAt: new Date(),
        lastMessageAt: new Date(),
      },
    });

    // Update unread counts for other participants
    const otherParticipants = chat.participants.filter((p) => p.userId !== senderId);

    if (otherParticipants.length > 0) {
      await Promise.all(
        otherParticipants.map((participant) =>
          prisma.userChat.upsert({
            where: {
              userId_chatId: {
                userId: participant.userId,
                chatId: chatId,
              },
            },
            create: {
              userId: participant.userId,
              chatId: chatId,
              unreadCount: 1,
            },
            update: {
              unreadCount: { increment: 1 },
            },
          })
        )
      );
    }

    // Publish message sent event to Kafka
    // Kafka event disabled
    // await kafkaProducer.publishEvent({
    //   type: "MESSAGE_SENT",
    //   data: {
    //     messageId: message.id,
    //     chatId,
    //     senderId,
    //     content,
    //     messageType,
    //     mediaUrl,
    //     recipients: otherParticipants.map((p) => p.userId),
    //     sentAt: new Date().toISOString(),
    //   },
    // });

    // Broadcast message to chat channel via Pusher for real-time delivery
    await broadcastMessage(chatId, {
      id: message.id,
      content: message.content,
      messageType: message.messageType || "TEXT",
      mediaUrl: message.mediaUrl,
      senderId: message.senderId,
      sender: message.sender,
      createdAt: message.createdAt,
    });

    // Invalidate chat messages cache for this chat
    await deleteCache(CacheKeys.chatMessages(chatId, 1, 50));

    return message;
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Get chat messages with pagination
 */
export const getChatMessages = async (
  chatId: string,
  userId: string,
  page: number = 1,
  limit: number = 50
): Promise<{ messages: any[]; totalCount: number; hasMore: boolean }> => {
  try {
    // Only cache first page for better performance
    if (page === 1) {
      return await getOrSetCache(
        CacheKeys.chatMessages(chatId, page, limit),
        async () => {
          return await fetchChatMessages(chatId, userId, page, limit);
        },
        CACHE_TTL.CHAT_MESSAGES
      );
    }

    return await fetchChatMessages(chatId, userId, page, limit);
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Helper function to fetch chat messages (used by getChatMessages with caching)
 */
const fetchChatMessages = async (
  chatId: string,
  userId: string,
  page: number,
  limit: number
): Promise<{ messages: any[]; totalCount: number; hasMore: boolean }> => {
  // Verify user is participant in chat
  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      participants: {
        some: { userId },
      },
    },
  });

  if (!chat) {
    throw new NotFoundError("Chat not found or access denied", "CHAT_NOT_FOUND");
  }

  const skip = (page - 1) * limit;

  // Get messages with pagination
  const [messages, totalCount] = await Promise.all([
      prisma.message.findMany({
        where: { chatId },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.message.count({ where: { chatId } }),
    ]);

    // Mark messages as read for the requesting user
    await prisma.userChat.upsert({
      where: {
        userId_chatId: {
          userId,
          chatId,
        },
      },
      create: {
        userId,
        chatId,
        unreadCount: 0,
        lastReadAt: new Date(),
      },
      update: {
        unreadCount: 0,
        lastReadAt: new Date(),
      },
    });

  const hasMore = skip + limit < totalCount;

  return {
    messages: messages.reverse(), // Return in chronological order
    totalCount,
    hasMore,
  };
};

/**
 * Get user chats
 */
export const getUserChats = async (userId: string): Promise<any[]> => {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    // Get unread counts
    const unreadCounts = await prisma.userChat.findMany({
      where: { userId },
      select: { chatId: true, unreadCount: true },
    });

    const unreadCountMap = unreadCounts.reduce(
      (acc, userChat) => {
        acc[userChat.chatId] = userChat.unreadCount;
        return acc;
      },
      {} as Record<string, number>
    );

    return chats.map((chat) => ({
      ...chat,
      unreadCount: unreadCountMap[chat.id] || 0,
      lastMessage: chat.messages[0] || null,
      otherParticipants: chat.participants.filter((p) => p.userId !== userId),
    }));
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Delete message
 */
export const deleteMessage = async (messageId: string, userId: string): Promise<any> => {
  try {
    // Verify user owns the message
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        senderId: userId,
      },
      include: {
        chat: {
          include: {
            participants: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!message) {
      throw new NotFoundError("Message not found or access denied", "MESSAGE_NOT_FOUND");
    }

    // Soft delete the message
    const deletedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        content: "[Message deleted]",
        mediaUrl: null,
        deletedAt: new Date(),
      },
    });

    // Broadcast message deletion via Pusher
    await broadcastMessageDeleted(message.chatId, messageId);

    // Publish message deleted event to Kafka
    // await kafkaProducer.publishEvent({
    //   type: "MESSAGE_DELETED",
    //   data: {
    //     messageId,
    //     chatId: message.chatId,
    //     deletedAt: new Date().toISOString(),
    //   },
    // });

    return deletedMessage;
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Get total unread message count for user
 */
export const getTotalUnreadCount = async (userId: string): Promise<number> => {
  try {
    const result = await prisma.userChat.aggregate({
      where: { userId },
      _sum: { unreadCount: true },
    });

    return result._sum.unreadCount || 0;
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Add user to chat
 */
export const addUserToChat = async (
  chatId: string,
  userId: string,
  addedBy: string
): Promise<void> => {
  try {
    // Check if user is already a participant
    const existingParticipant = await prisma.chatParticipant.findFirst({
      where: {
        chatId,
        userId,
      },
    });

    if (existingParticipant) {
      throw new ConflictError("User is already a participant in this chat", "USER_ALREADY_IN_CHAT");
    }

    // Add user as participant
    await prisma.chatParticipant.create({
      data: {
        chatId,
        userId,
      },
    });

    // Notify user via Pusher about being added to chat
    await notifyUserAddedToChat(userId, chatId, addedBy);

    // Publish user added to chat event to Kafka
    // await kafkaProducer.publishEvent({
    //   type: "USER_ADDED_TO_CHAT",
    //   data: {
    //     chatId,
    //     userId,
    //     addedBy,
    //     addedAt: new Date().toISOString(),
    //   },
    // });
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Set typing indicator for user in chat
 */
export const setTypingIndicator = async (
  chatId: string,
  userId: string,
  isTyping: boolean
): Promise<void> => {
  try {
    // Get user info for typing indicator
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true },
    });

    // Broadcast typing indicator via Pusher for real-time updates
    if (user) {
      await broadcastTypingIndicator(chatId, userId, user.username, isTyping);
    }

    // Publish typing indicator event to Kafka
    // await kafkaProducer.publishEvent({
    //   type: "TYPING_INDICATOR",
    //   data: {
    //     chatId,
    //     userId,
    //     isTyping,
    //     timestamp: new Date().toISOString(),
    //   },
    // });
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * Get unread message count for user
 */
export const getUnreadMessageCount = async (userId: string): Promise<number> => {
  return getTotalUnreadCount(userId);
};

/**
 * Add user to project chat (alias for addUserToChat for project chats)
 */
export const addUserToProjectChat = async (
  chatId: string,
  userId: string,
  addedBy: string
): Promise<void> => {
  return addUserToChat(chatId, userId, addedBy);
};

/**
 * Get all users that the authenticated user has started DM chats with
 */
export const getDMMembers = async (
  userId: string,
  searchQuery?: string
): Promise<any[]> => {
  try {
    // Get all DIRECT chats for the user
    const directChats = await prisma.chat.findMany({
      where: {
        type: "DIRECT",
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                lastActive: true,
              },
            },
          },
        },
      },
    });

    // Extract unique users (excluding the requesting user)
    const dmUsersMap = new Map();
    for (const chat of directChats) {
      for (const participant of chat.participants) {
        if (participant.userId !== userId && !dmUsersMap.has(participant.userId)) {
          dmUsersMap.set(participant.userId, participant.user);
        }
      }
    }

    let dmUsers = Array.from(dmUsersMap.values());

    // Apply search filter if provided
    if (searchQuery && searchQuery.trim().length > 0) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      dmUsers = dmUsers.filter((user) => {
        const username = user.username?.toLowerCase() || "";
        const firstName = user.firstName?.toLowerCase() || "";
        const lastName = user.lastName?.toLowerCase() || "";
        const fullName = `${firstName} ${lastName}`.trim();

        return (
          username.includes(lowerQuery) ||
          firstName.includes(lowerQuery) ||
          lastName.includes(lowerQuery) ||
          fullName.includes(lowerQuery)
        );
      });
    }

    return dmUsers;
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: error }
    );
  }
};
