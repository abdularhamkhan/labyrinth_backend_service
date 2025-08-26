/**
 * =============================================================================
 * REDIS TYPES - INTERNAL SERVICE INTERFACES
 * =============================================================================
 *
 * These interfaces define Redis-related types used across the application
 * for caching, sessions, queues, and other Redis operations.
 *
 * =============================================================================
 */

/**
 * Redis client configuration
 */
export interface RedisClientConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  retryDelayOnFailover: number;
  enableReadyCheck: boolean;
  maxRetriesPerRequest: number;
  lazyConnect: boolean;
}

/**
 * Session data structure
 */
export interface SessionData {
  userId: string;
  username: string;
  email: string;
  createdAt: string;
  lastAccessed: string;
  expiresAt: string;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Cache entry metadata
 */
export interface CacheEntry<T = any> {
  data: T;
  createdAt: string;
  expiresAt: string;
  hits: number;
  lastAccessed: string;
}

/**
 * Queue job structure
 */
export interface QueueJob {
  id: string;
  type: JobType;
  data: any;
  priority: number;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  scheduledFor?: string;
  processedAt?: string;
  completedAt?: string;
  failedAt?: string;
  error?: string;
}

/**
 * Available job types for the message queue
 */
export type JobType =
  | "NOTIFICATION"
  | "LEADERBOARD_UPDATE"
  | "GAME_RESULT_PROCESSING"
  | "FRIEND_REQUEST"
  | "DAILY_CHALLENGE"
  | "USER_STATS_CALCULATION"
  | "SESSION_CLEANUP"
  | "CACHE_WARMING";

/**
 * Circuit breaker state
 */
export interface CircuitBreakerState {
  state: "CLOSED" | "OPEN" | "HALF_OPEN";
  failureCount: number;
  lastFailureTime: number;
  nextAttemptTime: number;
  successCount: number;
}

/**
 * Redis health check result
 */
export interface RedisHealthCheck {
  isHealthy: boolean;
  latency: number;
  memoryUsage: number;
  connectedClients: number;
  lastChecked: string;
  errors?: string[];
}

/**
 * Leaderboard cache operations
 */
export interface LeaderboardCacheOperations {
  getUserRank(type: string, userId: string): Promise<number | null>;
  updateLeaderboard(type: string, userId: string, score: number): Promise<void>;
  rebuildLeaderboard(type: string): Promise<void>;
  getTopPlayers(type: string, limit: number, offset: number): Promise<any[]>;
}

/**
 * Cache invalidation patterns
 */
export interface CacheInvalidationPatterns {
  invalidateUserCaches(userId: string): Promise<void>;
  invalidateLeaderboardCaches(): Promise<void>;
  invalidateGameCaches(gameId: string): Promise<void>;
  invalidatePatterns(patterns: string[]): Promise<void>;
}

/**
 * =============================================================================
 * ENHANCED REDIS CLIENT INTERFACES
 * =============================================================================
 */

/**
 * Redis key type - can be string or Buffer
 */
export type RedisKey = string | Buffer;

/**
 * Enhanced Redis client interface with circuit breaker support
 */
export interface EnhancedRedisClient {
  // Basic Redis operations
  get(key: RedisKey): Promise<string | null>;
  set(key: RedisKey, value: string, ...args: any[]): Promise<"OK">;
  del(...keys: RedisKey[]): Promise<number>;
  exists(...keys: RedisKey[]): Promise<number>;

  // String operations
  setex(key: RedisKey, seconds: number, value: string): Promise<"OK">;
  ttl(key: RedisKey): Promise<number>;
  expire(key: RedisKey, seconds: number): Promise<0 | 1>;

  // Hash operations
  hget(key: RedisKey, field: string): Promise<string | null>;
  hset(key: RedisKey, field: string, value: string): Promise<0 | 1>;
  hgetall(key: RedisKey): Promise<Record<string, string>>;
  hdel(key: RedisKey, ...fields: string[]): Promise<number>;

  // List operations
  lpush(key: RedisKey, ...values: string[]): Promise<number>;
  rpush(key: RedisKey, ...values: string[]): Promise<number>;
  lpop(key: RedisKey): Promise<string | null>;
  rpop(key: RedisKey): Promise<string | null>;
  lrange(key: RedisKey, start: number, stop: number): Promise<string[]>;

  // Set operations
  sadd(key: RedisKey, ...members: string[]): Promise<number>;
  srem(key: RedisKey, ...members: string[]): Promise<number>;
  smembers(key: RedisKey): Promise<string[]>;
  sismember(key: RedisKey, member: string): Promise<0 | 1>;

