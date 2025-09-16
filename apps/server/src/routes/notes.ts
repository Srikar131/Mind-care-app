import { Router } from 'express'
import { Note } from '@/models/index.js'
import { authenticate, type AuthenticatedRequest } from '@/middleware/auth.js'
import { validate } from '@/middleware/validation.js'
import { logger } from '@/utils/logger.js'
import { z } from 'zod'

const router = Router()

// Validation schemas
const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  mood: z.number().min(1).max(10).optional(),
  tags: z.array(z.string().max(50)).max(20).default([]),
})

const updateNoteSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(10000).optional(),
  mood: z.number().min(1).max(10).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
})

// Get user notes
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = '1', limit = '20', search, tag, startDate, endDate } = req.query

    const pageNum = Math.max(1, parseInt(page as string))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)))
    const skip = (pageNum - 1) * limitNum

    // Build query
    const query: any = { userId: (req as any).user.userId }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    if (tag) {
      query.tags = { $in: [tag] }
    }

    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate as string)
      if (endDate) query.createdAt.$lte = new Date(endDate as string)
    }

    const [notes, total] = await Promise.all([
      Note.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Note.countDocuments(query)
    ])

    res.json({
      notes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    logger.error({ error: error as Error }, 'Get notes error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Create new note
router.post('/', authenticate, validate(createNoteSchema), async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body

    const note = new Note({
      userId: (req as any).user.userId,
      title,
      content,
      mood,
      tags: tags || [],
    })

    await note.save()

    res.status(201).json(note)
  } catch (error) {
    logger.error({ error: error as Error }, 'Create note error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get specific note
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params

    const note = await Note.findOne({ _id: id, userId: (req as any).user.userId })
    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    res.json(note)
  } catch (error) {
    logger.error({ error: error as Error }, 'Get note error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Update note
router.patch('/:id', authenticate, validate(updateNoteSchema), async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const note = await Note.findOneAndUpdate(
      { _id: id, userId: (req as any).user.userId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    )

    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    res.json(note)
  } catch (error) {
    logger.error({ error: error as Error }, 'Update note error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Delete note
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params

    const note = await Note.findOneAndDelete({ _id: id, userId: (req as any).user.userId })
    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    res.json({ message: 'Note deleted successfully' })
  } catch (error) {
    logger.error({ error: error as Error }, 'Delete note error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get note tags
router.get('/tags/all', authenticate, async (req, res) => {
  try {
    const tags = await Note.aggregate([
      { $match: { userId: (req as any).user.userId } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 }
    ])

    const tagList = tags.map(tag => ({
      name: tag._id,
      count: tag.count
    }))

    res.json(tagList)
  } catch (error) {
    logger.error({ error: error as Error }, 'Get tags error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Export notes (basic JSON export)
router.get('/export/json', authenticate, async (req, res) => {
  try {
    const notes = await Note.find({ userId: (req as any).user.userId })
      .sort({ createdAt: -1 })

    const exportData = {
      exportDate: new Date().toISOString(),
      totalNotes: notes.length,
      notes: notes.map(note => ({
        id: note._id,
        title: note.title,
        content: note.content,
        mood: note.mood,
        tags: note.tags,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      }))
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="mindcare-notes-${new Date().toISOString().split('T')[0]}.json"`)
    res.json(exportData)
  } catch (error) {
    logger.error({ error: error as Error }, 'Export notes error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get note statistics
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
    const [total, recentCount, moodStats] = await Promise.all([
      Note.countDocuments({ userId: (req as any).user.userId }),
      Note.countDocuments({
        userId: (req as any).user.userId,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      Note.aggregate([
        { $match: { userId: (req as any).user.userId, mood: { $exists: true } } },
        { $group: { _id: null, avgMood: { $avg: '$mood' }, count: { $sum: 1 } } }
      ])
    ])

    res.json({
      totalNotes: total,
      recentNotes: recentCount,
      averageMood: moodStats[0]?.avgMood || null,
      notesWithMood: moodStats[0]?.count || 0
    })
  } catch (error) {
    logger.error({ error: error as Error }, 'Get note stats error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router