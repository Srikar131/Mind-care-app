import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '@/utils/jwt.js'
import { TokenBlacklist, User } from '@/models/index.js'
import { logger } from '@/utils/logger.js'

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string
    email: string
    roles: string[]
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authorization token required' })
      return
    }

    const token = authHeader.substring(7)

    // Check if token is blacklisted
    const blacklistedToken = await TokenBlacklist.findOne({ token })
    if (blacklistedToken) {
      res.status(401).json({ message: 'Token has been invalidated' })
      return
    }

    const payload = verifyAccessToken(token)
    
    // Verify user still exists
    const user = await User.findById(payload.userId)
    if (!user) {
      res.status(401).json({ message: 'User not found' })
      return
    }

    ;(req as AuthenticatedRequest).user = {
      userId: payload.userId,
      email: payload.email,
      roles: payload.roles,
    }

    next()
  } catch (error) {
    logger.error('Authentication error:', error)
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest
    
    if (!authReq.user) {
      res.status(401).json({ message: 'Authentication required' })
      return
    }

    const hasRole = roles.some(role => authReq.user.roles.includes(role))
    if (!hasRole) {
      res.status(403).json({ message: 'Insufficient permissions' })
      return
    }

    next()
  }
}