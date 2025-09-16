import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { logger } from '@/utils/logger.js'

export function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = {
        ...req.body,
        ...req.query,
        ...req.params,
      }

      const result = schema.safeParse(data)
      
      if (!result.success) {
        const errors = result.error.errors.reduce((acc, error) => {
          const path = error.path.join('.')
          if (!acc[path]) acc[path] = []
          acc[path].push(error.message)
          return acc
        }, {} as Record<string, string[]>)

        logger.warn({ errors, path: req.path }, 'Validation error')
        
        res.status(400).json({
          message: 'Validation error',
          errors,
        })
        return
      }

      // Replace request data with validated data
      Object.assign(req.body, result.data)
      next()
    } catch (error) {
      logger.error({ error: error as Error }, 'Validation middleware error')
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}