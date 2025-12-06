import { Consumer, EachMessagePayload } from "kafkajs";
import { kafka, KAFKA_TOPICS } from "../config/kafka";

/**
 * =============================================================================
 * KAFKA CONSUMER SERVICE
 * =============================================================================
 *
 * Centralized service for consuming events from Kafka topics
 * Handles event processing with proper error handling and message acknowledgment
 *
 * =============================================================================
 */

// Type definition for event handler functions
// All handlers must be async and accept any payload type
type EventHandler = (payload: any) => Promise<void>;

/**
 * Kafka Consumer Service Class
 * 
 * Manages Kafka message consumption for the Labyrinth platform.
 * Implements event-driven architecture by subscribing to topics and
 * dispatching messages to registered handlers.
 * 
 * Features:
 * - Consumer group management for load balancing
 * - Event handler registry for flexible message routing
 * - Auto-reconnection and error recovery
 * - Environment-specific timeouts and retry policies
 */
class KafkaConsumerService {
  // Kafka consumer instance
  private consumer: Consumer;
  
  // Map of event types to their handler functions
  // Allows dynamic registration and routing of events
  private eventHandlers: Map<string, EventHandler> = new Map();
  
  // Connection state tracker
  private isConnected = false;

  /**
   * Constructor - Initialize Kafka consumer
   * 
   * Consumer groups enable parallel processing and load balancing:
   * - Multiple consumers with same groupId share partition load
   * - Each message processed by only one consumer in the group
   * - Kafka tracks offsets per consumer group
   * 
   * Environment-specific configuration:
   * - Development: Lower timeouts for faster feedback
   * - Production: Higher timeouts for stability and resilience
   * 
   * @param groupId - Consumer group identifier for load balancing
   */
  constructor(groupId: string = "labyrinth-backend-group") {
    const isDevelopment = process.env.NODE_ENV !== "production";
    
    this.consumer = kafka.consumer({
      // Consumer group ID: all consumers with same ID share workload
      groupId,
      
      // Session timeout: max time between heartbeats before consumer considered dead
      // Dev: 10s for quick iteration, Prod: 30s for network stability
      sessionTimeout: isDevelopment ? 10000 : 30000,
      
      // Heartbeat interval: how often consumer sends "I'm alive" signal
      // Should be lower than sessionTimeout (typically 1/3)
      heartbeatInterval: isDevelopment ? 1000 : 3000,
      
      // Max wait time for fetching messages from broker
      // Affects latency vs throughput tradeoff
      maxWaitTimeInMs: isDevelopment ? 2000 : 5000,
      
      // Retry configuration for failed operations
      retry: {
        initialRetryTime: 100, // Start with 100ms delay
        retries: isDevelopment ? 2 : 8, // Fewer retries in dev for faster failure
      },
    });
  }

  /**
   * Connect to Kafka Broker
   * 
   * Establishes connection to Kafka cluster and joins consumer group.
   * Connection is maintained across multiple topic subscriptions.
   * 
   * Process:
   * 1. Check if already connected (idempotent operation)
   * 2. Connect to broker and join consumer group
   * 3. Begin heartbeat mechanism to maintain group membership
   * 4. Set connection flag and log success
   * 
   * @throws Error if connection fails
   */
  async connect(): Promise<void> {
    // Guard: Skip if already connected
    if (this.isConnected) return;

    try {
      // Connect to Kafka broker and join consumer group
      // Kafka assigns partitions based on group coordination protocol
      await this.consumer.connect();
      
      // Mark as connected
      this.isConnected = true;
      
      // Log for monitoring
      console.log("Kafka Consumer connected");
    } catch (error) {
      // Log and re-throw connection failures
      console.error("Failed to connect Kafka Consumer:", error);
      throw error;
    }
  }

