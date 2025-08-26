"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGameResultJob = exports.addLeaderboardUpdateJob = exports.addNotificationJob = exports.queueManager = exports.QueueManager = exports.JobPriority = exports.JobType = void 0;
const redis_production_config_1 = require("../config/redis.production.config");
// =============================================================================
// QUEUE TYPES AND INTERFACES
// =============================================================================
var JobType;
(function (JobType) {
    JobType["SEND_NOTIFICATION"] = "send_notification";
    JobType["UPDATE_LEADERBOARD"] = "update_leaderboard";
    JobType["PROCESS_GAME_RESULT"] = "process_game_result";
    JobType["SEND_FRIEND_REQUEST"] = "send_friend_request";
    JobType["GENERATE_DAILY_CHALLENGE"] = "generate_daily_challenge";
    JobType["CALCULATE_USER_STATS"] = "calculate_user_stats";
    JobType["CLEANUP_EXPIRED_SESSIONS"] = "cleanup_expired_sessions";
})(JobType || (exports.JobType = JobType = {}));
var JobPriority;
(function (JobPriority) {
    JobPriority[JobPriority["LOW"] = 1] = "LOW";
    JobPriority[JobPriority["NORMAL"] = 5] = "NORMAL";
    JobPriority[JobPriority["HIGH"] = 10] = "HIGH";
    JobPriority[JobPriority["CRITICAL"] = 15] = "CRITICAL";
})(JobPriority || (exports.JobPriority = JobPriority = {}));
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
class QueueManager {
    constructor() {
        this.isProcessing = false;
        this.processingInterval = null;
        this.cleanupInterval = null;
        this.startProcessing();
        this.startCleanup();
    }
    static getInstance() {
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
    async addJob(type, data, options = {}) {
        const job = {
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
                await redis_production_config_1.queueRedis.zadd(QUEUE_KEYS.DELAYED, job.scheduledAt, JSON.stringify(job));
                console.log(`⏰ Added delayed job ${job.id} (${type}) - scheduled for ${new Date(job.scheduledAt)}`);
            }
            else {
                // Add to waiting queue with priority
                await redis_production_config_1.queueRedis.zadd(QUEUE_KEYS.WAITING, job.priority, JSON.stringify(job));
                console.log(`📥 Added job ${job.id} (${type}) to queue with priority ${job.priority}`);
            }
            await this.updateStats();
            return job.id;
        }
        catch (error) {
            console.error("❌ Failed to add job to queue:", error);
            throw error;
        }
    }
    /**
     * Add multiple jobs in a batch
     */
    async addBatchJobs(jobs) {
        try {
            const pipeline = redis_production_config_1.queueRedis.pipeline();
            const jobIds = [];
            jobs.forEach(({ type, data, priority = JobPriority.NORMAL }) => {
                const job = {
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
        }
        catch (error) {
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
    startProcessing() {
        if (this.isProcessing)
            return;
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
    stopProcessing() {
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
    async processNextJob() {
        try {
            // Get highest priority job from waiting queue
            const jobData = await redis_production_config_1.queueRedis.zpopmax(QUEUE_KEYS.WAITING);
            if (!jobData || jobData.length === 0) {
                return; // No jobs to process
            }
            const job = JSON.parse(jobData[0]);
            // Move job to active queue
            await redis_production_config_1.queueRedis.hset(QUEUE_KEYS.ACTIVE, job.id, JSON.stringify(job));
            console.log(`🔄 Processing job ${job.id} (${job.type})`);
            try {
                // Process the job based on its type
                await this.executeJob(job);
                // Mark job as completed
                await this.completeJob(job);
            }
            catch (error) {
                console.error(`❌ Job ${job.id} failed:`, error);
                await this.handleJobFailure(job, error);
            }
        }
        catch (error) {
            console.error("❌ Error processing job:", error);
        }
    }
    /**
     * Execute a job based on its type
     */
    async executeJob(job) {
        switch (job.type) {
            case JobType.SEND_NOTIFICATION:
                await this.sendNotification(job.data);
                break;
            case JobType.UPDATE_LEADERBOARD:
                await this.updateLeaderboard(job.data);
                break;
            case JobType.PROCESS_GAME_RESULT:
                await this.processGameResult(job.data);
                break;
            case JobType.SEND_FRIEND_REQUEST:
                await this.sendFriendRequest(job.data);
                break;
            case JobType.GENERATE_DAILY_CHALLENGE:
                await this.generateDailyChallenge(job.data);
                break;
            case JobType.CALCULATE_USER_STATS:
                await this.calculateUserStats(job.data);
                break;
            case JobType.CLEANUP_EXPIRED_SESSIONS:
                await this.cleanupExpiredSessions(job.data);
                break;
            default:
                throw new Error(`Unknown job type: ${job.type}`);
        }
    }
    // =============================================================================
    // JOB HANDLERS - Implement actual business logic
    // =============================================================================
    async sendNotification(data) {
        // Implement notification sending logic
        console.log("📱 Sending notification:", data);
        // Add actual implementation here
    }
    async updateLeaderboard(data) {
        // Implement leaderboard update logic
        console.log("🏆 Updating leaderboard:", data);
        // Add actual implementation here
    }
    async processGameResult(data) {
        // Implement game result processing
        console.log("🎮 Processing game result:", data);
        // Add actual implementation here
    }
    async sendFriendRequest(data) {
        // Implement friend request logic
        console.log("👥 Sending friend request:", data);
        // Add actual implementation here
    }
    async generateDailyChallenge(data) {
        // Implement daily challenge generation
        console.log("📅 Generating daily challenge:", data);
        // Add actual implementation here
    }
    async calculateUserStats(data) {
        // Implement user statistics calculation
        console.log("📊 Calculating user stats:", data);
        // Add actual implementation here
    }
    async cleanupExpiredSessions(data) {
        // Implement session cleanup
        console.log("🧹 Cleaning up expired sessions:", data);
        // Add actual implementation here
    }
    // =============================================================================
    // JOB LIFECYCLE MANAGEMENT
    // =============================================================================
    /**
     * Mark job as completed
     */
    async completeJob(job) {
        try {
            // Remove from active queue
            await redis_production_config_1.queueRedis.hdel(QUEUE_KEYS.ACTIVE, job.id);
            // Add to completed queue with TTL
            await redis_production_config_1.queueRedis.zadd(QUEUE_KEYS.COMPLETED, Date.now(), JSON.stringify(job));
            await redis_production_config_1.queueRedis.expire(QUEUE_KEYS.COMPLETED, QUEUE_CONFIG.JOB_TTL);
            console.log(`✅ Job ${job.id} completed successfully`);
            await this.updateStats();
        }
        catch (error) {
            console.error("❌ Error completing job:", error);
        }
    }
    /**
     * Handle job failure with retry logic
     */
    async handleJobFailure(job, error) {
        try {
            job.attempts++;
            job.error = error.message;
            // Remove from active queue
            await redis_production_config_1.queueRedis.hdel(QUEUE_KEYS.ACTIVE, job.id);
            if (job.attempts < job.maxAttempts) {
                // Retry with exponential backoff
                const delay = Math.min(QUEUE_CONFIG.RETRY_DELAY * Math.pow(2, job.attempts - 1), QUEUE_CONFIG.MAX_RETRY_DELAY);
                job.scheduledAt = Date.now() + delay;
                await redis_production_config_1.queueRedis.zadd(QUEUE_KEYS.DELAYED, job.scheduledAt, JSON.stringify(job));
                console.log(`🔄 Job ${job.id} scheduled for retry ${job.attempts}/${job.maxAttempts} in ${delay}ms`);
            }
            else {
                // Move to dead letter queue
                await redis_production_config_1.queueRedis.zadd(QUEUE_KEYS.DEAD_LETTER, Date.now(), JSON.stringify(job));
                await redis_production_config_1.queueRedis.zadd(QUEUE_KEYS.FAILED, Date.now(), JSON.stringify(job));
                console.log(`💀 Job ${job.id} moved to dead letter queue after ${job.attempts} attempts`);
            }
            await this.updateStats();
        }
        catch (error) {
            console.error("❌ Error handling job failure:", error);
        }
    }
    /**
     * Move delayed jobs to waiting queue when their time comes
     */
    async moveDelayedJobs() {
        try {
            const now = Date.now();
            // Get jobs that are ready to be processed
            const readyJobs = await redis_production_config_1.queueRedis.zrangebyscore(QUEUE_KEYS.DELAYED, "-inf", now, "WITHSCORES");
            if (readyJobs.length === 0)
                return;
            const pipeline = redis_production_config_1.queueRedis.pipeline();
            // Move jobs from delayed to waiting queue
            for (let i = 0; i < readyJobs.length; i += 2) {
                const jobData = readyJobs[i];
                const job = JSON.parse(jobData);
                // Remove from delayed queue
                pipeline.zrem(QUEUE_KEYS.DELAYED, jobData);
                // Add to waiting queue
                pipeline.zadd(QUEUE_KEYS.WAITING, job.priority, jobData);
            }
            await pipeline.exec();
            console.log(`⏰ Moved ${readyJobs.length / 2} delayed jobs to waiting queue`);
        }
        catch (error) {
            console.error("❌ Error moving delayed jobs:", error);
        }
    }
    // =============================================================================
    // QUEUE MONITORING AND STATISTICS
    // =============================================================================
    /**
     * Get queue statistics
     */
    async getStats() {
        try {
            const [waiting, active, completed, failed, delayed] = await Promise.all([
                redis_production_config_1.queueRedis.zcard(QUEUE_KEYS.WAITING),
                redis_production_config_1.queueRedis.hlen(QUEUE_KEYS.ACTIVE),
                redis_production_config_1.queueRedis.zcard(QUEUE_KEYS.COMPLETED),
                redis_production_config_1.queueRedis.zcard(QUEUE_KEYS.FAILED),
                redis_production_config_1.queueRedis.zcard(QUEUE_KEYS.DELAYED),
            ]);
            return { waiting, active, completed, failed, delayed };
        }
        catch (error) {
            console.error("❌ Error getting queue stats:", error);
            return { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 };
        }
    }
    /**
     * Update queue statistics
     */
    async updateStats() {
        try {
            const stats = await this.getStats();
            await redis_production_config_1.queueRedis.hmset(QUEUE_KEYS.STATS, {
                waiting: stats.waiting.toString(),
                active: stats.active.toString(),
                completed: stats.completed.toString(),
                failed: stats.failed.toString(),
                delayed: stats.delayed.toString(),
                lastUpdated: Date.now().toString(),
            });
        }
        catch (error) {
            console.error("❌ Error updating stats:", error);
        }
    }
    /**
     * Start periodic cleanup of old completed/failed jobs
     */
    startCleanup() {
        this.cleanupInterval = setInterval(async () => {
            await this.cleanupOldJobs();
        }, QUEUE_CONFIG.CLEANUP_INTERVAL);
        console.log("🧹 Queue cleanup started");
    }
    /**
     * Clean up old completed and failed jobs
     */
    async cleanupOldJobs() {
        try {
            const cutoff = Date.now() - QUEUE_CONFIG.JOB_TTL * 1000;
            const [completedRemoved, failedRemoved] = await Promise.all([
                redis_production_config_1.queueRedis.zremrangebyscore(QUEUE_KEYS.COMPLETED, "-inf", cutoff),
                redis_production_config_1.queueRedis.zremrangebyscore(QUEUE_KEYS.FAILED, "-inf", cutoff),
            ]);
            if (completedRemoved > 0 || failedRemoved > 0) {
                console.log(`🧹 Cleaned up ${completedRemoved} completed and ${failedRemoved} failed jobs`);
            }
        }
        catch (error) {
            console.error("❌ Error during cleanup:", error);
        }
    }
    // =============================================================================
    // UTILITY METHODS
    // =============================================================================
    /**
     * Generate unique job ID
     */
    generateJobId() {
        return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Shutdown queue manager gracefully
     */
    async shutdown() {
        console.log("🔄 Shutting down queue manager...");
        this.stopProcessing();
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        console.log("✅ Queue manager shutdown complete");
    }
}
exports.QueueManager = QueueManager;
// =============================================================================
// EXPORT QUEUE MANAGER INSTANCE
// =============================================================================
exports.queueManager = QueueManager.getInstance();
// Convenience functions for adding common jobs
const addNotificationJob = (data, priority = JobPriority.NORMAL) => exports.queueManager.addJob(JobType.SEND_NOTIFICATION, data, { priority });
exports.addNotificationJob = addNotificationJob;
const addLeaderboardUpdateJob = (data, priority = JobPriority.HIGH) => exports.queueManager.addJob(JobType.UPDATE_LEADERBOARD, data, { priority });
exports.addLeaderboardUpdateJob = addLeaderboardUpdateJob;
const addGameResultJob = (data, priority = JobPriority.HIGH) => exports.queueManager.addJob(JobType.PROCESS_GAME_RESULT, data, { priority });
exports.addGameResultJob = addGameResultJob;
