import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import pinoHttp from 'pino-http'

import { getConfig } from './config.js'
import { connectDB } from './utils/database.js'
import { logger } from './utils/logger.js'
import { apiRateLimit } from './middleware/rateLimiter.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

// Routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import chatRoutes from './routes/chat.js'
import notesRoutes from './routes/notes.js'
import moodRoutes from './routes/mood.js'

const config = getConfig()
const app = express()

// Request logging
app.use(pinoHttp({ logger }))

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Allow embedding for development
}))

app.use(cors({
  origin: config.CORS_ORIGIN.split(',').map(origin => origin.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Rate limiting
app.use('/api', apiRateLimit)

// Health check
app.get('/healthz', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/notes', notesRoutes)
app.use('/api/mood', moodRoutes)

// Legacy placeholder routes (remove after frontend is updated)
app.get('/api/chat/sessions', (_req, res) => {
  res.status(301).json({ message: 'Moved to /api/chat/sessions' })
})

// Error handling
app.use(notFound)
app.use(errorHandler)

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDB(config.MONGO_URI)

    // Start server
    app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`)
      logger.info(`Environment: ${config.NODE_ENV}`)
      logger.info(`CORS origin: ${config.CORS_ORIGIN}`)
    })
  } catch (error) {
    logger.error({ error: error as Error }, 'Failed to start server')
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  process.exit(0)
})

startServer()