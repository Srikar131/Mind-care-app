import type { Request, Response, NextFunction } from 'express'
import { logger } from '@/utils/logger.js'

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error('Unhandled error:', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  })

  // Don't expose error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : error.message

  res.status(500).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  })
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    message: `Route ${req.method} ${req.path} not found`,
  })
}