import { RateLimiterMemory } from 'rate-limiter-flexible'
import type { Request, Response, NextFunction } from 'express'
import { logger } from '@/utils/logger.js'

// Auth rate limiter - stricter limits
const authLimiter = new RateLimiterMemory({
  points: 5, // Number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 300, // Block for 5 minutes
})

// Chat rate limiter - moderate limits
const chatLimiter = new RateLimiterMemory({
  points: 30, // Number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 60, // Block for 1 minute
})

// General API rate limiter
const apiLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 60, // Block for 1 minute
})

function createRateLimitMiddleware(limiter: RateLimiterMemory) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clientKey = req.ip || req.connection.remoteAddress || 'unknown'
      await limiter.consume(clientKey)
      next()
    } catch (rejRes: unknown) {
      const remainingPoints = (rejRes as any)?.remainingPoints || 0
      const msBeforeNext = (rejRes as any)?.msBeforeNext || 0
      
      logger.warn({
        remainingPoints,
        msBeforeNext,
        path: req.path,
      }, `Rate limit exceeded for IP ${req.ip || 'unknown'}`)

      res.set({
        'Retry-After': Math.round(msBeforeNext / 1000) || 60,
        'X-RateLimit-Limit': limiter.points.toString(),
        'X-RateLimit-Remaining': Math.max(0, remainingPoints).toString(),
        'X-RateLimit-Reset': new Date(Date.now() + msBeforeNext).toISOString(),
      })

      res.status(429).json({
        message: 'Too many requests, please try again later',
        retryAfter: Math.round(msBeforeNext / 1000) || 60,
      })
    }
  }
}

export const authRateLimit = createRateLimitMiddleware(authLimiter)
export const chatRateLimit = createRateLimitMiddleware(chatLimiter)
export const apiRateLimit = createRateLimitMiddleware(apiLimiter)