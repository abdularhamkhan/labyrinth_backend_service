"use strict";
/**
 * =============================================================================
 * REDIS CIRCUIT BREAKER - Resilience Pattern Implementation
 * =============================================================================
 *
 * This module implements the Circuit Breaker pattern to prevent cascading
 * failures when Redis is unavailable. It provides automatic fallback to
 * database operations and fast failure detection.
 *
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Circuit is open, all requests fail fast
 * - HALF_OPEN: Testing if Redis is back online
 *
 * =============================================================================
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisCircuitBreakers = exports.circuitBreakerManager = exports.CircuitBreakerManager = exports.CircuitBreaker = exports.CircuitBreakerState = void 0;
const redisEnv_1 = require("../config/redisEnv");
// =============================================================================
// CIRCUIT BREAKER INTERFACES
// =============================================================================
var CircuitBreakerState;
(function (CircuitBreakerState) {
    CircuitBreakerState["CLOSED"] = "CLOSED";
    CircuitBreakerState["OPEN"] = "OPEN";
    CircuitBreakerState["HALF_OPEN"] = "HALF_OPEN";
})(CircuitBreakerState || (exports.CircuitBreakerState = CircuitBreakerState = {}));
// =============================================================================
// CIRCUIT BREAKER IMPLEMENTATION
// =============================================================================
class CircuitBreaker {
    constructor(serviceName, config) {
        this.state = CircuitBreakerState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.lastFailureTime = 0;
        this.lastSuccessTime = 0;
        this.requestCount = 0;
        this.nextAttempt = 0;
        this.serviceName = serviceName;
        this.config = {
            failureThreshold: config?.failureThreshold || 5,
            recoveryTimeout: config?.recoveryTimeout || 60000,
            monitoringPeriod: config?.monitoringPeriod || 10000,
            successThreshold: config?.successThreshold || 3,
        };
        console.log(`🔧 Circuit breaker initialized for ${serviceName}:`, this.config);
    }
    /**
     * Execute a Redis operation with circuit breaker protection
     */
    async execute(operation, fallback) {
        this.requestCount++;
        // Check if circuit should be opened due to failures
        this.checkCircuitState();
        switch (this.state) {
            case CircuitBreakerState.CLOSED:
                return this.executeClosed(operation, fallback);
            case CircuitBreakerState.OPEN:
                return this.executeOpen(fallback);
            case CircuitBreakerState.HALF_OPEN:
                return this.executeHalfOpen(operation, fallback);
            default:
                throw new Error(`Unknown circuit breaker state: ${this.state}`);
        }
    }
    /**
     * Execute operation when circuit is closed (normal operation)
     */
    async executeClosed(operation, fallback) {
        try {
            const result = await this.executeWithTimeout(operation);
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure(error);
            if (fallback) {
                console.log(`🔄 Circuit breaker fallback for ${this.serviceName}`);
                return await fallback();
            }
            throw error;
        }
    }
    /**
     * Execute operation when circuit is open (fail fast)
     */
    async executeOpen(fallback) {
        if (fallback) {
            console.log(`⚡ Circuit breaker open - using fallback for ${this.serviceName}`);
            return await fallback();
        }
        throw new Error(`Circuit breaker is OPEN for ${this.serviceName} - fast failing`);
    }
    /**
     * Execute operation when circuit is half-open (testing recovery)
     */
    async executeHalfOpen(operation, fallback) {
        try {
            const result = await this.executeWithTimeout(operation);
            this.onSuccess();
            // If we've had enough successes, close the circuit
            if (this.successCount >= this.config.successThreshold) {
                this.closeCircuit();
            }
            return result;
        }
        catch (error) {
            this.onFailure(error);
            this.openCircuit();
            if (fallback) {
                console.log(`🔄 Circuit breaker half-open failed - using fallback for ${this.serviceName}`);
                return await fallback();
            }
            throw error;
        }
    }
    /**
     * Execute operation with timeout
     */
    async executeWithTimeout(operation) {
        return Promise.race([
            operation(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Operation timeout")), 5000)),
        ]);
    }
    /**
     * Handle successful operation
     */
    onSuccess() {
        this.failureCount = 0;
        this.successCount++;
        this.lastSuccessTime = Date.now();
        if (this.state === CircuitBreakerState.HALF_OPEN) {
            console.log(`✅ Circuit breaker success for ${this.serviceName} (${this.successCount}/${this.config.successThreshold})`);
        }
    }
    /**
     * Handle failed operation
     */
    onFailure(error) {
        this.failureCount++;
        this.successCount = 0;
        this.lastFailureTime = Date.now();
        console.error(`❌ Circuit breaker failure for ${this.serviceName}:`, {
            error: error.message,
            failureCount: this.failureCount,
            threshold: this.config.failureThreshold,
            state: this.state,
        });
    }
    /**
     * Check and update circuit state based on current conditions
     */
    checkCircuitState() {
        const now = Date.now();
        switch (this.state) {
            case CircuitBreakerState.CLOSED:
                if (this.failureCount >= this.config.failureThreshold) {
                    this.openCircuit();
                }
                break;
            case CircuitBreakerState.OPEN:
                if (now >= this.nextAttempt) {
                    this.halfOpenCircuit();
                }
                break;
            case CircuitBreakerState.HALF_OPEN:
                // State is managed in execute methods
                break;
        }
    }
    /**
     * Open the circuit (fail fast mode)
     */
    openCircuit() {
        this.state = CircuitBreakerState.OPEN;
        this.nextAttempt = Date.now() + this.config.recoveryTimeout;
        console.warn(`🔴 Circuit breaker OPENED for ${this.serviceName}:`, {
            failureCount: this.failureCount,
            nextAttempt: new Date(this.nextAttempt).toISOString(),
        });
    }
    /**
     * Half-open the circuit (testing mode)
     */
    halfOpenCircuit() {
        this.state = CircuitBreakerState.HALF_OPEN;
        this.successCount = 0;
        console.log(`🟡 Circuit breaker HALF-OPEN for ${this.serviceName} - testing recovery`);
    }
    /**
     * Close the circuit (normal operation)
     */
    closeCircuit() {
        this.state = CircuitBreakerState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        console.log(`🟢 Circuit breaker CLOSED for ${this.serviceName} - service recovered`);
    }
    /**
     * Force circuit to specific state (for testing/manual intervention)
     */
    forceState(state) {
        this.state = state;
        this.failureCount = 0;
        this.successCount = 0;
        console.log(`🔧 Circuit breaker force-set to ${state} for ${this.serviceName}`);
    }
    /**
     * Get current circuit breaker statistics
     */
    getStats() {
        return {
            state: this.state,
            failureCount: this.failureCount,
            successCount: this.successCount,
            lastFailureTime: this.lastFailureTime,
            lastSuccessTime: this.lastSuccessTime,
            requestCount: this.requestCount,
            uptime: Date.now() - (this.lastFailureTime || Date.now()),
        };
    }
    /**
     * Reset circuit breaker to initial state
     */
    reset() {
        this.state = CircuitBreakerState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.lastFailureTime = 0;
        this.lastSuccessTime = 0;
        this.requestCount = 0;
        this.nextAttempt = 0;
        console.log(`🔄 Circuit breaker reset for ${this.serviceName}`);
    }
}
exports.CircuitBreaker = CircuitBreaker;
// =============================================================================
// CIRCUIT BREAKER MANAGER
// =============================================================================
class CircuitBreakerManager {
    constructor() {
        this.breakers = new Map();
    }
    static getInstance() {
        if (!CircuitBreakerManager.instance) {
            CircuitBreakerManager.instance = new CircuitBreakerManager();
        }
        return CircuitBreakerManager.instance;
    }
    /**
     * Get or create a circuit breaker for a service
     */
    getBreaker(serviceName, config) {
        if (!this.breakers.has(serviceName)) {
            const breaker = new CircuitBreaker(serviceName, config);
            this.breakers.set(serviceName, breaker);
        }
        return this.breakers.get(serviceName);
    }
    /**
     * Get all circuit breaker statistics
     */
    getAllStats() {
        const stats = {};
        this.breakers.forEach((breaker, serviceName) => {
            stats[serviceName] = breaker.getStats();
        });
        return stats;
    }
    /**
     * Reset all circuit breakers
     */
    resetAll() {
        this.breakers.forEach((breaker) => {
            breaker.reset();
        });
        console.log("🔄 All circuit breakers reset");
    }
}
exports.CircuitBreakerManager = CircuitBreakerManager;
// Export singleton instance
exports.circuitBreakerManager = CircuitBreakerManager.getInstance();
// Pre-configured circuit breakers for Redis services
exports.redisCircuitBreakers = {
    session: exports.circuitBreakerManager.getBreaker("redis-session", redisEnv_1.config.redis.circuitBreaker),
    cache: exports.circuitBreakerManager.getBreaker("redis-cache", redisEnv_1.config.redis.circuitBreaker),
    pubsub: exports.circuitBreakerManager.getBreaker("redis-pubsub", redisEnv_1.config.redis.circuitBreaker),
    queue: exports.circuitBreakerManager.getBreaker("redis-queue", redisEnv_1.config.redis.circuitBreaker),
    gameState: exports.circuitBreakerManager.getBreaker("redis-gamestate", redisEnv_1.config.redis.circuitBreaker),
};
