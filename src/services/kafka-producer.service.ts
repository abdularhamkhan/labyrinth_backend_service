/**
 * =============================================================================
 * KAFKA PRODUCER SERVICE - DISABLED
 * =============================================================================
 * 
 * Kafka is completely disabled to prevent production issues with timeouts
 * and broker connection errors. This file provides a no-op stub so existing
 * code that imports kafkaProducer doesn't break.
 */

// Kafka disabled completely - no Kafka client is instantiated
class NoOpProducer {
  async connect() {
    // no-op
  }

  async disconnect() {
    // no-op
  }

  async sendMessage() {
    // no-op
  }

  async publishEvent() {
    // no-op
  }

  async publishUserRegistered() {
    // no-op
  }

  async publishUserProfileUpdated() {
    // no-op
  }

  async publishUserActivity() {
    // no-op
  }

  async publishMessageSent() {
    // no-op
  }

  async publishTypingIndicator() {
    // no-op
  }

  async publishMessageRead() {
    // no-op
  }

  async publishSwipeAction() {
    // no-op
  }

  async publishMatchCreated() {
    // no-op
  }

  async publishRecommendationGenerated() {
    // no-op
  }

  async publishProjectCreated() {
    // no-op
  }

  async publishProjectUpdated() {
    // no-op
  }

  async publishUserJoinedProject() {
    // no-op
  }

  async publishNotification() {
    // no-op
  }

  async publishAnalyticsEvent() {
    // no-op
  }
}

const kafkaProducer = new NoOpProducer();

export default kafkaProducer;
