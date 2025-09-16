import dotenv from 'dotenv'

// Load environment variables first
dotenv.config()

import { z } from 'zod'

const configSchema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().min(1, 'MongoDB URI is required'),
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT refresh secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  OPENAI_API_KEY: z.string().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error']).default('info'),
  SEED_DEMO: z.string().transform(val => val === 'true').default('false'),
  EMAIL_FROM: z.string().email().optional(),
  EMAIL_SERVICE: z.string().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
})

export type Config = z.infer<typeof configSchema>

let config: Config

export function getConfig(): Config {
  if (!config) {
    config = configSchema.parse(process.env)
  }
  return config
}