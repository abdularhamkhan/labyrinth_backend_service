/**
 * =============================================================================
 * REDIS PRODUCTION CONFIGURATION
 * =============================================================================
 *
 * Production-ready Redis configuration with clustering, monitoring,
 * failover support, and performance optimization.
 *
 * =============================================================================
 */

import Redis, { Cluster } from "ioredis";
import { config } from "./redisEnv";

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export interface RedisMetrics {
  memoryUsage: number;
  connectedClients: number;
  commandsProcessed: number;
  keysCount: number;
  avgResponseTime: number;
  errorRate: number;
  lastUpdated: string;
}

export interface RedisAlert {
  level: "warning" | "critical";
  message: string;
  timestamp: string;
  metric?: string;
  value?: number;
  threshold?: number;
}

export interface ProductionRedisClients {
  primary: Redis | Cluster;
  cache: Redis | Cluster;
  session: Redis | Cluster;
  gameState: Redis | Cluster;
  pubsub: Redis | Cluster;
  queue: Redis | Cluster;
}

// =============================================================================
// PRODUCTION REDIS MANAGER CLASS
// =============================================================================

export class ProductionRedisManager {
  private clients: ProductionRedisClients;
  private metrics: Map<string, RedisMetrics> = new Map();
  private alerts: RedisAlert[] = [];
  private monitoringInterval?: NodeJS.Timeout;

  constructor() {
    this.clients = this.createClients();
  }

  /**
   * Initialize Redis clients and monitoring
   */
  public initialize(): void {
    this.setupMonitoring();
    this.setupEventHandlers();
    console.log("Production Redis manager initialized");
  }

  // =============================================================================
  // CLIENT CREATION AND CONFIGURATION
  // =============================================================================

  private createClients(): ProductionRedisClients {
    console.log("Creating production Redis clients...");

    const baseConfig = {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      connectTimeout: 10000,
      commandTimeout: 5000,
      keepAlive: 30000,
    };

    if (config.redis.cluster.enabled) {
      return this.createClusterClients(baseConfig);
    } else {
      return this.createStandaloneClients(baseConfig);
    }
  }

  private createClusterClients(baseConfig: any): ProductionRedisClients {
    console.log("Setting up Redis cluster configuration");

    const clusterOptions = {
      ...baseConfig,
      enableOfflineQueue: false,
      redisOptions: baseConfig,
    };

    return {
      primary: new Cluster(config.redis.cluster.nodes, {
        ...clusterOptions,
        scaleReads: "slave",
      }),
      cache: new Cluster(config.redis.cluster.nodes, {
        ...clusterOptions,
        scaleReads: "slave",
      }),
      session: new Cluster(config.redis.cluster.nodes, {
        ...clusterOptions,
        scaleReads: "master",
      }),
      gameState: new Cluster(config.redis.cluster.nodes, {
        ...clusterOptions,
        scaleReads: "master",
      }),
      pubsub: new Cluster(config.redis.cluster.nodes, {
        ...clusterOptions,
        scaleReads: "master",
      }),
      queue: new Cluster(config.redis.cluster.nodes, {
        ...clusterOptions,
        scaleReads: "master",
      }),
    };
  }

  private createStandaloneClients(baseConfig: any): ProductionRedisClients {
    console.log("Setting up standalone Redis configuration");

    return {
      primary: new Redis({ ...baseConfig, db: 0 }),
      cache: new Redis({ ...baseConfig, db: 1 }),
      session: new Redis({ ...baseConfig, db: 2 }),
      gameState: new Redis({ ...baseConfig, db: 3 }),
      pubsub: new Redis({ ...baseConfig, db: 4 }),
      queue: new Redis({ ...baseConfig, db: 5 }),
    };
  }

  // =============================================================================
  // EVENT HANDLERS AND ERROR MANAGEMENT
  // =============================================================================

