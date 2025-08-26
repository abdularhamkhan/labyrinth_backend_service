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

import { config } from "../config/redisEnv";

// =============================================================================
// CIRCUIT BREAKER INTERFACES
// =============================================================================

export enum CircuitBreakerState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  HALF_OPEN = "HALF_OPEN",
}

export interface CircuitBreakerConfig {
  failureThreshold: number; // Number of failures before opening
  recoveryTimeout: number; // Time before attempting recovery (ms)
  monitoringPeriod: number; // Time window for monitoring failures (ms)
  successThreshold: number; // Successes needed to close circuit
}

export interface CircuitBreakerStats {
  state: CircuitBreakerState;
  failureCount: number;
  successCount: number;
  lastFailureTime: number;
  lastSuccessTime: number;
  requestCount: number;
  uptime: number;
}

// =============================================================================
// CIRCUIT BREAKER IMPLEMENTATION
// =============================================================================

export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime: number = 0;
  private lastSuccessTime: number = 0;
  private requestCount: number = 0;
  private nextAttempt: number = 0;
  private readonly config: CircuitBreakerConfig;
  private readonly serviceName: string;

  constructor(serviceName: string, config?: Partial<CircuitBreakerConfig>) {
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
  async execute<T>(operation: () => Promise<T>, fallback?: () => Promise<T>): Promise<T> {
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
  private async executeClosed<T>(
    operation: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    try {
      const result = await this.executeWithTimeout(operation);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error as Error);

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
  private async executeOpen<T>(fallback?: () => Promise<T>): Promise<T> {
    if (fallback) {
      console.log(`⚡ Circuit breaker open - using fallback for ${this.serviceName}`);
      return await fallback();
    }

    throw new Error(`Circuit breaker is OPEN for ${this.serviceName} - fast failing`);
  }

  /**
   * Execute operation when circuit is half-open (testing recovery)
   */
  private async executeHalfOpen<T>(
    operation: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    try {
      const result = await this.executeWithTimeout(operation);
      this.onSuccess();

      // If we've had enough successes, close the circuit
      if (this.successCount >= this.config.successThreshold) {
        this.closeCircuit();
      }

      return result;
    } catch (error) {
      this.onFailure(error as Error);
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
  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Operation timeout")), 5000)
      ),
    ]);
  }

  /**
   * Handle successful operation
   */
  private onSuccess(): void {
    this.failureCount = 0;
    this.successCount++;
    this.lastSuccessTime = Date.now();

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      console.log(
        `✅ Circuit breaker success for ${this.serviceName} (${this.successCount}/${this.config.successThreshold})`
      );
    }
  }

  /**
   * Handle failed operation
   */
  private onFailure(error: Error): void {
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
  private checkCircuitState(): void {
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
  private openCircuit(): void {
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
  private halfOpenCircuit(): void {
    this.state = CircuitBreakerState.HALF_OPEN;
    this.successCount = 0;

    console.log(`🟡 Circuit breaker HALF-OPEN for ${this.serviceName} - testing recovery`);
  }

  /**
   * Close the circuit (normal operation)
   */
  private closeCircuit(): void {
    this.state = CircuitBreakerState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;

    console.log(`🟢 Circuit breaker CLOSED for ${this.serviceName} - service recovered`);
  }

  /**
   * Force circuit to specific state (for testing/manual intervention)
   */
  public forceState(state: CircuitBreakerState): void {
    this.state = state;
    this.failureCount = 0;
    this.successCount = 0;

    console.log(`🔧 Circuit breaker force-set to ${state} for ${this.serviceName}`);
  }

  /**
   * Get current circuit breaker statistics
   */
  public getStats(): CircuitBreakerStats {
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
  public reset(): void {
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

// =============================================================================
// CIRCUIT BREAKER MANAGER
// =============================================================================

export class CircuitBreakerManager {
  private static instance: CircuitBreakerManager;
  private breakers: Map<string, CircuitBreaker> = new Map();

  private constructor() {}

  public static getInstance(): CircuitBreakerManager {
    if (!CircuitBreakerManager.instance) {
      CircuitBreakerManager.instance = new CircuitBreakerManager();
    }
    return CircuitBreakerManager.instance;
  }

  /**
   * Get or create a circuit breaker for a service
   */
  public getBreaker(serviceName: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
    if (!this.breakers.has(serviceName)) {
      const breaker = new CircuitBreaker(serviceName, config);
      this.breakers.set(serviceName, breaker);
    }

    return this.breakers.get(serviceName)!;
  }

  /**
   * Get all circuit breaker statistics
   */
  public getAllStats(): Record<string, CircuitBreakerStats> {
    const stats: Record<string, CircuitBreakerStats> = {};

    this.breakers.forEach((breaker, serviceName) => {
      stats[serviceName] = breaker.getStats();
    });

    return stats;
  }

  /**
   * Reset all circuit breakers
   */
  public resetAll(): void {
    this.breakers.forEach((breaker) => {
      breaker.reset();
    });

    console.log("🔄 All circuit breakers reset");
  }
}

// Export singleton instance
export const circuitBreakerManager = CircuitBreakerManager.getInstance();

// Pre-configured circuit breakers for Redis services
export const redisCircuitBreakers = {
  session: circuitBreakerManager.getBreaker("redis-session", config.redis.circuitBreaker),
  cache: circuitBreakerManager.getBreaker("redis-cache", config.redis.circuitBreaker),
  pubsub: circuitBreakerManager.getBreaker("redis-pubsub", config.redis.circuitBreaker),
  queue: circuitBreakerManager.getBreaker("redis-queue", config.redis.circuitBreaker),
  gameState: circuitBreakerManager.getBreaker("redis-gamestate", config.redis.circuitBreaker),
};
