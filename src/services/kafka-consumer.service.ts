import { Consumer, EachMessagePayload } from 'kafkajs';
import { kafka, KAFKA_TOPICS } from '../config/kafka';

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

type EventHandler = (payload: any) => Promise<void>;

class KafkaConsumerService {
  private consumer: Consumer;
  private eventHandlers: Map<string, EventHandler> = new Map();
  private isConnected = false;

  constructor(groupId: string = 'labyrinth-backend-group') {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    this.consumer = kafka.consumer({
      groupId,
      sessionTimeout: isDevelopment ? 10000 : 30000,
      heartbeatInterval: isDevelopment ? 1000 : 3000,
      maxWaitTimeInMs: isDevelopment ? 2000 : 5000,
      retry: {
        initialRetryTime: 100,
        retries: isDevelopment ? 2 : 8,
      },
    });
  }

  /**
   * Connect to Kafka
   */
  async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      await this.consumer.connect();
      this.isConnected = true;
      console.log('Kafka Consumer connected');
    } catch (error) {
      console.error('Failed to connect Kafka Consumer:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Kafka
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      console.log('Kafka Consumer already disconnected');
      return;
    }

    try {
      await this.consumer.disconnect();
      this.isConnected = false;
      console.log('Kafka Consumer disconnected');
    } catch (error) {
      console.warn('Failed to disconnect Kafka Consumer (was not connected):', error instanceof Error ? error.message : error);
      this.isConnected = false; // Reset state even if disconnect fails
    }
  }

  /**
   * Subscribe to topics and start consuming
   */
  async startConsuming(topics: string[]): Promise<void> {
    try {
      await this.connect();

      // Subscribe to all provided topics
      for (const topic of topics) {
        await this.consumer.subscribe({ topic, fromBeginning: false });
        console.log(`📥 Subscribed to topic: ${topic}`);
      }

      // Start consuming messages
      await this.consumer.run({
        eachMessage: this.handleMessage.bind(this),
      });

      console.log('Kafka Consumer started consuming messages');
    } catch (error) {
      const isDevelopment = process.env.NODE_ENV !== 'production';
      if (isDevelopment) {
        console.warn('⚠️  Failed to start Kafka consumer (development mode):', error instanceof Error ? error.message : error);
        return; // Don't throw in development
      } else {
        console.error('Failed to start consuming:', error);
        throw error;
      }
    }
  }

  /**
   * Handle incoming messages
   */
  private async handleMessage({ topic, partition, message }: EachMessagePayload): Promise<void> {
    try {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());
      const eventType = payload.type;

      console.log(`📨 Received event ${eventType} from ${topic}:${partition}`);

      // Find and execute handler
      const handler = this.eventHandlers.get(eventType);
      if (handler) {
        await handler(payload);
        console.log(`Successfully processed ${eventType}`);
      } else {
        console.log(`⚠ No handler found for event type: ${eventType}`);
      }
    } catch (error) {
      console.error(`Failed to process message from ${topic}:`, error);
      // In production, you might want to send to a dead letter queue
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
    this.registerHandler('USER_REGISTERED', this.handleUserRegistered.bind(this));
    this.registerHandler('USER_PROFILE_UPDATED', this.handleUserProfileUpdated.bind(this));
    this.registerHandler('USER_ACTIVITY', this.handleUserActivity.bind(this));

    // Chat Events
    this.registerHandler('MESSAGE_SENT', this.handleMessageSent.bind(this));
    this.registerHandler('TYPING_INDICATOR', this.handleTypingIndicator.bind(this));
    this.registerHandler('MESSAGE_READ', this.handleMessageRead.bind(this));

    // Match Events
    this.registerHandler('SWIPE_ACTION', this.handleSwipeAction.bind(this));
    this.registerHandler('MATCH_CREATED', this.handleMatchCreated.bind(this));
    this.registerHandler('RECOMMENDATION_GENERATED', this.handleRecommendationGenerated.bind(this));

    // Project Events
    this.registerHandler('PROJECT_CREATED', this.handleProjectCreated.bind(this));
    this.registerHandler('PROJECT_UPDATED', this.handleProjectUpdated.bind(this));
    this.registerHandler('USER_JOINED_PROJECT', this.handleUserJoinedProject.bind(this));

    // Notification Events
    this.registerHandler('NOTIFICATION', this.handleNotification.bind(this));

    // Analytics Events
    this.registerHandler('ANALYTICS_EVENT', this.handleAnalyticsEvent.bind(this));

    console.log('✅ Default event handlers registered');
  }

  // =============================================================================
  // EVENT HANDLER IMPLEMENTATIONS
  // =============================================================================

  private async handleUserRegistered(payload: any): Promise<void> {
    // Handle user registration event
    // e.g., send welcome email, create analytics entry
    console.log('👤 Processing user registration:', payload.userId);
    
    // TODO: Implement specific logic
    // - Send welcome notification
    // - Initialize user analytics
    // - Trigger recommendation engine for new user
  }

  private async handleUserProfileUpdated(payload: any): Promise<void> {
    // Handle user profile update event
    console.log('👤 Processing profile update:', payload.userId);
    
    // TODO: Implement specific logic
    // - Update search indexes
    // - Refresh recommendations
    // - Notify connected users
  }

  private async handleUserActivity(payload: any): Promise<void> {
    // Handle user activity event
    console.log('📊 Processing user activity:', payload.userId, payload.activity);
    
    // TODO: Implement specific logic
    // - Update last active timestamp
    // - Track user engagement metrics
  }

  private async handleMessageSent(payload: any): Promise<void> {
    // Handle message sent event
    console.log('💬 Processing message sent:', payload.chatId);
    
    // TODO: Implement specific logic
    // - Send push notifications to chat participants
    // - Update unread message counts
    // - Store message in persistent storage if needed
  }

  private async handleTypingIndicator(payload: any): Promise<void> {
    // Handle typing indicator event
    console.log('⌨️ Processing typing indicator:', payload.chatId, payload.isTyping);
    
    // TODO: Implement specific logic
    // - Broadcast to other chat participants via WebSocket
    // - Set TTL for typing status
  }

  private async handleMessageRead(payload: any): Promise<void> {
    // Handle message read event
    console.log('👁️ Processing message read:', payload.messageId);
    
    // TODO: Implement specific logic
    // - Update message read status
    // - Send read receipts to sender
  }

  private async handleSwipeAction(payload: any): Promise<void> {
    // Handle swipe action event
    console.log('👆 Processing swipe action:', payload.userId);
    
    // TODO: Implement specific logic
    // - Update recommendation algorithm
    // - Check for mutual matches
    // - Trigger match notifications
  }

  private async handleMatchCreated(payload: any): Promise<void> {
    // Handle match created event
    console.log('💫 Processing match created:', payload.matchId);
    
    // TODO: Implement specific logic
    // - Send match notifications to both users
    // - Create initial chat room
    // - Update user statistics
  }

  private async handleRecommendationGenerated(payload: any): Promise<void> {
    // Handle recommendation generated event
    console.log('🎯 Processing recommendations:', payload.userId);
    
    // TODO: Implement specific logic
    // - Cache recommendations
    // - Send notification about new recommendations
  }

  private async handleProjectCreated(payload: any): Promise<void> {
    // Handle project created event
    console.log('🚀 Processing project created:', payload.projectId);
    
    // TODO: Implement specific logic
    // - Initialize project analytics
    // - Set up project workspace
    // - Notify relevant users
  }

  private async handleProjectUpdated(payload: any): Promise<void> {
    // Handle project updated event
    console.log('📝 Processing project updated:', payload.projectId);
    
    // TODO: Implement specific logic
    // - Notify project collaborators
    // - Update search indexes
  }

  private async handleUserJoinedProject(payload: any): Promise<void> {
    // Handle user joined project event
    console.log('👥 Processing user joined project:', payload.projectId, payload.userId);
    
    // TODO: Implement specific logic
    // - Add user to project chat
    // - Send welcome message
    // - Update project analytics
  }

  private async handleNotification(payload: any): Promise<void> {
    // Handle notification event
    console.log('🔔 Processing notification:', payload.userId);
    
    // TODO: Implement specific logic
    // - Send push notification
    // - Store in notification center
    // - Update notification counts
  }

  private async handleAnalyticsEvent(payload: any): Promise<void> {
    // Handle analytics event
    console.log('📊 Processing analytics event:', payload.event);
    
    // TODO: Implement specific logic
    // - Store in analytics database
    // - Update metrics dashboards
    // - Trigger alerts if needed
  }
}

// Export singleton instance
export const kafkaConsumer = new KafkaConsumerService();
export default kafkaConsumer;