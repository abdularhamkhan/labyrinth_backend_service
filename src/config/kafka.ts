import { Kafka, KafkaConfig, logLevel } from 'kafkajs';
import { ENV } from './env';

/**
 * =============================================================================
 * KAFKA CONFIGURATION FOR LABYRINTH PLATFORM
 * =============================================================================
 * 
 * This module provides Kafka client configuration for event-driven architecture
 * supporting real-time messaging, notifications, and inter-service communication
 * 
 * Topics:
 * - user-events: User registration, profile updates, activity
 * - chat-events: Real-time messaging, typing indicators, read receipts
 * - match-events: Swipe actions, matches created, recommendations
 * - project-events: Project creation, updates, collaboration changes
 * - notification-events: System notifications, alerts, reminders
 * 
 * =============================================================================
 */

const kafkaConfig: KafkaConfig = {
  clientId: 'labyrinth-backend',
  brokers: ENV.kafkaBrokers || ['localhost:9092'],
  logLevel: ENV.nodeEnv === 'production' ? logLevel.WARN : logLevel.ERROR, // Reduce log noise
  retry: {
    initialRetryTime: 100,
    retries: ENV.nodeEnv === 'production' ? 8 : 2, // Faster failure in development
  },
  connectionTimeout: ENV.nodeEnv === 'production' ? 3000 : 1000, // Shorter timeout in dev
  requestTimeout: ENV.nodeEnv === 'production' ? 25000 : 5000, // Shorter timeout in dev
};

// Initialize Kafka client
export const kafka = new Kafka(kafkaConfig);

// Kafka topics configuration
export const KAFKA_TOPICS = {
  USER_EVENTS: 'user-events',
  CHAT_EVENTS: 'chat-events',
  MATCH_EVENTS: 'match-events',
  PROJECT_EVENTS: 'project-events',
  NOTIFICATION_EVENTS: 'notification-events',
  ANALYTICS_EVENTS: 'analytics-events',
} as const;

// Topic configurations for creation
export const TOPIC_CONFIGS = [
  {
    topic: KAFKA_TOPICS.USER_EVENTS,
    numPartitions: 3,
    replicationFactor: 1,
    configEntries: [
      { name: 'cleanup.policy', value: 'compact' },
      { name: 'retention.ms', value: '604800000' }, // 7 days
    ],
  },
  {
    topic: KAFKA_TOPICS.CHAT_EVENTS,
    numPartitions: 6,
    replicationFactor: 1,
    configEntries: [
      { name: 'cleanup.policy', value: 'delete' },
      { name: 'retention.ms', value: '86400000' }, // 1 day
    ],
  },
  {
    topic: KAFKA_TOPICS.MATCH_EVENTS,
    numPartitions: 3,
    replicationFactor: 1,
    configEntries: [
      { name: 'cleanup.policy', value: 'compact' },
      { name: 'retention.ms', value: '2592000000' }, // 30 days
    ],
  },
  {
    topic: KAFKA_TOPICS.PROJECT_EVENTS,
    numPartitions: 4,
    replicationFactor: 1,
    configEntries: [
      { name: 'cleanup.policy', value: 'compact' },
      { name: 'retention.ms', value: '2592000000' }, // 30 days
    ],
  },
  {
    topic: KAFKA_TOPICS.NOTIFICATION_EVENTS,
    numPartitions: 2,
    replicationFactor: 1,
    configEntries: [
      { name: 'cleanup.policy', value: 'delete' },
      { name: 'retention.ms', value: '259200000' }, // 3 days
    ],
  },
  {
    topic: KAFKA_TOPICS.ANALYTICS_EVENTS,
    numPartitions: 2,
    replicationFactor: 1,
    configEntries: [
      { name: 'cleanup.policy', value: 'delete' },
      { name: 'retention.ms', value: '604800000' }, // 7 days
    ],
  },
];

// Create admin client for topic management
export const kafkaAdmin = kafka.admin();

/**
 * Initialize Kafka topics
 * Creates all required topics with proper configuration
 * In development, connection failures are handled gracefully
 */
export async function initializeKafkaTopics(): Promise<void> {
  try {
    // Set shorter timeout for development
    const adminClient = kafka.admin({
      retry: {
        initialRetryTime: 100,
        retries: 2,
      },
    });
    
    await adminClient.connect();
    
    const existingTopics = await adminClient.listTopics();
    const topicsToCreate = TOPIC_CONFIGS.filter(
      config => !existingTopics.includes(config.topic)
    );

    if (topicsToCreate.length > 0) {
      console.log('Creating Kafka topics:', topicsToCreate.map(t => t.topic));
      await adminClient.createTopics({
        topics: topicsToCreate,
      });
      console.log('Kafka topics created successfully');
    } else {
      console.log('All Kafka topics already exist');
    }
    
    await adminClient.disconnect();
  } catch (error) {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (isDevelopment) {
      console.warn('Kafka topic initialization failed (development mode):', error instanceof Error ? error.message : error);
      return; // Don't throw in development
    } else {
      console.error('Failed to initialize Kafka topics:', error);
      throw error;
    }
  }
}

/**
 * Graceful Kafka shutdown
 */
export async function disconnectKafka(): Promise<void> {
  try {
    await kafkaAdmin.disconnect();
    console.log('Kafka disconnected gracefully');
  } catch (error) {
    console.error('Error disconnecting from Kafka:', error);
  }
}

export default kafka;