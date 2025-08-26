# 🚀 Redis Mastery Guide for Backend Engineers

## 🎯 Learning Philosophy: Build in Layers, Not Mountains

Instead of memorizing 700 lines, learn **5 core patterns** that you can combine infinitely.

---

## 📚 Phase 1: Redis Fundamentals (Week 1-2)

### Essential Resources
- **Redis Official Docs**: https://redis.io/docs/
- **Redis Commands Reference**: https://redis.io/commands/
- **Interactive Tutorial**: https://try.redis.io/

### Core Concepts to Master
```bash
# 1. Basic Data Types (Learn these 5 first)
STRING  → SET key value, GET key
HASH    → HSET key field value, HGET key field  
LIST    → LPUSH key value, RPOP key
SET     → SADD key member, SMEMBERS key
ZSET    → ZADD key score member, ZRANGE key start stop
```

### 💡 Mental Model
```
Redis = Super-fast HashMap + Expiration + Atomic Operations
```

---

## 🏗️ Phase 2: Core Patterns You MUST Know (Week 3-4)

### Pattern 1: Session Store (Most Common)
```typescript
// The "Hello World" of Redis
const createSession = async (token: string, userData: any) => {
  await redis.setex(`session:${token}`, 3600, JSON.stringify(userData));
};

const getSession = async (token: string) => {
  const data = await redis.get(`session:${token}`);
  return data ? JSON.parse(data) : null;
};
```

### Pattern 2: Cache-Aside (90% of caching needs)
```typescript
// Check cache → Miss → Get from DB → Store in cache
const getUserProfile = async (userId: string) => {
  // 1. Try cache first
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);
  
  // 2. Cache miss - get from DB
  const user = await db.user.findById(userId);
  
  // 3. Store in cache
  await redis.setex(`user:${userId}`, 300, JSON.stringify(user));
  return user;
};
```

### Pattern 3: Rate Limiting (Security essential)
```typescript
// Window-based rate limiting
const rateLimit = async (key: string, limit: number, windowSec: number) => {
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSec);
  return count <= limit;
};
```

### Pattern 4: Pub/Sub (Real-time features)
```typescript
// Publisher
await redis.publish('notifications', JSON.stringify({ userId, message }));

// Subscriber
redis.subscribe('notifications');
redis.on('message', (channel, message) => {
  const data = JSON.parse(message);
  // Handle notification
});
```

### Pattern 5: Sorted Sets (Leaderboards, Rankings)
```typescript
// Add score
await redis.zadd('leaderboard', score, userId);

// Get top 10
const top10 = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');

// Get user rank
const rank = await redis.zrevrank('leaderboard', userId);
```

---

## 🧠 Phase 3: Advanced Patterns (Week 5-6)

### Circuit Breaker Pattern
```typescript
class CircuitBreaker {
  private failures = 0;
  private state = 'CLOSED'; // CLOSED → OPEN → HALF_OPEN
  
  async execute(operation: Function, fallback: Function) {
    if (this.state === 'OPEN') return fallback();
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      return fallback();
    }
  }
}
```

### Message Queue (Job Processing)
```typescript
// Producer
const addJob = async (jobType: string, data: any, priority = 5) => {
  const job = { id: uuid(), type: jobType, data, priority };
  await redis.zadd('queue:waiting', priority, JSON.stringify(job));
};

// Consumer
const processJobs = async () => {
  const job = await redis.zpopmax('queue:waiting');
  if (job) {
    await handleJob(JSON.parse(job[0]));
  }
};
```

---

## 🎯 Phase 4: Production-Ready Patterns (Week 7-8)

### Redis Connection Management
```typescript
// Connection pooling and health checks
const createRedisClient = () => {
  const client = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    retryStrategy: (times) => Math.min(times * 50, 2000),
    lazyConnect: true,
    maxRetriesPerRequest: 3
  });
  
  client.on('error', (err) => console.error('Redis error:', err));
  return client;
};
```

### Caching Strategies Cheat Sheet
```typescript
// 1. Cache-Aside (Most common)
const getData = async (key) => {
  let data = await redis.get(key);
  if (!data) {
    data = await database.get(key);
    await redis.setex(key, 300, JSON.stringify(data));
  }
  return JSON.parse(data);
};

// 2. Write-Through (Critical data)
const saveData = async (key, data) => {
  await database.save(key, data);          // DB first
  await redis.setex(key, 300, JSON.stringify(data)); // Then cache
};

// 3. Write-Behind (High throughput)
const saveDataAsync = async (key, data) => {
  await redis.setex(key, 300, JSON.stringify(data)); // Cache first
  await queue.add('save-to-db', { key, data });      // DB later
};
```

---

## 📖 Essential Documentation Bookmarks