  // Sorted set operations
  zadd(key: RedisKey, score: number, member: string): Promise<0 | 1>;
  zrem(key: RedisKey, ...members: string[]): Promise<number>;
  zrange(key: RedisKey, start: number, stop: number): Promise<string[]>;
  zrevrange(
    key: RedisKey,
    start: number,
    stop: number,
    withScores?: "WITHSCORES"
  ): Promise<string[]>;
  zrevrank(key: RedisKey, member: string): Promise<number | null>;
  zscore(key: RedisKey, member: string): Promise<string | null>;

  // Pattern operations
  keys(pattern: string): Promise<string[]>;

  // Connection operations
  ping(): Promise<"PONG">;
  info(section?: string): Promise<string>;
  dbsize(): Promise<number>;

  // Pipeline and transaction support
  pipeline(): any;
  multi(): any;

  // Event handling
  on(event: string, callback: (...args: any[]) => void): void;

  // Connection status
  status: "connecting" | "connect" | "ready" | "reconnecting" | "end";
}

/**
 * Redis cluster interface
 */
export interface RedisCluster extends EnhancedRedisClient {
  // Cluster-specific methods
  disconnect(): Promise<void>;
}

/**
 * Redis standalone interface
 */
export interface RedisStandalone extends EnhancedRedisClient {
  // Standalone-specific methods
  quit(): Promise<"OK">;
}

/**
 * Production Redis clients collection
 */
export interface ProductionRedisClients {
  session: RedisStandalone | RedisCluster;
  cache: RedisStandalone | RedisCluster;
  pubsub: RedisStandalone | RedisCluster;
  queue: RedisStandalone | RedisCluster;
  gameState: RedisStandalone | RedisCluster;
}

/**
 * Redis metrics interface
 */
export interface RedisMetrics {
  connectionCount: number;
  memoryUsage: number;
  memoryUsagePercentage: number;
  hitRate: number;
  missRate: number;
  responseTime: number;
  errorRate: number;
  uptime: number;
}

/**
 * Redis alert interface
 */
export interface RedisAlert {
  level: "warning" | "error" | "critical";
  message: string;
  timestamp: number;
  metrics?: Partial<RedisMetrics>;
}

/**
 * Circuit breaker execution interface
 */
export interface CircuitBreakerExecution<T> {
  execute<R>(operation: () => Promise<R>, fallback?: () => Promise<R>): Promise<R>;
}

/**
 * Redis circuit breakers collection
 */
export interface RedisCircuitBreakers {
  session: CircuitBreakerExecution<any>;
  cache: CircuitBreakerExecution<any>;
  pubsub: CircuitBreakerExecution<any>;
  queue: CircuitBreakerExecution<any>;
  gameState: CircuitBreakerExecution<any>;
}

/**
 * =============================================================================
 * REDIS CONFIGURATION TYPES
 * =============================================================================
 */

/**
 * Enhanced Redis client configuration
 */
export interface EnhancedRedisClientConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  db?: number;
  keyPrefix?: string;

  // Connection settings
  connectTimeout: number;
  commandTimeout: number;
  maxRetriesPerRequest: number;

  // Connection pool
  family: 4 | 6;
  keepAlive: number;
  lazyConnect: boolean;

  // Retry strategy
  retryStrategy?: (times: number) => number;

  // Performance
  enableAutoPipelining: boolean;
  maxLoadingTimeout: number;

  // Security
  tls?: {
    cert?: string;
    key?: string;
    ca?: string;
    rejectUnauthorized: boolean;
  };

  // Development
  showFriendlyErrorStack: boolean;
}

/**
 * Cluster configuration
 */
export interface RedisClusterConfig {
  enableOfflineQueue: boolean;
  redisOptions: EnhancedRedisClientConfig;
  scaleReads: "master" | "slave" | "all";
  maxRedirections: number;
  retryDelayOnFailover: number;
  poolOptions?: {
    min: number;
    max: number;
    acquireTimeoutMillis: number;
    idleTimeoutMillis: number;
  };
}

/**
 * Redis environment configuration
 */
export interface RedisEnvironmentConfig {
  redis: {
    host: string;
    port: number;
    security: {
      username?: string;
      password?: string;
      tls: boolean;
      cert?: string;
      key?: string;
      ca?: string;
    };
    cluster: {
      enabled: boolean;
      nodes: Array<{ host: string; port: number }>;
    };
    pool: {
      minConnections: number;
      maxConnections: number;
      acquireTimeoutMillis: number;
      idleTimeoutMillis: number;
    };
    monitoring: {
      enabled: boolean;
      metricsInterval: number;
      alertThresholds: {
        memoryUsage: number;
        responseTime: number;
        connectionCount: number;
      };
    };
  };
  app: {
    environment: "development" | "production" | "test";
  };
}