  /**
   * Disconnect from Kafka
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      console.log("Kafka Consumer already disconnected");
      return;
    }

    try {
      await this.consumer.disconnect();
      this.isConnected = false;
      console.log("Kafka Consumer disconnected");
    } catch (error) {
      console.warn(
        "Failed to disconnect Kafka Consumer (was not connected):",
        error instanceof Error ? error.message : error
      );
      this.isConnected = false; // Reset state even if disconnect fails
    }
  }

  /**
   * Subscribe to Topics and Start Consuming
   * 
   * Subscribes to specified Kafka topics and begins message consumption.
   * Messages are processed by registered event handlers based on event type.
   * 
   * Subscription behavior:
   * - fromBeginning: false = only consume new messages (not historical)
   * - Consumer group ensures each message processed once per group
   * - Partitions automatically assigned by Kafka coordinator
   * 
   * Message processing:
   * - Each message passed to handleMessage()
   * - Event type extracted and routed to appropriate handler
   * - Automatic offset commit after successful processing
   * 
   * Error handling:
   * - Development: Log and continue (graceful degradation)
   * - Production: Throw error (fail fast for critical issues)
   * 
   * @param topics - Array of topic names to subscribe to
   * @throws Error in production if subscription or consumption fails
   */
  async startConsuming(topics: string[]): Promise<void> {
    try {
      // Ensure connection established before subscribing
      await this.connect();

      // Subscribe to each topic in the list
      // fromBeginning: false = start from latest offset, not replay history
      for (const topic of topics) {
        await this.consumer.subscribe({ 
          topic, 
          // Don't replay historical messages, only consume new ones
          // Set to true if you need to reprocess all messages
          fromBeginning: false 
        });
        console.log(`📥 Subscribed to topic: ${topic}`);
      }

      // Start message consumption loop
      // eachMessage callback invoked for every message received
      await this.consumer.run({
        // Bind handleMessage to this instance for proper context
        eachMessage: this.handleMessage.bind(this),
      });

      console.log("Kafka Consumer started consuming messages");
    } catch (error) {
      // Environment-specific error handling
      const isDevelopment = process.env.NODE_ENV !== "production";
      
      if (isDevelopment) {
        // Development: Log warning and continue without Kafka
        // Allows local development without Kafka infrastructure
        console.warn(
          "⚠️  Failed to start Kafka consumer (development mode):",
          error instanceof Error ? error.message : error
        );
        return; // Graceful degradation
      } else {
        // Production: Fail fast - Kafka is critical infrastructure
        console.error("Failed to start consuming:", error);
        throw error;
      }
    }
  }

  /**
   * Handle Incoming Kafka Message
   * 
   * Core message processing method called for each consumed message.
   * Deserializes message, extracts event type, and routes to handler.
   * 
   * Message flow:
   * 1. Validate message has value (not tombstone)
   * 2. Parse JSON payload from message bytes
   * 3. Extract event type from payload.type
   * 4. Look up registered handler for event type
   * 5. Execute handler with payload
   * 6. Log success or no-handler warning
   * 
   * Error handling:
   * - Catch and log errors to prevent consumer crash
   * - Failed messages logged but not retried automatically
   * - Consider DLQ (Dead Letter Queue) for production
   * 
   * Offset management:
   * - Kafka auto-commits offset after this method returns
   * - Throwing error would prevent offset commit (message reprocessed)
   * - Current impl: catch errors, log, and let offset commit (at-most-once)
   * 
   * @param payload - Kafka message payload with topic, partition, message
   */
  private async handleMessage({ topic, partition, message }: EachMessagePayload): Promise<void> {
    try {
      // Guard: Skip tombstone messages (null value used for deletion in compacted topics)
      if (!message.value) return;

      // Deserialize JSON payload from message bytes
      // Message value is Buffer, convert to string then parse
      const payload = JSON.parse(message.value.toString());
      
      // Extract event type for handler routing
      // All events must have a 'type' field for proper routing
      const eventType = payload.type;

      // Log message receipt for monitoring and debugging
      console.log(`📨 Received event ${eventType} from ${topic}:${partition}`);

      // Look up handler for this event type in registry
      const handler = this.eventHandlers.get(eventType);
      
      if (handler) {
        // Execute handler with full payload
        // Handler is async so await completion
        await handler(payload);
        console.log(`Successfully processed ${eventType}`);
      } else {
        // No handler registered for this event type
        // Not an error - some events may not need processing in this service
        console.log(`⚠ No handler found for event type: ${eventType}`);
      }
    } catch (error) {
      // Catch errors to prevent consumer crash
      // Log error with context for debugging
      console.error(`Failed to process message from ${topic}:`, error);
      
      // TODO: Production improvement - send failed messages to DLQ
      // Dead Letter Queue allows manual review and reprocessing
      // await sendToDeadLetterQueue(topic, message, error);
    }
  }

  /**
   * Register event handler
   */
  registerHandler(eventType: string, handler: EventHandler): void {
    this.eventHandlers.set(eventType, handler);
    console.log(`🔧 Registered handler for event: ${eventType}`);
  }

  /**
   * Unregister event handler
   */
  unregisterHandler(eventType: string): void {
    this.eventHandlers.delete(eventType);
    console.log(`🗑️ Unregistered handler for event: ${eventType}`);
  }

  // =============================================================================
  // BUILT-IN EVENT HANDLERS
  // =============================================================================

