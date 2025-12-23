import { Router } from 'express'
import { Session, Message } from '@/models/index.js'
import { authenticate, type AuthenticatedRequest } from '@/middleware/auth.js'
import { validate } from '@/middleware/validation.js'
import { chatRateLimit } from '@/middleware/rateLimiter.js'
import { aiService } from '@/services/ai.js'
import { logger } from '@/utils/logger.js'
import { z } from 'zod'

const router = Router()

// Validation schemas
const sendMessageSchema = z.object({
  sessionId: z.string().optional(),
  message: z.string().min(1).max(4000),
})

const createSessionSchema = z.object({
  title: z.string().min(1).max(200).optional(),
})

// System prompt for the AI
const SYSTEM_PROMPT = `You are a compassionate AI assistant trained to provide supportive mental health conversations. 

Guidelines:
- Be empathetic, understanding, and non-judgmental
- Use evidence-based therapeutic techniques like CBT when appropriate
- Encourage professional help for serious mental health concerns
- Never diagnose or prescribe medication
- Maintain appropriate boundaries
- If someone expresses suicidal thoughts or intentions, immediately provide crisis resources

Crisis Resources:
- Emergency: 911
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741

Remember: You are here to support, not replace professional mental healthcare.`

// Get user chat sessions
router.get('/sessions', authenticate, async (req, res) => {
  const authReq = req as AuthenticatedRequest
  try {
    const sessions = await Session.find({ userId: authReq.user.userId })
      .sort({ updatedAt: -1 })
      .limit(50)

    res.json(sessions)
  } catch (error) {
    logger.error({ error: error as Error }, 'Get sessions error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Create new chat session
router.post('/sessions', authenticate, validate(createSessionSchema), async (req, res) => {
  try {
    const { title } = req.body

    const session = new Session({
      userId: (req as any).user.userId,
      title: title || `Chat ${new Date().toLocaleDateString()}`,
      systemPrompt: SYSTEM_PROMPT,
    })

    await session.save()

    res.status(201).json(session)
  } catch (error) {
    logger.error({ error: error as Error }, 'Create session error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get messages for a session
router.get('/sessions/:sessionId/messages', authenticate, async (req, res) => {
  try {
    const { sessionId } = req.params

    // Verify session belongs to user
    const session = await Session.findOne({ _id: sessionId, userId: (req as any).user.userId })
    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    const messages = await Message.find({ sessionId })
      .sort({ createdAt: 1 })
      .limit(100)

    res.json(messages)
  } catch (error) {
    logger.error({ error: error as Error }, 'Get messages error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Send message to AI
router.post('/send', authenticate, chatRateLimit, validate(sendMessageSchema), async (req, res) => {
  try {
    const { sessionId, message } = req.body

    let session: any
    if (sessionId) {
      // Use existing session
      session = await Session.findOne({ _id: sessionId, userId: (req as any).user.userId })
      if (!session) {
        return res.status(404).json({ message: 'Session not found' })
      }
    } else {
      // Create new session
      session = new Session({
        userId: (req as any).user.userId,
        title: message.length > 50 ? message.substring(0, 50) + '...' : message,
        systemPrompt: SYSTEM_PROMPT,
      })
      await session.save()
    }

    // Save user message
    const userMessage = new Message({
      sessionId: session._id,
      userId: (req as any).user.userId,
      role: 'user',
      content: message,
    })
    await userMessage.save()

    // Get conversation history
    const messages = await Message.find({ sessionId: session._id })
      .sort({ createdAt: 1 })
      .limit(20)

    // Prepare messages for AI
    const aiMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ]

    // Generate AI response
    const aiResponse = await aiService.generateResponse(aiMessages, {
      stream: false,
      maxTokens: 800,
      temperature: 0.7
    })

    if (typeof aiResponse !== 'string') {
      throw new Error('Expected string response from AI service')
    }

    // Save AI response
    const assistantMessage = new Message({
      sessionId: session._id,
      userId: (req as any).user.userId,
      role: 'assistant',
      content: aiResponse,
    })
    await assistantMessage.save()

    // Update session timestamp
    session.updatedAt = new Date()
    await session.save()

    res.json({
      sessionId: session._id,
      userMessage,
      assistantMessage,
      suggestions: aiService.generateSuggestions([message])
    })
  } catch (error) {
    logger.error({ error: error as Error }, 'Send message error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Stream chat response (SSE)
router.get('/stream/:sessionId', authenticate, async (req, res) => {
  try {
    const { sessionId } = req.params

    // Verify session belongs to user
    const session = await Session.findOne({ _id: sessionId, userId: (req as any).user.userId })
    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    })

    // Send initial connection
    res.write('data: {"type": "connected"}\n\n')

    // Keep connection alive
    const keepAlive = setInterval(() => {
      res.write('data: {"type": "ping"}\n\n')
    }, 30000)

    // Cleanup on client disconnect
    req.on('close', () => {
      clearInterval(keepAlive)
      res.end()
    })

  } catch (error) {
    logger.error({ error: error as Error }, 'Stream setup error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Delete session
router.delete('/sessions/:sessionId', authenticate, async (req, res) => {
  try {
    const { sessionId } = req.params

    // Delete session and associated messages
    const session = await Session.findOneAndDelete({ _id: sessionId, userId: (req as any).user.userId })
    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    await Message.deleteMany({ sessionId })

    res.json({ message: 'Session deleted successfully' })
  } catch (error) {
    logger.error({ error: error as Error }, 'Delete session error')
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router