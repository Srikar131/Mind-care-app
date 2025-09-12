import mongoose from 'mongoose'
import type { IMessage } from '@/types'

const messageSchema = new mongoose.Schema<IMessage>(
  {
    sessionId: {
      type: String,
      required: true,
      ref: 'Session',
    },
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'assistant'],
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

// Indexes
messageSchema.index({ sessionId: 1, createdAt: 1 })
messageSchema.index({ userId: 1, createdAt: -1 })

export const Message = mongoose.model<IMessage>('Message', messageSchema)