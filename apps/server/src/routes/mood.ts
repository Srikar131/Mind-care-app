import { Router } from 'express'
import { MoodLog } from '@/models/index.js'
import { authenticate, type AuthenticatedRequest } from '@/middleware/auth.js'
import { validate } from '@/middleware/validation.js'
import { logger } from '@/utils/logger.js'
import { z } from 'zod'

const router = Router()

// Validation schemas
const logMoodSchema = z.object({
  score: z.number().min(1).max(10),
  noteId: z.string().optional(),
  tags: z.array(z.string().max(50)).max(10).default([]),
  notes: z.string().max(500).optional(),
})

// Log mood entry
router.post('/', authenticate, validate(logMoodSchema), async (req, res) => {
  try {
    const { score, noteId, tags, notes } = req.body

    const moodLog = new MoodLog({
      userId: (req as any).user.userId,
      score,
      noteId,
      tags: tags || [],
      notes,
    })

    await moodLog.save()

    res.status(201).json(moodLog)
  } catch (error) {
    logger.error({ error: error as Error }, 'Log mood error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get mood logs
router.get('/', authenticate, async (req, res) => {
  try {
    const { 
      page = '1', 
      limit = '30', 
      startDate, 
      endDate, 
      minScore, 
      maxScore 
    } = req.query

    const pageNum = Math.max(1, parseInt(page as string))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)))
    const skip = (pageNum - 1) * limitNum

    // Build query
    const query: any = { userId: (req as any).user.userId }

    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate as string)
      if (endDate) query.createdAt.$lte = new Date(endDate as string)
    }

    if (minScore) query.score = { ...query.score, $gte: parseInt(minScore as string) }
    if (maxScore) query.score = { ...query.score, $lte: parseInt(maxScore as string) }

    const [moodLogs, total] = await Promise.all([
      MoodLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('noteId', 'title'),
      MoodLog.countDocuments(query)
    ])

    res.json({
      moodLogs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    logger.error({ error: error as Error }, 'Get mood logs error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get mood statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const { period = '30' } = req.query
    const days = Math.min(365, Math.max(1, parseInt(period as string)))
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const [overview, trends, distribution] = await Promise.all([
      // Overall statistics
      MoodLog.aggregate([
        { $match: { userId: (req as any).user.userId, createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            averageMood: { $avg: '$score' },
            highestMood: { $max: '$score' },
            lowestMood: { $min: '$score' },
            totalEntries: { $sum: 1 }
          }
        }
      ]),

      // Daily trends
      MoodLog.aggregate([
        { $match: { userId: (req as any).user.userId, createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            averageMood: { $avg: '$score' },
            entryCount: { $sum: 1 },
            date: { $first: '$createdAt' }
          }
        },
        { $sort: { 'date': 1 } }
      ]),

      // Score distribution
      MoodLog.aggregate([
        { $match: { userId: (req as any).user.userId, createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: '$score',
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ])

    // Weekly averages
    const weeklyTrends = await MoodLog.aggregate([
      { $match: { userId: (req as any).user.userId, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            week: { $week: '$createdAt' }
          },
          averageMood: { $avg: '$score' },
          entryCount: { $sum: 1 },
          weekStart: {
            $min: {
              $dateFromParts: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $subtract: [{ $dayOfMonth: '$createdAt' }, { $dayOfWeek: '$createdAt' }] }
              }
            }
          }
        }
      },
      { $sort: { 'weekStart': 1 } }
    ])

    const stats = {
      overview: overview[0] || {
        averageMood: null,
        highestMood: null,
        lowestMood: null,
        totalEntries: 0
      },
      dailyTrends: trends.map(trend => ({
        date: trend.date,
        averageMood: Math.round(trend.averageMood * 100) / 100,
        entryCount: trend.entryCount
      })),
      weeklyTrends: weeklyTrends.map(trend => ({
        weekStart: trend.weekStart,
        averageMood: Math.round(trend.averageMood * 100) / 100,
        entryCount: trend.entryCount
      })),
      distribution: distribution.reduce((acc, item) => {
        acc[item._id] = item.count
        return acc
      }, {} as Record<number, number>),
      period: days
    }

    res.json(stats)
  } catch (error) {
    logger.error({ error: error as Error }, 'Get mood stats error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get mood insights
router.get('/insights', authenticate, async (req, res) => {
  try {
    const { days = '30' } = req.query
    const period = Math.min(365, Math.max(7, parseInt(days as string)))
    const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000)

    const moodLogs = await MoodLog.find({
      userId: (req as any).user.userId,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 })

    if (moodLogs.length === 0) {
      return res.json({
        insights: [],
        summary: 'Not enough data to generate insights. Try logging your mood regularly!'
      })
    }

    const insights = []
    const scores = moodLogs.map(log => log.score)
    const average = scores.reduce((a, b) => a + b, 0) / scores.length

    // Average mood insight
    if (average >= 7) {
      insights.push({
        type: 'positive',
        title: 'Great Mood Trend!',
        message: `Your average mood over the last ${period} days has been excellent (${average.toFixed(1)}/10). Keep up the great work!`,
        icon: '😊'
      })
    } else if (average >= 5) {
      insights.push({
        type: 'neutral',
        title: 'Steady Progress',
        message: `Your average mood has been stable at ${average.toFixed(1)}/10. Consider what activities or practices help boost your mood.`,
        icon: '😐'
      })
    } else {
      insights.push({
        type: 'concern',
        title: 'Mood Support',
        message: `Your average mood has been below 5 (${average.toFixed(1)}/10). Consider reaching out to a mental health professional for support.`,
        icon: '💙'
      })
    }

    // Trend analysis
    if (moodLogs.length >= 7) {
      const recent = scores.slice(-7).reduce((a, b) => a + b, 0) / 7
      const previous = scores.slice(-14, -7).reduce((a, b) => a + b, 0) / 7

      if (recent > previous + 0.5) {
        insights.push({
          type: 'positive',
          title: 'Improving Trend',
          message: 'Your mood has been trending upward this week. Great progress!',
          icon: '📈'
        })
      } else if (previous > recent + 0.5) {
        insights.push({
          type: 'concern',
          title: 'Declining Trend',
          message: 'Your mood has been lower this week. Consider self-care activities or reaching out for support.',
          icon: '📉'
        })
      }
    }

    // Consistency insight
    const variance = scores.reduce((acc, score) => acc + Math.pow(score - average, 2), 0) / scores.length
    if (variance < 1) {
      insights.push({
        type: 'neutral',
        title: 'Consistent Mood',
        message: 'Your mood has been relatively stable. Consistency can be a sign of good emotional regulation.',
        icon: '⚖️'
      })
    } else if (variance > 4) {
      insights.push({
        type: 'neutral',
        title: 'Mood Variability',
        message: 'Your mood has varied quite a bit. This is normal, but tracking patterns might help identify triggers.',
        icon: '🎢'
      })
    }

    res.json({
      insights,
      summary: `Based on ${moodLogs.length} mood entries over ${period} days.`,
      averageMood: Math.round(average * 100) / 100,
      totalEntries: moodLogs.length
    })
  } catch (error) {
    logger.error({ error: error as Error }, 'Get mood insights error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Update mood log
router.patch('/:id', authenticate, validate(logMoodSchema.partial()), async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const moodLog = await MoodLog.findOneAndUpdate(
      { _id: id, userId: (req as any).user.userId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    )

    if (!moodLog) {
      return res.status(404).json({ message: 'Mood log not found' })
    }

    res.json(moodLog)
  } catch (error) {
    logger.error({ error: error as Error }, 'Update mood log error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Delete mood log
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params

    const moodLog = await MoodLog.findOneAndDelete({ _id: id, userId: (req as any).user.userId })
    if (!moodLog) {
      return res.status(404).json({ message: 'Mood log not found' })
    }

    res.json({ message: 'Mood log deleted successfully' })
  } catch (error) {
    logger.error({ error: error as Error }, 'Delete mood log error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router