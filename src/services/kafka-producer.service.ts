import { Producer, ProducerRecord } from 'kafkajs';
import { kafka, KAFKA_TOPICS } from '../config/kafka';

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

class KafkaProducerService {
  private producer: Producer;
  private isConnected = false;

  constructor() {
    this.producer = kafka.producer({
      allowAutoTopicCreation: false,
      transactionTimeout: 30000,
    });
  }

  /**
   * Connect to Kafka
   */
  async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      await this.producer.connect();
      this.isConnected = true;
      console.log('Kafka Producer connected');
    } catch (error) {
      console.error('Failed to connect Kafka Producer:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Kafka
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    try {
      await this.producer.disconnect();
      this.isConnected = false;
      console.log('Kafka Producer disconnected');
    } catch (error) {
      console.error('Failed to disconnect Kafka Producer:', error);
    }
  }

  /**
   * Send message to specific topic
   */
  async sendMessage(topic: string, message: any, key?: string): Promise<void> {
    try {
      await this.connect();

      const record: ProducerRecord = {
        topic,
        messages: [
          {
            key: key || null,
            value: JSON.stringify(message),
            timestamp: Date.now().toString(),
          },
        ],
      };

      await this.producer.send(record);
      console.log(`📤 Event published to ${topic}:`, message.type || 'unknown');
    } catch (error) {
      console.warn(`⚠️  Failed to publish to ${topic} (Kafka not available):`, error instanceof Error ? error.message : error);
      // Don't throw error in development - allow application to continue
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  /**
   * Generic method to publish any event (for backward compatibility)
   */
  async publishEvent(event: { type: string; data?: any; [key: string]: any }): Promise<void> {
    const topic = this.getTopicForEventType(event.type);
    await this.sendMessage(topic, event, event.userId || event.chatId || event.projectId);
  }

  /**
   * Map event types to appropriate topics
   */
  private getTopicForEventType(eventType: string): string {
    if (eventType.includes('USER') || eventType.includes('PROFILE')) {
      return KAFKA_TOPICS.USER_EVENTS;
    }
    if (eventType.includes('CHAT') || eventType.includes('MESSAGE')) {
      return KAFKA_TOPICS.CHAT_EVENTS;
    }
    if (eventType.includes('MATCH') || eventType.includes('SWIPE')) {
      return KAFKA_TOPICS.MATCH_EVENTS;
    }
    if (eventType.includes('PROJECT') || eventType.includes('TASK')) {
      return KAFKA_TOPICS.PROJECT_EVENTS;
    }
    if (eventType.includes('NOTIFICATION')) {
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
        type: 'USER_REGISTERED',
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
        type: 'USER_PROFILE_UPDATED',
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
        type: 'USER_ACTIVITY',
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
        type: 'MESSAGE_SENT',
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
        type: 'TYPING_INDICATOR',
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
        type: 'MESSAGE_READ',
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
        type: 'SWIPE_ACTION',
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
        type: 'MATCH_CREATED',
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
        type: 'RECOMMENDATION_GENERATED',
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
        type: 'PROJECT_CREATED',
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
        type: 'PROJECT_UPDATED',
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
        type: 'USER_JOINED_PROJECT',
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
        type: 'NOTIFICATION',
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
    await this.sendMessage(
      KAFKA_TOPICS.ANALYTICS_EVENTS,
      {
        type: 'ANALYTICS_EVENT',
        event,
        data,
        timestamp: new Date().toISOString(),
      }
    );
  }
}

// Export singleton instance
export const kafkaProducer = new KafkaProducerService();
export default kafkaProducer;