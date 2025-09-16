import mongoose from 'mongoose'
import type { INote } from '@/types'

const noteSchema = new mongoose.Schema<INote>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    mood: {
      type: Number,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Mood must be an integer between 1 and 5',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
noteSchema.index({ userId: 1, createdAt: -1 })
noteSchema.index({ userId: 1, tags: 1 })
noteSchema.index({ userId: 1, mood: 1 })

export const Note = mongoose.model<INote>('Note', noteSchema)