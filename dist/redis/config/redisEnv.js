"use strict";
/**
 * =============================================================================
 * REDIS ENVIRONMENT CONFIGURATION
 * =============================================================================
 *
 * This module contains all Redis-specific environment variables and
 * configuration settings for production-ready Redis deployment.
 *
 * =============================================================================
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
exports.config = {
    redis: {
        // =============================================================================
        // BASIC CONNECTION SETTINGS
        // =============================================================================
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD,
        // =============================================================================
        // REDIS CLUSTER CONFIGURATION
        // High availability setup with multiple Redis nodes
        // =============================================================================
        cluster: {
            enabled: process.env.REDIS_CLUSTER_ENABLED === "true",
            nodes: process.env.REDIS_CLUSTER_NODES?.split(",") || [
                { host: "localhost", port: 6379 },
                { host: "localhost", port: 6380 },
                { host: "localhost", port: 6381 },
            ],
        },
        // =============================================================================
        // SECURITY CONFIGURATION
        // Authentication, encryption, and network security
        // =============================================================================
        security: {
            tls: process.env.REDIS_TLS_ENABLED === "true",
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            cert: process.env.REDIS_TLS_CERT,
            key: process.env.REDIS_TLS_KEY,
            ca: process.env.REDIS_TLS_CA,
        },
        // =============================================================================
        // CONNECTION POOL CONFIGURATION
        // Manages connection limits and timeouts for optimal performance
        // =============================================================================
        pool: {
            maxConnections: parseInt(process.env.REDIS_MAX_CONNECTIONS || "50"),
            minConnections: parseInt(process.env.REDIS_MIN_CONNECTIONS || "5"),
            acquireTimeoutMillis: parseInt(process.env.REDIS_ACQUIRE_TIMEOUT || "10000"),
            idleTimeoutMillis: parseInt(process.env.REDIS_IDLE_TIMEOUT || "30000"),
        },
        // =============================================================================
        // CIRCUIT BREAKER CONFIGURATION
        // Fault tolerance and resilience pattern settings
        // =============================================================================
        circuitBreaker: {
            enabled: process.env.REDIS_CIRCUIT_BREAKER_ENABLED !== "false",
            failureThreshold: parseInt(process.env.REDIS_FAILURE_THRESHOLD || "5"),
            recoveryTimeout: parseInt(process.env.REDIS_RECOVERY_TIMEOUT || "60000"),
            monitoringPeriod: parseInt(process.env.REDIS_MONITORING_PERIOD || "10000"),
        },
        // =============================================================================
        // PERFORMANCE AND MEMORY CONFIGURATION
        // Memory management, persistence, and optimization settings
        // =============================================================================
        performance: {
            maxMemoryPolicy: process.env.REDIS_MAX_MEMORY_POLICY || "allkeys-lru",
            maxMemory: process.env.REDIS_MAX_MEMORY || "2gb",
            enablePersistence: process.env.REDIS_PERSISTENCE_ENABLED !== "false",
            saveInterval: parseInt(process.env.REDIS_SAVE_INTERVAL || "900"), // 15 minutes
        },
        // =============================================================================
        // MONITORING AND ALERTING CONFIGURATION
        // Health checks, metrics collection, and alert thresholds
        // =============================================================================
        monitoring: {
            enabled: process.env.REDIS_MONITORING_ENABLED !== "false",
            metricsInterval: parseInt(process.env.REDIS_METRICS_INTERVAL || "30000"), // 30 seconds
            alertThresholds: {
                memoryUsage: parseFloat(process.env.REDIS_MEMORY_ALERT_THRESHOLD || "0.8"), // 80%
                connectionCount: parseInt(process.env.REDIS_CONNECTION_ALERT_THRESHOLD || "40"),
                responseTime: parseInt(process.env.REDIS_RESPONSE_TIME_THRESHOLD || "100"), // 100ms
            },
        },
    },
    // =============================================================================
    // APPLICATION CONFIGURATION
    // General application settings that affect Redis behavior
    // =============================================================================
    app: {
        environment: process.env.NODE_ENV || "development",
        logLevel: process.env.LOG_LEVEL || "info",
        enableDetailedLogging: process.env.ENABLE_DETAILED_LOGGING === "true",
    },
};
