import mongoose from 'mongoose'
import { logger } from './logger.js'

export async function connectDB(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri)
    logger.info('Connected to MongoDB')
  } catch (error) {
    logger.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect()
    logger.info('Disconnected from MongoDB')
  } catch (error) {
    logger.error('MongoDB disconnection error:', error)
  }
}