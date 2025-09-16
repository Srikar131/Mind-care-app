import mongoose from 'mongoose'
import type { IUser } from '@/types'

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    roles: {
      type: [String],
      default: ['user'],
      enum: ['user', 'therapist', 'admin'],
    },
    settings: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      language: {
        type: String,
        default: 'en',
      },
    },
  },
  {
    timestamps: true,
  }
)

// Index for email lookup
userSchema.index({ email: 1 })

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.passwordHash
  return user
}

export const User = mongoose.model<IUser>('User', userSchema)