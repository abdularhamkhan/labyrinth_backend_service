# Redis Architecture Documentation

## Overview

This Redis implementation provides a comprehensive caching, session management, and message queue system for the "With a Twist" game backend. It's designed to handle 10k+ concurrent users with high performance and reliability.

## Architecture Components

### 1. **Redis Configuration (`config/redis.config.ts`)**

- **Multiple Redis Clients**: Separate clients for different use cases
  - `session`: User sessions and authentication (DB 0)
  - `cache`: General caching and leaderboards (DB 1)
  - `pubsub`: Real-time messaging (DB 2)
  - `queue`: Background job processing (DB 3)
  - `gameState`: Live game sessions (DB 4)

- **Connection Management**:
  - Automatic retry with exponential backoff
  - Health monitoring and statistics
  - Graceful shutdown handling

### 2. **Session Management (`session/sessionManager.ts`)**

- **Hybrid Approach**: Database + Redis
  - Database: Persistent session records for security/audit
  - Redis: Fast session validation and state management
- **Features**:
  - Session creation with TTL
  - Activity tracking and updates
  - Secure session termination

### 3. **Caching Strategies (`strategies/cachingStrategies.ts`)**

#### **Write-Through Cache**

- Write to cache and database simultaneously
- **Use Case**: Critical data (user profiles, scores)
- **Benefits**: Data consistency, immediate cache population

#### **Cache-Aside (Lazy Loading)**

- Load from cache first, fallback to database
- **Use Case**: Frequently accessed data (user profiles, friends)
- **Benefits**: Reduced database load, cache miss handling

#### **Write-Behind (Write-Back)**

- Write to cache immediately, database updates batched
- **Use Case**: High-frequency writes (user activity tracking)
- **Benefits**: Improved write performance, reduced database load

#### **Leaderboard Caching**

- Redis sorted sets for real-time rankings
- **Features**: Top N queries, rank calculations, cache rebuilding

### 4. **Message Queue System (`messageQueue/queueManager.ts`)**

- **Job Types**: Notifications, leaderboard updates, game processing
- **Priority System**: LOW (1) → CRITICAL (15)
- **Features**:
  - Retry with exponential backoff
  - Dead letter queue for failed jobs
  - Delayed job scheduling
  - Batch job processing

### 5. **Middleware (`middleware/redisMiddleware.ts`)**

- **Session Validation**: JWT-like token validation via Redis
- **API Response Caching**: Automatic response caching with TTL
- **Rate Limiting**: Redis-based request throttling
- **Online User Tracking**: Real-time user presence

## Usage Examples

### Basic Session Management

```typescript
import { createSession, getSession, validateSession } from "../redis";

// Create session
await createSession({
  userId: "user123",
  sessionToken: "token456",
  lastActivity: Date.now(),
  expiresAt: Date.now() + 3600000, // 1 hour
});

// Validate in middleware
app.use("/api/protected", validateSession);
```

### Caching Strategies

```typescript
import { CacheAsideStrategy, WriteThroughCache } from "../redis";

// Cache-aside pattern for user profiles
const userProfile = await CacheAsideStrategy.getUserProfile(userId);

// Write-through for critical updates
await WriteThroughCache.updateUserStats(userId, { scoreIncrement: 100 });
```

### Message Queue

```typescript
import { addNotificationJob, JobPriority } from "../redis";

// Add high-priority notification job
await addNotificationJob(
  {
    userId: "user123",
    message: "Friend request received!",
    type: "friend_request",
  },
  JobPriority.HIGH
);
```

### API Caching

```typescript
import { cacheResponse, authenticatedUser } from "../redis/middleware";

// Cache API response for 5 minutes
app.get(
  "/api/leaderboard",
  authenticatedUser,
  cacheResponse(300), // 5 minutes TTL
  leaderboardController
);
```

## Performance Optimizations

### 1. **Connection Pooling**

- Multiple specialized Redis clients
- Connection reuse and management
- Automatic reconnection handling

### 2. **Memory Management**

- Database-specific eviction policies:
  - Session: LRU (Least Recently Used)
  - Cache: LFU (Least Frequently Used)
  - Queue: No eviction
  - Game State: TTL-based eviction

### 3. **Query Optimization**

- Pipeline operations for batch requests
- Sorted sets for leaderboards
- Hash maps for complex data structures

## Monitoring and Health Checks

### Health Monitoring

```typescript
import { checkRedisHealth, getRedisStats } from "../redis";

// Check all Redis clients
const isHealthy = await checkRedisHealth();

// Get detailed statistics
const stats = await getRedisStats();
console.log("Redis Stats:", stats);
```

### Queue Monitoring

```typescript
import { queueManager } from "../redis";

// Get queue statistics
const queueStats = await queueManager.getStats();
console.log("Queue Stats:", queueStats);
```

## Scaling Considerations

### For 10k+ Concurrent Users

1. **Redis Cluster**: Scale horizontally with Redis Cluster
2. **Read Replicas**: Use Redis read replicas for read-heavy operations
3. **Connection Limits**: Monitor and adjust connection pool sizes
4. **Memory Optimization**: Regular cleanup of expired keys

### Production Deployment

1. **Redis Configuration**:

   ```bash
   # Bind to localhost only (security)
   bind 127.0.0.1 ::1

   # Set password
   requirepass your_strong_password

   # Memory optimization
   maxmemory 2gb
   maxmemory-policy allkeys-lru
   ```

2. **Monitoring**: Implement Redis monitoring (Redis Insight, Prometheus)

3. **Backup Strategy**: Regular RDB snapshots and AOF persistence

## Error Handling and Resilience

- **Circuit Breaker Pattern**: Fallback to database on Redis failures
- **Graceful Degradation**: Continue operation without caching if Redis is down
- **Retry Logic**: Exponential backoff for failed operations
- **Health Checks**: Regular health monitoring with alerting

## Integration with Main Application

```typescript
// In your main server file
import { initializeRedis, shutdownRedis } from "./redis";

// Initialize Redis on startup
await initializeRedis();

// Graceful shutdown
process.on("SIGTERM", async () => {
  await shutdownRedis();
  process.exit(0);
});
```

This Redis architecture provides a solid foundation for scaling your game backend to handle thousands of concurrent users while maintaining high performance and reliability.
