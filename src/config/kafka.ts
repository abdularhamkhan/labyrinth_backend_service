/**
 * =============================================================================
 * KAFKA CONFIGURATION - DISABLED
 * =============================================================================
 * 
 * Kafka has been disabled completely to prevent production issues.
 * All Kafka imports are commented out. This file exports stubs for
 * compatibility with code that imports these exports.
 */

// Kafka disabled - all client creation commented out
// import { Kafka, KafkaConfig, logLevel } from "kafkajs";
// import { ENV } from "./env";

// Kafka is disabled
export const kafkaEnabled = false;

export function getKafkaBrokers(): string[] {
  return [];
}

// No-op kafka stub
export const kafka = null as any;

// Topic names for reference only
export const KAFKA_TOPICS = {
  USER_EVENTS: "user-events",
  CHAT_EVENTS: "chat-events",
  MATCH_EVENTS: "match-events",
  PROJECT_EVENTS: "project-events",
  NOTIFICATION_EVENTS: "notification-events",
  ANALYTICS_EVENTS: "analytics-events",
} as const;

// No-op functions
export async function initializeKafkaTopics(): Promise<void> {
  console.log("Kafka disabled - skipping topic initialization");
  return;
}

export async function disconnectKafka(): Promise<void> {
  console.log("Kafka disabled - no disconnect needed");
  return;
}

export default kafka;
