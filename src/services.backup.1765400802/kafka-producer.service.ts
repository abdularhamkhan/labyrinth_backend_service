import { Producer, ProducerRecord } from "kafkajs";
import { kafka, KAFKA_TOPICS } from "../config/kafka";

/**
 * =============================================================================
 * KAFKA PRODUCER SERVICE
 * =============================================================================
 *
 * Centralized service for publishing events to Kafka topics
 * Handles all event publishing with proper error handling and retry logic
 *
 * =============================================================================
 */

/**
 * Kafka Producer Service Class
 * 
 * Singleton service that manages Kafka message publishing for all events
 * in the Labyrinth platform. Provides type-safe methods for publishing
 * domain-specific events to appropriate Kafka topics.
 * 
 * Features:
 * - Automatic topic routing based on event type
 * - Connection management with auto-reconnect
 * - Error handling with graceful degradation in development
 * - Event enrichment with timestamps and metadata
 * - Partitioning by entity IDs for ordering guarantees
 */
class KafkaProducerService {
  // Kafka producer instance from kafkajs library
  private producer: Producer;
  
  // Connection state flag to prevent duplicate connections
  private isConnected = false;

  /**
   * Constructor - Initialize Kafka producer with configuration
   * 
   * Configuration:
   * - allowAutoTopicCreation: false - Topics must be created explicitly for safety
   * - transactionTimeout: 30000ms - Max time for transactional operations
   */
  constructor() {
    this.producer = kafka.producer({
      // Disable auto topic creation to prevent accidental topic creation
      // Topics should be created via admin API with proper configuration
      allowAutoTopicCreation: false,
      
      // Transaction timeout: 30 seconds max for atomic operations
      // Applies to transactional producers (not used currently but configured)
      transactionTimeout: 30000,
    });
  }

  /**
   * Connect to Kafka Broker
   * 
   * Establishes connection to Kafka broker cluster. Connection is reused
   * across all message sends for efficiency. Idempotent - safe to call
   * multiple times.
   * 
   * Connection lifecycle:
   * 1. Check if already connected (early return if yes)
   * 2. Attempt connection to broker(s) defined in config
   * 3. Set connection flag and log success
   * 4. On failure, log error and throw (caller handles retry)
   * 
   * @throws Error if connection fails (network, authentication, etc.)
   */
  async connect(): Promise<void> {
    // Guard: Skip if already connected to avoid duplicate connections
    if (this.isConnected) return;

    try {
      // Establish TCP connection to Kafka broker(s)
      // Uses brokers from config (supports multiple for HA)
      await this.producer.connect();
      
      // Mark as connected to prevent reconnection attempts
      this.isConnected = true;
      
      // Log for monitoring and debugging
      console.log("Kafka Producer connected");
    } catch (error) {
      // Log connection failure with error details
      console.error("Failed to connect Kafka Producer:", error);
      
      // Re-throw to let caller handle (retry, fallback, etc.)
      throw error;
    }
  }

  /**
   * Disconnect from Kafka Broker
   * 
   * Gracefully closes connection to Kafka. Should be called during
   * application shutdown to ensure clean closure and prevent resource leaks.
   * 
   * Disconnect process:
   * 1. Check if connected (early return if not)
   * 2. Send disconnect signal to broker
   * 3. Clear connection flag
   * 4. Log completion
   * 
   * Note: Errors during disconnect are logged but not thrown since
   * this is typically called during shutdown where error recovery
   * is not possible.
   */
  async disconnect(): Promise<void> {
    // Guard: Skip if not connected
    if (!this.isConnected) return;

    try {
      // Send graceful disconnect to broker
      // Waits for in-flight messages to complete
      await this.producer.disconnect();
      
      // Reset connection flag
      this.isConnected = false;
      
      // Log for monitoring
      console.log("Kafka Producer disconnected");
    } catch (error) {
      // Log disconnect errors but don't throw
      // Disconnect usually happens during shutdown where recovery is not needed
      console.error("Failed to disconnect Kafka Producer:", error);
    }
  }