  private setupEventHandlers(): void {
    Object.entries(this.clients).forEach(([type, client]) => {
      client.on("connect", () => {
        console.log(`Redis ${type} client connected`);
      });

      client.on("ready", () => {
        console.log(`Redis ${type} client ready`);
      });

      client.on("error", (error: Error) => {
        console.error(`Redis ${type} client error:`, error);
        this.handleRedisError(type, error);
      });

      client.on("close", () => {
        console.log(`Redis ${type} client connection closed`);
      });

      client.on("reconnecting", () => {
        console.log(`Redis ${type} client reconnecting...`);
      });

      if (client instanceof Cluster) {
        client.on("node error", (error, node) => {
          console.error(`Redis cluster node error for ${type}:`, error, node);
          this.handleClusterNodeError(type, error, node);
        });
      }
    });
  }

  private handleRedisError(clientType: string, error: Error): void {
    const alert: RedisAlert = {
      level: "critical",
      message: `Redis ${clientType} client error: ${error.message}`,
      timestamp: new Date().toISOString(),
    };

    this.alerts.push(alert);
    console.error("Redis alert generated:", alert);
  }

  private handleClusterNodeError(clientType: string, error: Error, node: any): void {
    const alert: RedisAlert = {
      level: "warning",
      message: `Redis cluster node error for ${clientType}: ${error.message}`,
      timestamp: new Date().toISOString(),
    };

    this.alerts.push(alert);
    console.error("Redis cluster alert generated:", alert);
  }

  // =============================================================================
  // MONITORING AND METRICS
  // =============================================================================

  private setupMonitoring(): void {
    if (!config.redis.monitoring.enabled) {
      console.log("Redis monitoring disabled");
      return;
    }

    console.log("Setting up Redis monitoring...");

    this.monitoringInterval = setInterval(async () => {
      await this.collectMetrics();
      this.checkAlertThresholds();
    }, config.redis.monitoring.metricsInterval);

    console.log("Redis monitoring setup complete");
  }

  private async collectMetrics(): Promise<void> {
    try {
      for (const [type, client] of Object.entries(this.clients)) {
        // Skip pubsub client as it's in subscriber mode and can't run info command
        if (type === "pubsub") {
          continue;
        }

        try {
          const info = await client.info();
          const metrics = this.parseRedisInfo(info);

          this.metrics.set(type, {
            ...metrics,
            lastUpdated: new Date().toISOString(),
          });
        } catch (clientError) {
          console.warn(`Failed to collect metrics for Redis ${type} client:`, clientError);
        }
      }
    } catch (error) {
      console.error("Error collecting Redis metrics:", error);
    }
  }

  private parseRedisInfo(info: string): Omit<RedisMetrics, "lastUpdated"> {
    const result: any = {};

    info.split("\r\n").forEach((line) => {
      if (line.includes(":")) {
        const [key, value] = line.split(":");
        result[key] = value;
      }
    });

    return {
      memoryUsage: parseInt(result.used_memory || "0"),
      connectedClients: parseInt(result.connected_clients || "0"),
      commandsProcessed: parseInt(result.total_commands_processed || "0"),
      keysCount: parseInt(result.db0?.split(",")[0]?.split("=")[1] || "0"),
      avgResponseTime: 0, // Would need separate measurement
      errorRate: 0, // Would need separate tracking
    };
  }

  private checkAlertThresholds(): void {
    const thresholds = config.redis.monitoring.alertThresholds;

    this.metrics.forEach((metrics, clientType) => {
      // Memory usage alert
      const memoryUsagePercent = metrics.memoryUsage / (1024 * 1024 * 1024); // Convert to GB
      if (memoryUsagePercent > thresholds.memoryUsage) {
        this.generateAlert(
          "warning",
          `High memory usage for ${clientType}`,
          "memoryUsage",
          memoryUsagePercent,
          thresholds.memoryUsage
        );
      }

      // Connection count alert
      if (metrics.connectedClients > thresholds.connectionCount) {
        this.generateAlert(
          "warning",
          `High connection count for ${clientType}`,
          "connectionCount",
          metrics.connectedClients,
          thresholds.connectionCount
        );
      }

      // Response time alert
      if (metrics.avgResponseTime > thresholds.responseTime) {
        this.generateAlert(
          "warning",
          `High response time for ${clientType}`,
          "responseTime",
          metrics.avgResponseTime,
          thresholds.responseTime
        );
      }
    });
  }

