/**
 * =============================================================================
 * REDIS MESSAGE QUEUE SYSTEM - Background Job Processing
 * =============================================================================
 *
 * This module implements a robust message queue system using Redis for
 * handling background tasks, notifications, and asynchronous processing.
 *
 * Features:
 * - Job queuing with priority support
 * - Retry mechanism with exponential backoff
 * - Dead letter queue for failed jobs
 * - Queue monitoring and statistics
 *
 * =============================================================================
 */

import { queueRedis } from "../config/redis.production.config";

// =============================================================================
// QUEUE TYPES AND INTERFACES
// =============================================================================

export enum JobType {
  SEND_NOTIFICATION = "send_notification",
  SEND_EMAIL = "send_email",
  PROCESS_MATCH = "process_match",
  UPDATE_RECOMMENDATIONS = "update_recommendations",
  SEND_FRIEND_REQUEST = "send_friend_request",
  PROCESS_PROJECT_UPDATE = "process_project_update",
  CALCULATE_USER_STATS = "calculate_user_stats",
  CLEANUP_EXPIRED_SESSIONS = "cleanup_expired_sessions",
  SYNC_PROJECT_ANALYTICS = "sync_project_analytics",
  PROCESS_CHAT_MESSAGE = "process_chat_message",
}

export enum JobPriority {
  LOW = 1,
  NORMAL = 5,
  HIGH = 10,
  CRITICAL = 15,
}

export interface Job {
  id: string;
  type: JobType;
  priority: JobPriority;
  data: any;
  attempts: number;
  maxAttempts: number;
  createdAt: number;
  scheduledAt?: number; // For delayed jobs
  error?: string;
}

export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

// =============================================================================
// QUEUE CONFIGURATION
// =============================================================================

const QUEUE_KEYS = {
  WAITING: "queue:waiting",
  ACTIVE: "queue:active",
  COMPLETED: "queue:completed",
  FAILED: "queue:failed",
  DELAYED: "queue:delayed",
  DEAD_LETTER: "queue:dead_letter",
  STATS: "queue:stats",
};

const QUEUE_CONFIG = {
  MAX_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // Base delay in milliseconds
  MAX_RETRY_DELAY: 60000, // Maximum delay
  JOB_TTL: 24 * 60 * 60, // 24 hours in seconds
  CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
};

// =============================================================================
// QUEUE MANAGER CLASS
// =============================================================================

