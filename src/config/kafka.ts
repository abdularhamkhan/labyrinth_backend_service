import { Kafka, KafkaConfig, logLevel } from "kafkajs";
import { ENV } from "./env";

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

// =============================================================================
// Kafka Client Configuration
// =============================================================================
const kafkaConfig: KafkaConfig = {
  clientId: ENV.kafkaClientId || "labyrinth-backend",
  brokers: ENV.kafkaBrokers || ["localhost:9092"],
  logLevel: ENV.nodeEnv === "production" ? logLevel.WARN : logLevel.ERROR,
  retry: {
    initialRetryTime: 100,
    retries: ENV.nodeEnv === "production" ? 8 : 2,
  },
  connectionTimeout: ENV.nodeEnv === "production" ? 3000 : 1000,
  requestTimeout: ENV.nodeEnv === "production" ? 25000 : 5000,
};

// Optional SSL/SASL support
if (ENV.kafkaSsl) {
  // `ssl` can be boolean or TLS options; using boolean for simple enable
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  kafkaConfig.ssl = true;
}

if (ENV.kafkaSaslUsername && ENV.kafkaSaslPassword && ENV.kafkaSaslMechanism) {
  // Provide SASL configuration when username/password/mechanism are set
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  kafkaConfig.sasl = {
    mechanism: ENV.kafkaSaslMechanism as any,
    username: ENV.kafkaSaslUsername,
    password: ENV.kafkaSaslPassword,
  };
}

// =============================================================================
// Kafka Client Instance
// =============================================================================
// Create the main Kafka client using the configuration above
// This instance is used to create producers, consumers, and admin clients
export const kafka = new Kafka(kafkaConfig);

// Whether Kafka is considered enabled (useful for graceful degradation)
export const kafkaEnabled = Array.isArray(ENV.kafkaBrokers) && ENV.kafkaBrokers.length > 0;

// =============================================================================
// Topic Names - Centralized Constants
// =============================================================================
// All Kafka topic names defined in one place for consistency
// Using 'as const' makes these values readonly and provides better TypeScript inference
export const KAFKA_TOPICS = {
  // User lifecycle events: registration, profile updates, authentication
  USER_EVENTS: "user-events",
  
  // Real-time chat events: messages, typing indicators, read receipts
  CHAT_EVENTS: "chat-events",
  
  // Matchmaking events: swipes, matches, recommendation updates
  MATCH_EVENTS: "match-events",
  
  // Project collaboration events: creation, updates, member changes
  PROJECT_EVENTS: "project-events",
  
  // System notifications: alerts, reminders, push notifications
  NOTIFICATION_EVENTS: "notification-events",
  
  // Analytics and metrics: user activity, feature usage, performance data
  ANALYTICS_EVENTS: "analytics-events",
} as const;

// =============================================================================
// Topic Configuration Definitions
// =============================================================================
// Detailed configuration for each Kafka topic including partitioning,
// replication, and retention policies
export const TOPIC_CONFIGS = [
  {
    topic: KAFKA_TOPICS.USER_EVENTS,
    
    // Number of partitions: distributes messages across 3 partitions for parallel processing
    // More partitions = better scalability but more resource overhead
    numPartitions: 3,
    
    // Replication factor: 1 for development (no redundancy)
    // In production, this should be 2-3 for data durability
    replicationFactor: 1,
    
    // Topic-specific settings
    configEntries: [
      // Compact policy: keeps only the latest value for each key
      // Perfect for user profile updates where only current state matters
      { name: "cleanup.policy", value: "compact" },
      
      // Retention: messages kept for 7 days (604800000ms)
      // After this, messages are eligible for deletion
      { name: "retention.ms", value: "604800000" },
    ],
  },
  {
    topic: KAFKA_TOPICS.CHAT_EVENTS,
    numPartitions: 6,
    replicationFactor: 1,
    configEntries: [
      { name: "cleanup.policy", value: "delete" },
      { name: "retention.ms", value: "86400000" }, // 1 day
    ],
  },
  {
    topic: KAFKA_TOPICS.MATCH_EVENTS,
    numPartitions: 3,
    replicationFactor: 1,
    configEntries: [
      { name: "cleanup.policy", value: "compact" },
      { name: "retention.ms", value: "2592000000" }, // 30 days
    ],
  },
  {
    topic: KAFKA_TOPICS.PROJECT_EVENTS,
    numPartitions: 4,
    replicationFactor: 1,
    configEntries: [
      { name: "cleanup.policy", value: "compact" },
      { name: "retention.ms", value: "2592000000" }, // 30 days
    ],
  },
  {
    topic: KAFKA_TOPICS.NOTIFICATION_EVENTS,
    numPartitions: 2,
    replicationFactor: 1,
    configEntries: [
      { name: "cleanup.policy", value: "delete" },
      { name: "retention.ms", value: "259200000" }, // 3 days
    ],
  },
  {
    topic: KAFKA_TOPICS.ANALYTICS_EVENTS,
    numPartitions: 2,
    replicationFactor: 1,
    configEntries: [
      { name: "cleanup.policy", value: "delete" },
      { name: "retention.ms", value: "604800000" }, // 7 days
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
    if (!kafkaEnabled) {
      console.log("Kafka disabled via configuration; skipping topic initialization");
      return;
    }

    // Create an admin client with slightly more conservative retries for initialization
    const adminClient = kafka.admin({
      retry: { initialRetryTime: 200, retries: 3 },
    });

    await adminClient.connect();

    const existingTopics = await adminClient.listTopics();
    const topicsToCreate = TOPIC_CONFIGS.filter((config) => !existingTopics.includes(config.topic));

    if (topicsToCreate.length > 0) {
      console.log(
        "Creating Kafka topics:",
        topicsToCreate.map((t) => t.topic)
      );
      await adminClient.createTopics({
        topics: topicsToCreate,
      });
      console.log("Kafka topics created successfully");
    } else {
      console.log("All Kafka topics already exist");
    }

    await adminClient.disconnect();
  } catch (error) {
    const isDevelopment = process.env.NODE_ENV !== "production";
    if (isDevelopment) {
      console.warn(
        "Kafka topic initialization failed (development mode):",
        error instanceof Error ? error.message : error
      );
      return; // Don't throw in development
    } else {
      console.error("Failed to initialize Kafka topics:", error);
      // In production, bubbling this up may prevent the app from starting if Kafka is required.
      // Throwing here signals a misconfiguration. If Kafka is optional for your setup,
      // consider catching this earlier and allowing the app to start without Kafka.
      throw error;
    }
  }
}

/**
 * Graceful Kafka shutdown
 */
export async function disconnectKafka(): Promise<void> {
  try {
    if (!kafkaEnabled) return;
    await kafkaAdmin.disconnect();
    console.log("Kafka disconnected gracefully");
  } catch (error) {
    console.error("Error disconnecting from Kafka:", error);
  }
}

export default kafka;
