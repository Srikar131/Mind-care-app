import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const chatMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(4000, 'Message too long'),
  sessionId: z.string().optional(),
})

export const createSessionSchema = z.object({
  title: z.string().min(1, 'Session title is required').max(200, 'Title too long'),
})

export const noteSchema = z.object({
  title: z.string().min(1, 'Note title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Note content is required'),
  mood: z.number().int().min(1).max(10).optional(),
  tags: z.array(z.string()).default([]),
})

export const updateNoteSchema = noteSchema.partial()

export const moodLogSchema = z.object({
  score: z.number().int().min(1).max(10),
  noteId: z.string().optional(),
  tags: z.array(z.string().max(50)).max(10).default([]),
  notes: z.string().max(500).optional(),
})

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  settings: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    notifications: z.boolean().optional(),
    language: z.string().optional(),
  }).optional(),
})