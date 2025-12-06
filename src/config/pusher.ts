import Pusher from "pusher";
import { ENV } from "./env";

/**
 * =============================================================================
 * PUSHER CONFIGURATION - REAL-TIME COMMUNICATION
 * =============================================================================
 *
 * Pusher setup for real-time features in Labyrinth platform:
 * - Real-time chat messages
 * - Typing indicators
 * - User presence
 * - Notifications
 *
 * Channels:
 * - private-chat-{chatId} - Chat messages
 * - private-user-{userId} - User notifications
 * - presence-chat-{chatId} - Online presence in chat
 *
 * =============================================================================
 */

let pusherInstance: Pusher | null = null;

export const getPusherInstance = (): Pusher => {
  if (!pusherInstance) {
    // Check if Pusher credentials are configured
    if (!ENV.pusherAppId || !ENV.pusherKey || !ENV.pusherSecret) {
      console.warn("⚠️  Pusher credentials not configured. Real-time features will be disabled.");
      console.warn("ℹ️  Set PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET in .env to enable Pusher");
      
      // Return a mock Pusher instance that does nothing
      return {
        trigger: async () => ({ channels: {}, batch: [] }),
        triggerBatch: async () => ({ batch: [] }),
      } as any;
    }

    pusherInstance = new Pusher({
      appId: ENV.pusherAppId,
      key: ENV.pusherKey,
      secret: ENV.pusherSecret,
      cluster: ENV.pusherCluster,
      useTLS: true,
    });

    console.log("✅ Pusher initialized successfully");
  }

  return pusherInstance;
};

// Export singleton instance
export const pusher = getPusherInstance();

/**
 * Check if Pusher is properly configured
 */
export const isPusherEnabled = (): boolean => {
  return !!(ENV.pusherAppId && ENV.pusherKey && ENV.pusherSecret);
};