  /**
   * Send Message to Kafka Topic
   * 
   * Core method for publishing messages to any Kafka topic. Handles
   * connection management, serialization, and error handling.
   * 
   * Message flow:
   * 1. Ensure connection is established (auto-connect if needed)
   * 2. Construct ProducerRecord with topic, message, and key
   * 3. Serialize message to JSON string
   * 4. Send to broker and await acknowledgment
   * 5. Log success or handle errors
   * 
   * Partitioning:
   * - If key provided: message goes to partition based on key hash
   * - If no key: round-robin distribution across partitions
   * - Same key = same partition = ordering guarantee
   * 
   * Error handling:
   * - Development: Log warning and continue (graceful degradation)
   * - Production: Throw error to force caller to handle
   * 
   * @param topic - Kafka topic name (use KAFKA_TOPICS constants)
   * @param message - Message payload (will be JSON serialized)
   * @param key - Optional partition key for ordering (userId, chatId, etc.)
   * @throws Error in production if send fails
   */
  async sendMessage(topic: string, message: any, key?: string): Promise<void> {
    try {
      // Ensure connection is established before sending
      // Auto-connects if not already connected
      await this.connect();

      // Construct Kafka ProducerRecord
      // Record contains topic, messages array, and optional configuration
      const record: ProducerRecord = {
        topic,
        messages: [
          {
            // Partition key: determines message routing
            // null = round-robin, value = hash-based partition selection
            key: key || null,
            
            // Message value: JSON serialized payload
            // Kafka messages are byte arrays, we use JSON for structure
            value: JSON.stringify(message),
            
            // Timestamp: when message was produced (for debugging/ordering)
            // Kafka uses this for retention and time-based queries
            timestamp: Date.now().toString(),
          },
        ],
      };

      // Send message to Kafka broker
      // Waits for broker acknowledgment before returning
      await this.producer.send(record);
      
      // Log successful publish with event type for monitoring
      console.log(`📤 Event published to ${topic}:`, message.type || "unknown");
    } catch (error) {
      // Log failure with context
      console.warn(
        `⚠️  Failed to publish to ${topic} (Kafka not available):`,
        error instanceof Error ? error.message : error
      );
      
      // Environment-specific error handling:
      // Development: Graceful degradation - log and continue
      //              Allows app to work without Kafka for local dev
      // Production: Throw error - force caller to handle failure
      //             Critical events must not be silently dropped
      if (process.env.NODE_ENV === "production") {
        throw error;
      }
    }
  }

  /**
   * Publish Generic Event (Backward Compatibility)
   * 
   * Convenience method that automatically routes events to appropriate topics
   * based on event type string matching. Useful for generic event publishing
   * where specific topic is not known at compile time.
   * 
   * Routing logic:
   * - Extracts entity type from event.type string
   * - Maps to appropriate Kafka topic via getTopicForEventType()
   * - Uses entity ID (userId/chatId/projectId) as partition key
   * 
   * Example:
   * await publishEvent({
   *   type: 'USER_PROFILE_UPDATED',
   *   userId: '123',
   *   data: { ... }
   * });
   * 
   * @param event - Event object with type, data, and entity IDs
   */
  async publishEvent(event: { type: string; data?: any; [key: string]: any }): Promise<void> {
    // Determine which topic to send to based on event type
    const topic = this.getTopicForEventType(event.type);
    
    // Send with entity ID as key for partition routing
    // Tries userId first, then chatId, then projectId
    await this.sendMessage(topic, event, event.userId || event.chatId || event.projectId);
  }

  /**
   * Map Event Types to Kafka Topics
   * 
   * Private helper method that routes events to appropriate topics based on
   * event type naming conventions. Uses string matching on event type to
   * determine domain.
   * 
   * Matching rules:
   * - Contains "USER" or "PROFILE" → USER_EVENTS topic
   * - Contains "CHAT" or "MESSAGE" → CHAT_EVENTS topic
   * - Contains "MATCH" or "SWIPE" → MATCH_EVENTS topic
   * - Contains "PROJECT" or "TASK" → PROJECT_EVENTS topic
   * - Contains "NOTIFICATION" → NOTIFICATION_EVENTS topic
   * - Default fallback → USER_EVENTS topic
   * 
   * @param eventType - Event type string (e.g., "USER_REGISTERED")
   * @returns Kafka topic name
   */
  private getTopicForEventType(eventType: string): string {
    if (eventType.includes("USER") || eventType.includes("PROFILE")) {
      return KAFKA_TOPICS.USER_EVENTS;
    }
    if (eventType.includes("CHAT") || eventType.includes("MESSAGE")) {
      return KAFKA_TOPICS.CHAT_EVENTS;
    }
    if (eventType.includes("MATCH") || eventType.includes("SWIPE")) {
      return KAFKA_TOPICS.MATCH_EVENTS;
    }
    if (eventType.includes("PROJECT") || eventType.includes("TASK")) {
      return KAFKA_TOPICS.PROJECT_EVENTS;
    }
    if (eventType.includes("NOTIFICATION")) {
      return KAFKA_TOPICS.NOTIFICATION_EVENTS;
    }
    return KAFKA_TOPICS.USER_EVENTS; // Default fallback
  }

  // =============================================================================
  // USER EVENTS
  // =============================================================================

  async publishUserRegistered(userId: string, userData: any): Promise<void> {
    await this.sendMessage(
      KAFKA_TOPICS.USER_EVENTS,
      {
        type: "USER_REGISTERED",
        userId,
        data: userData,
        timestamp: new Date().toISOString(),
      },
      userId
    );
  }

