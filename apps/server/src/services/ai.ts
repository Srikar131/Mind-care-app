import OpenAI from 'openai'
import { getConfig } from '@/config.js'
import { redactPII, detectCrisisContent } from '@/utils/security.js'
import { logger } from '@/utils/logger.js'
import type { ChatStreamChunk } from '@/types'

const config = getConfig()

export class AIService {
  private openai: OpenAI | null
  private mockMode: boolean

  constructor() {
    if (config.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: config.OPENAI_API_KEY,
      })
      this.mockMode = false
    } else {
      this.openai = null
      this.mockMode = true
      logger.info('OpenAI API key not provided, running in mock mode')
    }
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

    // If in mock mode, return mock responses
    if (this.mockMode) {
      return this.generateMockResponse(messages, { stream })
    }

    // Sanitize and check user messages for crisis content
    const processedMessages = messages.map(message => {
      if (message.role === 'user') {
        const hasCrisisContent = detectCrisisContent(message.content)
        if (hasCrisisContent) {
          logger.warn({
            messagePreview: message.content.substring(0, 100),
          }, 'Crisis content detected in user message')
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
      const response = await this.openai!.chat.completions.create({
        model,
        messages: processedMessages,
        max_tokens: maxTokens,
        temperature,
        stream,
      })

      if (stream) {
        return this.processStreamResponse(response as AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>)
      } else {
        const content = (response as OpenAI.Chat.Completions.ChatCompletion).choices[0]?.message?.content || ''
        return content
      }
    } catch (error) {
      logger.error({ error: error as Error }, 'OpenAI API error')
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
      logger.error({ error: error as Error }, 'Stream processing error')
      yield { content: '', done: true }
    }
  }

  private async generateMockResponse(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options: { stream?: boolean }
  ): Promise<string | AsyncIterable<ChatStreamChunk>> {
    // Get the last user message for context
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || ''
    
    const mockResponses = [
      "I understand you're going through a difficult time. It's important to remember that seeking help is a sign of strength, not weakness. How would you like to explore this feeling further?",
      "Thank you for sharing that with me. Your feelings are valid, and it's okay to experience them. What do you think might help you feel more supported right now?",
      "I hear you, and I want you to know that you're not alone in this. Many people experience similar challenges. What coping strategies have you tried before?",
      "It sounds like you're dealing with a lot right now. Sometimes it can help to take things one step at a time. What's one small thing you could do today to take care of yourself?",
      "Your awareness of your feelings shows great self-reflection. That's an important step in managing mental health. Would you like to talk about what might be contributing to these feelings?"
    ]

    // Simple keyword-based response selection for demo
    let response = mockResponses[Math.floor(Math.random() * mockResponses.length)]
    
    if (lastUserMessage.toLowerCase().includes('sad') || lastUserMessage.toLowerCase().includes('depressed')) {
      response = "I'm sorry you're feeling this way. Sadness is a natural human emotion, but when it persists, it's important to reach out for support. Have you considered speaking with a mental health professional?"
    } else if (lastUserMessage.toLowerCase().includes('anxious') || lastUserMessage.toLowerCase().includes('anxiety')) {
      response = "Anxiety can be overwhelming, but there are effective ways to manage it. Breathing exercises, grounding techniques, and talking through your worries can help. What triggers your anxiety most?"
    } else if (lastUserMessage.toLowerCase().includes('help') || lastUserMessage.toLowerCase().includes('support')) {
      response = "I'm here to support you. Remember that professional help is also available - therapists, counselors, and support groups can provide valuable assistance. Would you like me to help you explore some coping strategies?"
    }

    if (options.stream) {
      return this.generateMockStream(response)
    }

    return response
  }

  private async* generateMockStream(response: string): AsyncIterable<ChatStreamChunk> {
    const words = response.split(' ')
    
    for (let i = 0; i < words.length; i++) {
      const content = (i === 0 ? words[i] : ' ' + words[i])
      
      yield { content, done: false }
      
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100))
    }
    
    yield { content: '', done: true }
  }

  generateSuggestions(_conversationContext: string[]): string[] {
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