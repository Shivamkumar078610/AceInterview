import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Initialize Redis client
let redis: Redis

try {
  redis = Redis.fromEnv()
} catch {
  // Fallback for development without Redis configured
  console.warn('Redis not configured. Rate limiting disabled.')
  redis = new Redis({
    url: 'https://localhost',
    token: 'local',
  })
}

export { redis }

// Rate limiters for different endpoints
export const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'),
  analytics: true,
  prefix: 'rl:auth',
})

export const aiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '60 s'),
  analytics: true,
  prefix: 'rl:ai',
})

export const apiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '60 s'),
  analytics: true,
  prefix: 'rl:api',
})

export async function getCached<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds = 300
): Promise<T> {
  try {
    const cached = await redis.get<T>(key)
    if (cached !== null) return cached
    const fresh = await fn()
    await redis.setex(key, ttlSeconds, JSON.stringify(fresh))
    return fresh
  } catch {
    // If Redis fails, just call the function directly
    return fn()
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch {
    // Ignore cache errors
  }
}

export async function setSession(sessionId: string, data: unknown, ttl = 3600): Promise<void> {
  await redis.setex(`session:${sessionId}`, ttl, JSON.stringify(data))
}

export async function getSession<T>(sessionId: string): Promise<T | null> {
  try {
    return await redis.get<T>(`session:${sessionId}`)
  } catch {
    return null
  }
}