export class QueueManager {
  private static instance: QueueManager;
  private isProcessing: boolean = false;
  private processingInterval: NodeJS.Timeout | null = null;
  private cleanupInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.startProcessing();
    this.startCleanup();
  }

  public static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  // =============================================================================
  // JOB QUEUING METHODS
  // =============================================================================

  /**
   * Add a job to the queue
   */
  async addJob(
    type: JobType,
    data: any,
    options: {
      priority?: JobPriority;
      delay?: number; // Delay in milliseconds
      maxAttempts?: number;
    } = {}
  ): Promise<string> {
    const job: Job = {
      id: this.generateJobId(),
      type,
      data,
      priority: options.priority || JobPriority.NORMAL,
      attempts: 0,
      maxAttempts: options.maxAttempts || QUEUE_CONFIG.MAX_ATTEMPTS,
      createdAt: Date.now(),
      scheduledAt: options.delay ? Date.now() + options.delay : undefined,
    };

    try {
      if (job.scheduledAt) {
        // Add to delayed queue
        await queueRedis.zadd(QUEUE_KEYS.DELAYED, job.scheduledAt, JSON.stringify(job));
        console.log(
          `⏰ Added delayed job ${job.id} (${type}) - scheduled for ${new Date(job.scheduledAt)}`
        );
      } else {
        // Add to waiting queue with priority
        await queueRedis.zadd(QUEUE_KEYS.WAITING, job.priority, JSON.stringify(job));
        console.log(`📥 Added job ${job.id} (${type}) to queue with priority ${job.priority}`);
      }

      await this.updateStats();
      return job.id;
    } catch (error) {
      console.error("❌ Failed to add job to queue:", error);
      throw error;
    }
  }

  /**
   * Add multiple jobs in a batch
   */
  async addBatchJobs(
    jobs: Array<{
      type: JobType;
      data: any;
      priority?: JobPriority;
    }>
  ): Promise<string[]> {
    try {
      const pipeline = queueRedis.pipeline();
      const jobIds: string[] = [];

      jobs.forEach(({ type, data, priority = JobPriority.NORMAL }) => {
        const job: Job = {
          id: this.generateJobId(),
          type,
          data,
          priority,
          attempts: 0,
          maxAttempts: QUEUE_CONFIG.MAX_ATTEMPTS,
          createdAt: Date.now(),
        };

        pipeline.zadd(QUEUE_KEYS.WAITING, job.priority, JSON.stringify(job));
        jobIds.push(job.id);
      });

      await pipeline.exec();
      await this.updateStats();

      console.log(`📥 Added ${jobs.length} jobs to queue in batch`);
      return jobIds;
    } catch (error) {
      console.error("❌ Failed to add batch jobs:", error);
      throw error;
    }
  }

  // =============================================================================
  // JOB PROCESSING METHODS
  // =============================================================================

  /**
   * Start processing jobs from the queue
   */
  private startProcessing(): void {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.processingInterval = setInterval(async () => {
      await this.processNextJob();
      await this.moveDelayedJobs();
    }, 1000); // Process jobs every second

    console.log("▶️ Queue processing started");
  }

  /**
   * Stop processing jobs
   */
  stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    this.isProcessing = false;
    console.log("⏸️ Queue processing stopped");
  }

  /**
   * Process the next job in the queue
   */
  private async processNextJob(): Promise<void> {
    try {
      // Get highest priority job from waiting queue
      const jobData = await queueRedis.zpopmax(QUEUE_KEYS.WAITING);

      if (!jobData || jobData.length === 0) {
        return; // No jobs to process
      }

      const job: Job = JSON.parse(jobData[0]);

      // Move job to active queue
      await queueRedis.hset(QUEUE_KEYS.ACTIVE, job.id, JSON.stringify(job));

      console.log(`🔄 Processing job ${job.id} (${job.type})`);

      try {
        // Process the job based on its type
        await this.executeJob(job);

        // Mark job as completed
        await this.completeJob(job);
      } catch (error) {
        console.error(`❌ Job ${job.id} failed:`, error);
        await this.handleJobFailure(job, error as Error);
      }
    } catch (error) {
      console.error("❌ Error processing job:", error);
    }
  }

  /**
   * Execute a job based on its type
   */
  private async executeJob(job: Job): Promise<void> {
    switch (job.type) {
      case JobType.SEND_NOTIFICATION:
        await this.sendNotification(job.data);
        break;

      case JobType.SEND_EMAIL:
        await this.sendEmail(job.data);
        break;

      case JobType.PROCESS_MATCH:
        await this.processMatch(job.data);
        break;

      case JobType.UPDATE_RECOMMENDATIONS:
        await this.updateRecommendations(job.data);
        break;

      case JobType.SEND_FRIEND_REQUEST:
        await this.sendFriendRequest(job.data);
        break;

      case JobType.PROCESS_PROJECT_UPDATE:
        await this.processProjectUpdate(job.data);
        break;

      case JobType.CALCULATE_USER_STATS:
        await this.calculateUserStats(job.data);
        break;

      case JobType.CLEANUP_EXPIRED_SESSIONS:
        await this.cleanupExpiredSessions(job.data);
        break;

      case JobType.SYNC_PROJECT_ANALYTICS:
        await this.syncProjectAnalytics(job.data);
        break;

      case JobType.PROCESS_CHAT_MESSAGE:
        await this.processChatMessage(job.data);
        break;

      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
  }

  // =============================================================================
  // JOB HANDLERS - Implement actual business logic
  // =============================================================================

  private async sendNotification(data: any): Promise<void> {
    // Implement notification sending logic
    console.log("📱 Sending notification:", data);
    // Add actual implementation here
  }

  private async sendEmail(data: any): Promise<void> {
    // Implement email sending logic
    console.log("📧 Sending email:", data);
    // Add actual implementation here
  }

  private async processMatch(data: any): Promise<void> {
    // Implement match processing for user/project recommendations
    console.log("🤝 Processing match:", data);
    // Add actual implementation here
  }

  private async updateRecommendations(data: any): Promise<void> {
    // Implement recommendation algorithm update
    console.log("✨ Updating recommendations:", data);
    // Add actual implementation here
  }

  private async sendFriendRequest(data: any): Promise<void> {
    // Implement friend request logic
    console.log("👥 Sending friend request:", data);
    // Add actual implementation here
  }

  private async processProjectUpdate(data: any): Promise<void> {
    // Implement project update processing
    console.log("📂 Processing project update:", data);
    // Add actual implementation here
  }

  private async calculateUserStats(data: any): Promise<void> {
    // Implement user statistics calculation
    console.log("📊 Calculating user stats:", data);
    // Add actual implementation here
  }

  private async cleanupExpiredSessions(data: any): Promise<void> {
    // Implement session cleanup
    console.log("🧹 Cleaning up expired sessions:", data);
    // Add actual implementation here
  }

  private async syncProjectAnalytics(data: any): Promise<void> {
    // Implement project analytics synchronization
    console.log("📈 Syncing project analytics:", data);
    // Add actual implementation here
  }

  private async processChatMessage(data: any): Promise<void> {
    // Implement chat message processing
    console.log("💬 Processing chat message:", data);
    // Add actual implementation here
  }

  // =============================================================================
  // JOB LIFECYCLE MANAGEMENT
  // =============================================================================

  /**
   * Mark job as completed
   */
  private async completeJob(job: Job): Promise<void> {
    try {
      // Remove from active queue
      await queueRedis.hdel(QUEUE_KEYS.ACTIVE, job.id);

      // Add to completed queue with TTL
      await queueRedis.zadd(QUEUE_KEYS.COMPLETED, Date.now(), JSON.stringify(job));
      await queueRedis.expire(QUEUE_KEYS.COMPLETED, QUEUE_CONFIG.JOB_TTL);

      console.log(`✅ Job ${job.id} completed successfully`);
      await this.updateStats();
    } catch (error) {
      console.error("❌ Error completing job:", error);
    }
  }

  /**
   * Handle job failure with retry logic
   */
  private async handleJobFailure(job: Job, error: Error): Promise<void> {
    try {
      job.attempts++;
      job.error = error.message;

      // Remove from active queue
      await queueRedis.hdel(QUEUE_KEYS.ACTIVE, job.id);

      if (job.attempts < job.maxAttempts) {
        // Retry with exponential backoff
        const delay = Math.min(
          QUEUE_CONFIG.RETRY_DELAY * Math.pow(2, job.attempts - 1),
          QUEUE_CONFIG.MAX_RETRY_DELAY
        );

        job.scheduledAt = Date.now() + delay;
        await queueRedis.zadd(QUEUE_KEYS.DELAYED, job.scheduledAt, JSON.stringify(job));

        console.log(
          `🔄 Job ${job.id} scheduled for retry ${job.attempts}/${job.maxAttempts} in ${delay}ms`
        );
      } else {
        // Move to dead letter queue
        await queueRedis.zadd(QUEUE_KEYS.DEAD_LETTER, Date.now(), JSON.stringify(job));
        await queueRedis.zadd(QUEUE_KEYS.FAILED, Date.now(), JSON.stringify(job));

        console.log(`💀 Job ${job.id} moved to dead letter queue after ${job.attempts} attempts`);
      }

      await this.updateStats();
    } catch (error) {
      console.error("❌ Error handling job failure:", error);
    }
  }

  /**
   * Move delayed jobs to waiting queue when their time comes
   */
  private async moveDelayedJobs(): Promise<void> {
    try {
      const now = Date.now();

      // Get jobs that are ready to be processed
      const readyJobs = await queueRedis.zrangebyscore(
        QUEUE_KEYS.DELAYED,
        "-inf",
        now,
        "WITHSCORES"
      );

      if (readyJobs.length === 0) return;

      const pipeline = queueRedis.pipeline();

      // Move jobs from delayed to waiting queue
      for (let i = 0; i < readyJobs.length; i += 2) {
        const jobData = readyJobs[i];
        const job: Job = JSON.parse(jobData);

        // Remove from delayed queue
        pipeline.zrem(QUEUE_KEYS.DELAYED, jobData);

        // Add to waiting queue
        pipeline.zadd(QUEUE_KEYS.WAITING, job.priority, jobData);
      }

      await pipeline.exec();

      console.log(`⏰ Moved ${readyJobs.length / 2} delayed jobs to waiting queue`);
    } catch (error) {
      console.error("❌ Error moving delayed jobs:", error);
    }
  }

  // =============================================================================
  // QUEUE MONITORING AND STATISTICS
  // =============================================================================

  /**
   * Get queue statistics
   */
  async getStats(): Promise<QueueStats> {
    try {
      const [waiting, active, completed, failed, delayed] = await Promise.all([
        queueRedis.zcard(QUEUE_KEYS.WAITING),
        queueRedis.hlen(QUEUE_KEYS.ACTIVE),
        queueRedis.zcard(QUEUE_KEYS.COMPLETED),
        queueRedis.zcard(QUEUE_KEYS.FAILED),
        queueRedis.zcard(QUEUE_KEYS.DELAYED),
      ]);

      return { waiting, active, completed, failed, delayed };
    } catch (error) {
      console.error("❌ Error getting queue stats:", error);
      return { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 };
    }
  }

  /**
   * Update queue statistics
   */
  private async updateStats(): Promise<void> {
    try {
      const stats = await this.getStats();
      await queueRedis.hmset(QUEUE_KEYS.STATS, {
        waiting: stats.waiting.toString(),
        active: stats.active.toString(),
        completed: stats.completed.toString(),
        failed: stats.failed.toString(),
        delayed: stats.delayed.toString(),
        lastUpdated: Date.now().toString(),
      });
    } catch (error) {
      console.error("❌ Error updating stats:", error);
    }
  }

  /**
   * Start periodic cleanup of old completed/failed jobs
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(async () => {
      await this.cleanupOldJobs();
    }, QUEUE_CONFIG.CLEANUP_INTERVAL);

    console.log("🧹 Queue cleanup started");
  }

  /**
   * Clean up old completed and failed jobs
   */
  private async cleanupOldJobs(): Promise<void> {
    try {
      const cutoff = Date.now() - QUEUE_CONFIG.JOB_TTL * 1000;

      const [completedRemoved, failedRemoved] = await Promise.all([
        queueRedis.zremrangebyscore(QUEUE_KEYS.COMPLETED, "-inf", cutoff),
        queueRedis.zremrangebyscore(QUEUE_KEYS.FAILED, "-inf", cutoff),
      ]);

      if (completedRemoved > 0 || failedRemoved > 0) {
        console.log(`🧹 Cleaned up ${completedRemoved} completed and ${failedRemoved} failed jobs`);
      }
    } catch (error) {
      console.error("❌ Error during cleanup:", error);
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /**
   * Generate unique job ID
   */
  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Shutdown queue manager gracefully
   */
  async shutdown(): Promise<void> {
    console.log("🔄 Shutting down queue manager...");

    this.stopProcessing();

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    console.log("✅ Queue manager shutdown complete");
  }
}

// =============================================================================
// EXPORT QUEUE MANAGER INSTANCE
// =============================================================================

export const queueManager = QueueManager.getInstance();

// Convenience functions for adding common jobs
export const addNotificationJob = (data: any, priority = JobPriority.NORMAL) =>
  queueManager.addJob(JobType.SEND_NOTIFICATION, data, { priority });

export const addEmailJob = (data: any, priority = JobPriority.NORMAL) =>
  queueManager.addJob(JobType.SEND_EMAIL, data, { priority });

export const addMatchProcessingJob = (data: any, priority = JobPriority.HIGH) =>
  queueManager.addJob(JobType.PROCESS_MATCH, data, { priority });

export const addRecommendationUpdateJob = (data: any, priority = JobPriority.NORMAL) =>
  queueManager.addJob(JobType.UPDATE_RECOMMENDATIONS, data, { priority });

export const addProjectUpdateJob = (data: any, priority = JobPriority.HIGH) =>
  queueManager.addJob(JobType.PROCESS_PROJECT_UPDATE, data, { priority });

export const addProjectAnalyticsJob = (data: any, priority = JobPriority.LOW) =>
  queueManager.addJob(JobType.SYNC_PROJECT_ANALYTICS, data, { priority });

export const addChatMessageJob = (data: any, priority = JobPriority.HIGH) =>
  queueManager.addJob(JobType.PROCESS_CHAT_MESSAGE, data, { priority });
