# 🔥 Redis Boilerplate Templates (Copy-Paste Ready)

## 🎯 Philosophy: Memorize These 8 Templates, Build Anything

---

## 1. 🔧 Basic Redis Client (5 lines)

```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000)
});

export default redis;
```

---

## 2. 🔐 Session Manager (20 lines)

```typescript
import redis from './redis-client';

export const SessionManager = {
  async create(token: string, userData: any, ttl = 3600) {
    await redis.setex(`session:${token}`, ttl, JSON.stringify(userData));
  },

  async get(token: string) {
    const data = await redis.get(`session:${token}`);
    return data ? JSON.parse(data) : null;
  },

  async destroy(token: string) {
    await redis.del(`session:${token}`);
  },

  async refresh(token: string, ttl = 3600) {
    await redis.expire(`session:${token}`, ttl);
  }
};
```

---

## 3. ⚡ Cache Wrapper (15 lines)

```typescript
export const Cache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(`cache:${key}`);
    return data ? JSON.parse(data) : null;
  },

  async set(key: string, value: any, ttl = 300) {
    await redis.setex(`cache:${key}`, ttl, JSON.stringify(value));
  },

  async invalidate(pattern: string) {
    const keys = await redis.keys(`cache:${pattern}`);
    if (keys.length > 0) await redis.del(...keys);
  }
};
```

---

## 4. 🛡️ Rate Limiter (12 lines)

```typescript
export const RateLimit = {
  async check(identifier: string, max: number, windowSec: number): Promise<boolean> {
    const window = Math.floor(Date.now() / (windowSec * 1000));
    const key = `rate:${identifier}:${window}`;
    
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSec);
    
    return count <= max;
  }
};
```

---

## 5. 📊 Leaderboard (18 lines)

```typescript
export const Leaderboard = {
  async addScore(leaderboard: string, userId: string, score: number) {
    await redis.zadd(`lb:${leaderboard}`, score, userId);
  },

  async getTop(leaderboard: string, count = 10) {
    return await redis.zrevrange(`lb:${leaderboard}`, 0, count - 1, 'WITHSCORES');
  },

  async getUserRank(leaderboard: string, userId: string) {
    return await redis.zrevrank(`lb:${leaderboard}`, userId);
  },

  async getUserScore(leaderboard: string, userId: string) {
    return await redis.zscore(`lb:${leaderboard}`, userId);
  }
};
```

---

## 6. 📨 Message Queue (25 lines)

```typescript
export const Queue = {
  async add(queueName: string, job: any, priority = 5) {
    const jobData = {
      id: Date.now() + Math.random(),
      data: job,
      createdAt: Date.now()
    };
    await redis.zadd(`queue:${queueName}`, priority, JSON.stringify(jobData));
  },

  async process(queueName: string, processor: (job: any) => Promise<void>) {
    const job = await redis.zpopmax(`queue:${queueName}`);
    if (!job || job.length === 0) return null;

    const jobData = JSON.parse(job[0]);
    try {
      await processor(jobData.data);
      console.log(`✅ Job ${jobData.id} completed`);
    } catch (error) {
      console.error(`❌ Job ${jobData.id} failed:`, error);
      // Add retry logic here if needed
    }
  }
};
```

---

## 7. 📡 Pub/Sub Manager (18 lines)

```typescript
export const PubSub = {
  publisher: redis,
  subscriber: redis.duplicate(),

  async publish(channel: string, message: any) {
    await this.publisher.publish(channel, JSON.stringify(message));
  },

  subscribe(channel: string, handler: (message: any) => void) {
    this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, msg) => {
      if (ch === channel) {
        handler(JSON.parse(msg));
      }
    });
  },

  unsubscribe(channel: string) {
    this.subscriber.unsubscribe(channel);
  }
};
```

---

## 8. 🔧 Circuit Breaker (30 lines)

```typescript
export class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private maxFailures = 5,
    private timeout = 60000,
    private retryTimeout = 30000
  ) {}

  async execute<T>(operation: () => Promise<T>, fallback?: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime > this.retryTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        if (fallback) return await fallback();
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      if (fallback) return await fallback();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    this.lastFailTime = Date.now();
    if (this.failures >= this.maxFailures) {
      this.state = 'OPEN';
    }
  }
}
```

---

## 🚀 Express Middleware Templates

### Session Authentication Middleware
```typescript
export const requireAuth = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const session = await SessionManager.get(token);
  if (!session) return res.status(401).json({ error: 'Invalid session' });

  req.user = session;
  next();
};
```

### Cache Middleware
```typescript
export const cacheMiddleware = (ttl = 300) => async (req: any, res: any, next: any) => {
  const key = `${req.method}:${req.originalUrl}`;
  
  const cached = await Cache.get(key);
  if (cached) return res.json(cached);

  res.sendResponse = res.json;
  res.json = (body: any) => {
    Cache.set(key, body, ttl);
    res.sendResponse(body);
  };
  
  next();
};
```

### Rate Limit Middleware
```typescript
export const rateLimitMiddleware = (max: number, windowSec: number) => 
  async (req: any, res: any, next: any) => {
    const allowed = await RateLimit.check(req.ip, max, windowSec);
    if (!allowed) return res.status(429).json({ error: 'Rate limit exceeded' });
    next();
  };
```

---

## 📝 Usage Examples

### Complete API Endpoint
```typescript
import express from 'express';

const app = express();

// Leaderboard endpoint with auth, cache, and rate limiting
app.get('/api/leaderboard/:type', 
  requireAuth,
  rateLimitMiddleware(100, 60), // 100 requests per minute
  cacheMiddleware(300), // 5 minutes cache
  async (req, res) => {
    const { type } = req.params;
    const leaderboard = await Leaderboard.getTop(type, 10);
    res.json({ success: true, data: leaderboard });
  }
);

// Real-time notification system
app.post('/api/notify', requireAuth, async (req, res) => {
  const { userId, message } = req.body;
  await PubSub.publish('notifications', { userId, message });
  res.json({ success: true });
});

// Background job processing
app.post('/api/process-game', requireAuth, async (req, res) => {
  const { gameData } = req.body;
  await Queue.add('game-processing', gameData, 10); // High priority
  res.json({ success: true, message: 'Game queued for processing' });
});
```

---

## 🎯 Memory Tips

### The 5-Pattern Rule
1. **Session** = `setex` + `get` + `del`
2. **Cache** = `get` → miss → `setex`
3. **Rate Limit** = `incr` + `expire`
4. **Leaderboard** = `zadd` + `zrevrange` + `zrevrank`
5. **Queue** = `zadd` + `zpopmax`

### Command Shortcuts
```bash
# These 10 commands = 90% of Redis usage
SET/GET          # Basic key-value
SETEX/EXPIRE     # With expiration
INCR/DECR        # Counters
ZADD/ZRANGE      # Sorted sets
LPUSH/RPOP       # Lists
PUBLISH/SUBSCRIBE # Pub/Sub
```

### Pattern Recognition
- **Auth/Session** → Always use `SETEX` with TTL
- **Caching** → Always try `GET` first
- **Counting/Limiting** → Always use `INCR`
- **Rankings** → Always use `ZADD`/`ZRANGE`
- **Queues** → Always use `ZADD`/`ZPOP`

---

**🎯 Goal**: After 2 weeks, you should be able to write any of these 8 templates from memory. That's all you need to build 90% of Redis features!

**🚀 Next Step**: Pick one template per day, implement it in a small project, then move to the next. By day 8, you'll have a complete Redis toolkit in your head!
