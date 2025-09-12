import { RateLimiterMemory } from 'rate-limiter-flexible'
import type { Request, Response, NextFunction } from 'express'
import { logger } from '@/utils/logger.js'

// Auth rate limiter - stricter limits
const authLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip,
  points: 5, // Number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 300, // Block for 5 minutes
})

// Chat rate limiter - moderate limits
const chatLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip,
  points: 30, // Number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 60, // Block for 1 minute
})

// General API rate limiter
const apiLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip,
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 60, // Block for 1 minute
})

function createRateLimitMiddleware(limiter: RateLimiterMemory) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await limiter.consume(req.ip)
      next()
    } catch (rejRes: any) {
      const remainingPoints = rejRes?.remainingPoints || 0
      const msBeforeNext = rejRes?.msBeforeNext || 0
      
      logger.warn(`Rate limit exceeded for IP ${req.ip}`, {
        remainingPoints,
        msBeforeNext,
        path: req.path,
      })

      res.set({
        'Retry-After': Math.round(msBeforeNext / 1000) || 60,
        'X-RateLimit-Limit': limiter.points,
        'X-RateLimit-Remaining': Math.max(0, remainingPoints),
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