  /**
   * Setup default event handlers
   */
  setupDefaultHandlers(): void {
    // User Events
    this.registerHandler("USER_REGISTERED", this.handleUserRegistered.bind(this));
    this.registerHandler("USER_PROFILE_UPDATED", this.handleUserProfileUpdated.bind(this));
    this.registerHandler("USER_ACTIVITY", this.handleUserActivity.bind(this));

    // Chat Events
    this.registerHandler("MESSAGE_SENT", this.handleMessageSent.bind(this));
    this.registerHandler("TYPING_INDICATOR", this.handleTypingIndicator.bind(this));
    this.registerHandler("MESSAGE_READ", this.handleMessageRead.bind(this));

    // Match Events
    this.registerHandler("SWIPE_ACTION", this.handleSwipeAction.bind(this));
    this.registerHandler("MATCH_CREATED", this.handleMatchCreated.bind(this));
    this.registerHandler("RECOMMENDATION_GENERATED", this.handleRecommendationGenerated.bind(this));

    // Project Events
    this.registerHandler("PROJECT_CREATED", this.handleProjectCreated.bind(this));
    this.registerHandler("PROJECT_UPDATED", this.handleProjectUpdated.bind(this));
    this.registerHandler("USER_JOINED_PROJECT", this.handleUserJoinedProject.bind(this));

    // Notification Events
    this.registerHandler("NOTIFICATION", this.handleNotification.bind(this));

    // Analytics Events
    this.registerHandler("ANALYTICS_EVENT", this.handleAnalyticsEvent.bind(this));

    console.log("✅ Default event handlers registered");
  }

  // =============================================================================
  // EVENT HANDLER IMPLEMENTATIONS
  // =============================================================================

  private async handleUserRegistered(payload: any): Promise<void> {
    // Handle user registration event
    // e.g., send welcome email, create analytics entry
    console.log("👤 Processing user registration:", payload.userId);

    // TODO: Implement specific logic
    // - Send welcome notification
    // - Initialize user analytics
    // - Trigger recommendation engine for new user
  }

  private async handleUserProfileUpdated(payload: any): Promise<void> {
    // Handle user profile update event
    console.log("👤 Processing profile update:", payload.userId);

    // TODO: Implement specific logic
    // - Update search indexes
    // - Refresh recommendations
    // - Notify connected users
  }

  private async handleUserActivity(payload: any): Promise<void> {
    // Handle user activity event
    console.log("📊 Processing user activity:", payload.userId, payload.activity);

    // TODO: Implement specific logic
    // - Update last active timestamp
    // - Track user engagement metrics
  }

  private async handleMessageSent(payload: any): Promise<void> {
    // Handle message sent event
    console.log("💬 Processing message sent:", payload.chatId);

    // TODO: Implement specific logic
    // - Send push notifications to chat participants
    // - Update unread message counts
    // - Store message in persistent storage if needed
  }

  private async handleTypingIndicator(payload: any): Promise<void> {
    // Handle typing indicator event
    console.log("⌨️ Processing typing indicator:", payload.chatId, payload.isTyping);

    // TODO: Implement specific logic
    // - Broadcast to other chat participants via WebSocket
    // - Set TTL for typing status
  }

  private async handleMessageRead(payload: any): Promise<void> {
    // Handle message read event
    console.log("👁️ Processing message read:", payload.messageId);

    // TODO: Implement specific logic
    // - Update message read status
    // - Send read receipts to sender
  }

  private async handleSwipeAction(payload: any): Promise<void> {
    // Handle swipe action event
    console.log("👆 Processing swipe action:", payload.userId);

    // TODO: Implement specific logic
    // - Update recommendation algorithm
    // - Check for mutual matches
    // - Trigger match notifications
  }

  private async handleMatchCreated(payload: any): Promise<void> {
    // Handle match created event
    console.log("💫 Processing match created:", payload.matchId);

    // TODO: Implement specific logic
    // - Send match notifications to both users
    // - Create initial chat room
    // - Update user statistics
  }

  private async handleRecommendationGenerated(payload: any): Promise<void> {
    // Handle recommendation generated event
    console.log("🎯 Processing recommendations:", payload.userId);

    // TODO: Implement specific logic
    // - Cache recommendations
    // - Send notification about new recommendations
  }

  private async handleProjectCreated(payload: any): Promise<void> {
    // Handle project created event
    console.log("🚀 Processing project created:", payload.projectId);

    // TODO: Implement specific logic
    // - Initialize project analytics
    // - Set up project workspace
    // - Notify relevant users
  }

  private async handleProjectUpdated(payload: any): Promise<void> {
    // Handle project updated event
    console.log("📝 Processing project updated:", payload.projectId);

    // TODO: Implement specific logic
    // - Notify project collaborators
    // - Update search indexes
  }

  private async handleUserJoinedProject(payload: any): Promise<void> {
    // Handle user joined project event
    console.log("👥 Processing user joined project:", payload.projectId, payload.userId);

    // TODO: Implement specific logic
    // - Add user to project chat
    // - Send welcome message
    // - Update project analytics
  }

  private async handleNotification(payload: any): Promise<void> {
    // Handle notification event
    console.log("🔔 Processing notification:", payload.userId);

    // TODO: Implement specific logic
    // - Send push notification
    // - Store in notification center
    // - Update notification counts
  }

  private async handleAnalyticsEvent(payload: any): Promise<void> {
    // Handle analytics event
    console.log("📊 Processing analytics event:", payload.event);

    // TODO: Implement specific logic
    // - Store in analytics database
    // - Update metrics dashboards
    // - Trigger alerts if needed
  }
}

// Export singleton instance
export const kafkaConsumer = new KafkaConsumerService();
export default kafkaConsumer;