  async publishUserProfileUpdated(userId: string, updates: any): Promise<void> {
    await this.sendMessage(
      KAFKA_TOPICS.USER_EVENTS,
      {
        type: "USER_PROFILE_UPDATED",
        userId,
        data: updates,
        timestamp: new Date().toISOString(),
      },
      userId
    );
  }

  async publishUserActivity(userId: string, activity: string, metadata?: any): Promise<void> {
    await this.sendMessage(
      KAFKA_TOPICS.USER_EVENTS,
      {
        type: "USER_ACTIVITY",
        userId,
        activity,
        metadata,
        timestamp: new Date().toISOString(),
      },
      userId
    );
  }

  // =============================================================================
  // CHAT EVENTS
  // =============================================================================

  async publishMessageSent(chatId: string, message: any): Promise<void> {
    await this.sendMessage(
      KAFKA_TOPICS.CHAT_EVENTS,
      {
        type: "MESSAGE_SENT",
        chatId,
        message,
        timestamp: new Date().toISOString(),
      },
      chatId
    );
  }

  async publishTypingIndicator(chatId: string, userId: string, isTyping: boolean): Promise<void> {
    await this.sendMessage(
      KAFKA_TOPICS.CHAT_EVENTS,
      {
        type: "TYPING_INDICATOR",
        chatId,
        userId,
        isTyping,
        timestamp: new Date().toISOString(),
      },
      chatId
    );
  }

  async publishMessageRead(chatId: string, userId: string, messageId: string): Promise<void> {
    await this.sendMessage(
      KAFKA_TOPICS.CHAT_EVENTS,
      {
        type: "MESSAGE_READ",
        chatId,
        userId,
        messageId,
        timestamp: new Date().toISOString(),
      },
      chatId
    );
  }

  // =============================================================================
  // MATCH EVENTS
  // =============================================================================

  async publishSwipeAction(userId: string, swipeData: any): Promise<void> {
    await this.sendMessage(
      KAFKA_TOPICS.MATCH_EVENTS,
      {
        type: "SWIPE_ACTION",
        userId,
        data: swipeData,
        timestamp: new Date().toISOString(),
      },
      userId
    );
  }

  async publishMatchCreated(matchId: string, users: string[]): Promise<void> {
    await this.sendMessage(
      KAFKA_TOPICS.MATCH_EVENTS,
      {
        type: "MATCH_CREATED",
        matchId,
        users,
        timestamp: new Date().toISOString(),
      },
      matchId
    );
  }

  async publishRecommendationGenerated(userId: string, recommendations: any): Promise<void> {
    await this.sendMessage(
      KAFKA_TOPICS.MATCH_EVENTS,
      {
        type: "RECOMMENDATION_GENERATED",
        userId,
        recommendations,
        timestamp: new Date().toISOString(),
      },
      userId
    );
  }

  // =============================================================================
  // PROJECT EVENTS
  // =============================================================================

  async publishProjectCreated(projectId: string, projectData: any): Promise<void> {
    await this.sendMessage(
      KAFKA_TOPICS.PROJECT_EVENTS,
      {
        type: "PROJECT_CREATED",
        projectId,
        data: projectData,
        timestamp: new Date().toISOString(),
      },
      projectId
    );
  }

  async publishProjectUpdated(projectId: string, updates: any): Promise<void> {
    await this.sendMessage(
      KAFKA_TOPICS.PROJECT_EVENTS,
      {
        type: "PROJECT_UPDATED",
        projectId,
        updates,
        timestamp: new Date().toISOString(),
      },
      projectId
    );
  }

  async publishUserJoinedProject(projectId: string, userId: string, role?: string): Promise<void> {
    await this.sendMessage(
      KAFKA_TOPICS.PROJECT_EVENTS,
      {
        type: "USER_JOINED_PROJECT",
        projectId,
        userId,
        role,
        timestamp: new Date().toISOString(),
      },
      projectId
    );
  }

  // =============================================================================
  // NOTIFICATION EVENTS
  // =============================================================================

  async publishNotification(userId: string, notification: any): Promise<void> {
    await this.sendMessage(
      KAFKA_TOPICS.NOTIFICATION_EVENTS,
      {
        type: "NOTIFICATION",
        userId,
        notification,
        timestamp: new Date().toISOString(),
      },
      userId
    );
  }

  // =============================================================================
  // ANALYTICS EVENTS
  // =============================================================================

  async publishAnalyticsEvent(event: string, data: any): Promise<void> {
    await this.sendMessage(KAFKA_TOPICS.ANALYTICS_EVENTS, {
      type: "ANALYTICS_EVENT",
      event,
      data,
      timestamp: new Date().toISOString(),
    });
  }
}

// Export singleton instance
export const kafkaProducer = new KafkaProducerService();
export default kafkaProducer;