  private generateAlert(
    level: "warning" | "critical",
    message: string,
    metric?: string,
    value?: number,
    threshold?: number
  ): void {
    const alert: RedisAlert = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metric,
      value,
      threshold,
    };

    this.alerts.push(alert);
    console.warn("Redis alert generated:", alert);
  }

  // =============================================================================
  // PUBLIC API METHODS
  // =============================================================================

  public getClient(type: keyof ProductionRedisClients): Redis | Cluster {
    const client = this.clients[type];
    if (!client) {
      throw new Error(`Redis client ${type} not found`);
    }
    return client;
  }

  public getClients(): { [key: string]: Redis | Cluster } {
    return { ...this.clients };
  }

  public async isHealthy(): Promise<boolean> {
    try {
      const healthChecks = Object.entries(this.clients).map(async ([type, client]) => {
        try {
          const start = Date.now();
          await client.ping();
          const responseTime = Date.now() - start;
          return { type, healthy: true, responseTime };
        } catch (error) {
          return { type, healthy: false, error: (error as Error).message };
        }
      });

      const results = await Promise.all(healthChecks);
      const allHealthy = results.every((result) => result.healthy);

      if (!allHealthy) {
        const unhealthyClients = results.filter((r) => !r.healthy);
        console.error("Unhealthy Redis clients:", unhealthyClients);
      }

      return allHealthy;
    } catch (error) {
      console.error("Error checking Redis health:", error);
      return false;
    }
  }

  public getMetrics(): Map<string, RedisMetrics> {
    return new Map(this.metrics);
  }

  public getAlerts(): RedisAlert[] {
    return [...this.alerts];
  }

  public clearAlerts(): void {
    this.alerts = [];
    console.log("Redis alerts cleared");
  }

  public async getStats(): Promise<Record<string, any>> {
    try {
      const stats: Record<string, any> = {};

      for (const [type, client] of Object.entries(this.clients)) {
        try {
          const info = await client.info();
          const clientStats = this.parseRedisInfo(info);
          stats[type] = clientStats;
        } catch (error) {
          stats[type] = { error: (error as Error).message };
        }
      }

      return {
        ...stats,
        alerts: this.alerts.length,
        monitoring: config.redis.monitoring.enabled,
        cluster: config.redis.cluster.enabled,
      };
    } catch (error) {
      console.error("Error getting Redis stats:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      console.log("Disconnecting production Redis clients...");

      // Clear monitoring interval
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval);
      }

      // Disconnect all clients
      const disconnectPromises = Object.entries(this.clients).map(async ([type, client]) => {
        try {
          await client.disconnect();
          console.log(`Redis ${type} client disconnected`);
        } catch (error) {
          console.error(`Error disconnecting Redis ${type} client:`, error);
        }
      });

      await Promise.all(disconnectPromises);
      console.log("All Redis clients disconnected");
    } catch (error) {
      console.error("Error during Redis disconnection:", error);
      throw error;
    }
  }
}

// =============================================================================
// GLOBAL PRODUCTION INSTANCES
// =============================================================================

// Create global production Redis manager
const productionRedisManager = new ProductionRedisManager();

// Initialize Redis clients on startup
productionRedisManager.initialize();

// Export individual clients for convenient access
export const sessionRedis = productionRedisManager.getClient("session");
export const cacheRedis = productionRedisManager.getClient("cache");
export const pubsubRedis = productionRedisManager.getClient("pubsub");
export const queueRedis = productionRedisManager.getClient("queue");
export const gameStateRedis = productionRedisManager.getClient("gameState");

// Export manager and utility functions
// Note: ProductionRedisManager is already exported above
export const checkRedisHealth = () => productionRedisManager.isHealthy();
export const getRedisStats = () => productionRedisManager.getStats();
export const getRedisMetrics = () => productionRedisManager.getMetrics();
export const getRedisAlerts = () => productionRedisManager.getAlerts();
export const clearRedisAlerts = () => productionRedisManager.clearAlerts();

// Export clients as a group
export const productionRedisClients = {
  session: sessionRedis,
  cache: cacheRedis,
  pubsub: pubsubRedis,
  queue: queueRedis,
  gameState: gameStateRedis,
};
