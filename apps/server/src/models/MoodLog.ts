import mongoose from 'mongoose'
import type { IMoodLog } from '@/types'

const moodLogSchema = new mongoose.Schema<IMoodLog>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Mood score must be an integer between 1 and 5',
      },
    },
    noteId: {
      type: String,
      ref: 'Note',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

// Indexes
moodLogSchema.index({ userId: 1, createdAt: -1 })

export const MoodLog = mongoose.model<IMoodLog>('MoodLog', moodLogSchema)