import OpenAI from 'openai'
import { getConfig } from '@/config.js'
import { redactPII, detectCrisisContent } from '@/utils/security.js'
import { logger } from '@/utils/logger.js'
import type { ChatStreamChunk } from '@/types'

const config = getConfig()

export class AIService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
    })
  }

  async generateResponse(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options?: {
      stream?: boolean
      model?: string
      maxTokens?: number
      temperature?: number
    }
  ): Promise<string | AsyncIterable<ChatStreamChunk>> {
    const {
      stream = false,
      model = 'gpt-3.5-turbo',
      maxTokens = 1000,
      temperature = 0.7,
    } = options || {}

    // Sanitize and check user messages for crisis content
    const processedMessages = messages.map(message => {
      if (message.role === 'user') {
        const hasCrisisContent = detectCrisisContent(message.content)
        if (hasCrisisContent) {
          logger.warn('Crisis content detected in user message', {
            messagePreview: message.content.substring(0, 100),
          })
          // Could trigger additional safety measures here
        }
        
        // Redact PII before sending to OpenAI
        return {
          ...message,
          content: redactPII(message.content),
        }
      }
      return message
    })

    try {
      const response = await this.openai.chat.completions.create({
        model,
        messages: processedMessages,
        max_tokens: maxTokens,
        temperature,
        stream,
      })

      if (stream) {
        return this.processStreamResponse(response as any)
      } else {
        const content = (response as any).choices[0]?.message?.content || ''
        return content
      }
    } catch (error) {
      logger.error('OpenAI API error:', error)
      throw new Error('Failed to generate AI response')
    }
  }

  private async* processStreamResponse(
    stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>
  ): AsyncIterable<ChatStreamChunk> {
    try {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        const done = chunk.choices[0]?.finish_reason !== null

        yield { content, done }
        
        if (done) break
      }
    } catch (error) {
      logger.error('Stream processing error:', error)
      yield { content: '', done: true }
    }
  }

  generateSuggestions(conversationContext: string[]): string[] {
    // Simple rule-based suggestions - could be enhanced with ML
    const suggestions = [
      "How are you feeling right now?",
      "What's been on your mind lately?",
      "Tell me about your day",
      "What's one thing you're grateful for?",
      "What would help you feel better?",
      "Can you describe what you're experiencing?",
    ]

    // Randomly select 3 suggestions
    return suggestions.sort(() => 0.5 - Math.random()).slice(0, 3)
  }
}

export const aiService = new AIService()