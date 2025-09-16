import mongoose from 'mongoose'
import type { ISession } from '@/types'

const sessionSchema = new mongoose.Schema<ISession>(
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
    systemPrompt: {
      type: String,
      default: `You are a supportive, empathetic mental health companion. You provide emotional support using evidence-based techniques from Cognitive Behavioral Therapy (CBT) and Motivational Interviewing. 

Key guidelines:
- Be warm, non-judgmental, and supportive
- Ask open-ended questions to encourage reflection
- Validate emotions and experiences
- Offer practical coping strategies when appropriate
- Encourage professional help when needed
- Never diagnose or provide medical advice
- Be mindful of crisis indicators and direct to professional resources

Remember: You are a supportive companion, not a replacement for professional mental health care.`,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
sessionSchema.index({ userId: 1, createdAt: -1 })

export const Session = mongoose.model<ISession>('Session', sessionSchema)