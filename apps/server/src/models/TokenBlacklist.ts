import mongoose from 'mongoose'
import type { ITokenBlacklist } from '@/types'

const tokenBlacklistSchema = new mongoose.Schema<ITokenBlacklist>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    exp: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // Automatically remove expired tokens
    },
  },
  {
    timestamps: false,
  }
)

export const TokenBlacklist = mongoose.model<ITokenBlacklist>('TokenBlacklist', tokenBlacklistSchema)