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
      max: 10,
      validate: {
        validator: Number.isInteger,
        message: 'Mood score must be an integer between 1 and 10',
      },
    },
    noteId: {
      type: String,
      ref: 'Note',
    },
    tags: [{
      type: String,
      maxlength: 50,
    }],
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
)

// Indexes
moodLogSchema.index({ userId: 1, createdAt: -1 })

export const MoodLog = mongoose.model<IMoodLog>('MoodLog', moodLogSchema)