### Official Redis Resources
1. **Redis Commands**: https://redis.io/commands/
2. **Data Types**: https://redis.io/docs/data-types/
3. **Persistence**: https://redis.io/docs/management/persistence/
4. **Replication**: https://redis.io/docs/management/replication/

### Node.js/TypeScript Specific
1. **ioredis Library**: https://github.com/redis/ioredis
2. **Node Redis**: https://github.com/redis/node-redis
3. **Bull Queue**: https://github.com/OptimalBits/bull

### System Design Resources
1. **Redis University**: https://university.redis.com/
2. **Caching Patterns**: https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Strategies.html
3. **Circuit Breaker Pattern**: https://martinfowler.com/bliki/CircuitBreaker.html

---

## 🧩 Boilerplate Templates to Memorize

### 1. Redis Client Setup (5 lines)
```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000)
});

export default redis;
```

### 2. Session Middleware (15 lines)
```typescript
export const sessionMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  
  const session = await redis.get(`session:${token}`);
  if (!session) return res.status(401).json({ error: 'Invalid session' });
  
  req.user = JSON.parse(session);
  next();
};
```

### 3. Cache Wrapper (10 lines)
```typescript
const withCache = (fn, ttl = 300) => async (...args) => {
  const key = `cache:${fn.name}:${JSON.stringify(args)}`;
  
  let result = await redis.get(key);
  if (!result) {
    result = await fn(...args);
    await redis.setex(key, ttl, JSON.stringify(result));
  }
  return JSON.parse(result);
};
```

### 4. Rate Limiter (8 lines)
```typescript
const rateLimit = (max, windowSec) => async (req, res, next) => {
  const key = `rate:${req.ip}:${Date.now() / (windowSec * 1000) | 0}`;
  const count = await redis.incr(key);
  
  if (count === 1) await redis.expire(key, windowSec);
  if (count > max) return res.status(429).json({ error: 'Rate limited' });
  
  next();
};
```

---

## 🎯 Learning Strategy: The 80/20 Rule

### 80% of Redis Usage = These 4 Patterns
1. **Session Storage** (Authentication)
2. **Cache-Aside** (Performance)
3. **Rate Limiting** (Security)
4. **Pub/Sub** (Real-time)

### 20% Advanced = These Patterns
1. **Message Queues** (Background jobs)
2. **Circuit Breakers** (Resilience)
3. **Distributed Locks** (Consistency)
4. **Leaderboards** (Gaming/Social)

---

## 🚀 Practice Exercises (Build These)

### Week 1-2: Fundamentals
- [ ] Build a simple session store
- [ ] Create a basic cache wrapper
- [ ] Implement rate limiting middleware

### Week 3-4: Intermediate
- [ ] Build a real-time chat with Pub/Sub
- [ ] Create a job queue system
- [ ] Implement a leaderboard

### Week 5-6: Advanced
- [ ] Add circuit breakers to your cache
- [ ] Build a distributed lock system
- [ ] Create a Redis cluster setup

### Week 7-8: Production
- [ ] Add monitoring and alerting
- [ ] Implement cache warming strategies
- [ ] Build a complete Redis middleware suite

---

## 💡 Pro Tips for Memorization

1. **Start Small**: Master 1 pattern per week
2. **Use Patterns**: Don't memorize implementations, memorize patterns
3. **Build Projects**: Each pattern should solve a real problem
4. **Code Daily**: 30 minutes of Redis coding daily
5. **Teach Others**: Explain patterns to solidify understanding

---

## 📝 Quick Reference Cheat Sheet

```typescript
// Session
redis.setex(`session:${token}`, 3600, JSON.stringify(user))
redis.get(`session:${token}`)

// Cache
redis.setex(`cache:${key}`, 300, JSON.stringify(data))
redis.get(`cache:${key}`)

// Rate Limit
redis.incr(`rate:${ip}:${window}`)
redis.expire(`rate:${ip}:${window}`, ttl)

// Queue
redis.zadd('queue', priority, JSON.stringify(job))
redis.zpopmax('queue')

// Leaderboard
redis.zadd('leaderboard', score, userId)
redis.zrevrange('leaderboard', 0, 9)

// Pub/Sub
redis.publish('channel', message)
redis.subscribe('channel')
```

---

## 🎯 Your Learning Path Summary

1. **Month 1**: Master the 5 core patterns
2. **Month 2**: Build 3 real projects using these patterns
3. **Month 3**: Add production features (monitoring, clustering)
4. **Month 4**: Optimize and scale your implementations

Remember: **It's not about memorizing 700 lines. It's about mastering 5 patterns that you can combine in infinite ways!**

---

*Keep this guide handy and reference it whenever you implement Redis features. The patterns will become second nature within 2-3 months of practice.*
