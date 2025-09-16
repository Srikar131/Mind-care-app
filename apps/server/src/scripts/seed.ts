import dotenv from 'dotenv'
import { connectDB, disconnectDB } from '../utils/database.js'
import { User } from '../models/index.js'
import { hashPassword } from '../utils/crypto.js'
import { logger } from '../utils/logger.js'
import { getConfig } from '../config.js'

dotenv.config()

async function seed() {
  try {
    const config = getConfig()
    
    if (!config.SEED_DEMO) {
      logger.info('Demo seeding disabled')
      return
    }

    await connectDB(config.MONGO_URI)
    logger.info('Connected to database for seeding')

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@mindcare.app' })
    if (existingUser) {
      logger.info('Demo user already exists, skipping seed')
      return
    }

    // Create demo user
    const demoUser = new User({
      email: 'demo@mindcare.app',
      name: 'Demo User',
      passwordHash: await hashPassword('demo123456'),
      roles: ['user'],
      settings: {
        theme: 'system',
        notifications: true,
        language: 'en',
      },
    })

    await demoUser.save()
    logger.info('Demo user created successfully', {
      email: demoUser.email,
      name: demoUser.name,
    })

    logger.info('Seeding completed successfully')
  } catch (error) {
    logger.error('Seeding failed:', error)
    process.exit(1)
  } finally {
    await disconnectDB()
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
}