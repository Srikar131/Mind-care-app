// Mental Health AI Service using Hugging Face
class MentalHealthAI {
  constructor() {
    // Replace 'YOUR_HF_TOKEN_HERE' with your actual Hugging Face token
    this.apiKey = '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'
    this.apiUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large'
    
    // Mental health context and personality
    this.systemPrompt = `You are a compassionate AI mental health companion named MindCare. You are:
- Empathetic, supportive, and non-judgmental
- Trained to provide mental health support and coping strategies
- Always encouraging and positive while acknowledging difficult feelings
- Focused on mental wellness, self-care, and emotional support
- Someone who listens actively and responds thoughtfully
- Able to suggest healthy coping mechanisms and self-care practices

Remember:
- Always be supportive and understanding
- Never provide medical diagnosis or replace professional therapy
- Encourage professional help when needed
- Focus on emotional support and practical coping strategies
- Use a warm, caring tone with appropriate emojis
- Keep responses helpful but concise (2-4 sentences)

Respond as a caring mental health companion would.`

    this.conversationHistory = []
  }

  // Clean and prepare user input
  prepareInput(userMessage) {
    // Add context for better mental health responses
    const mentalHealthContext = `As a mental health companion, please respond supportively to: "${userMessage}"`
    return mentalHealthContext
  }

  // Get thoughtful response from AI
  async getResponse(userMessage) {
    try {
      // Add user message to conversation history
      this.conversationHistory.push(`Human: ${userMessage}`)
      
      // Prepare the input with mental health context
      const contextualInput = this.prepareInput(userMessage)
      
      // Call Hugging Face API
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: contextualInput,
          parameters: {
            max_length: 150,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9,
            repetition_penalty: 1.1
          },
          options: {
            wait_for_model: true
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      
      // Extract and clean the response
      let aiResponse = data[0]?.generated_text || ''
      
      // Clean up the response
      aiResponse = this.cleanResponse(aiResponse, contextualInput)
      
      // Add AI response to conversation history
      this.conversationHistory.push(`MindCare: ${aiResponse}`)
      
      // Keep conversation history manageable (last 10 exchanges)
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20)
      }
      
      return aiResponse || this.getFallbackResponse(userMessage)
      
    } catch (error) {
      console.error('AI API Error:', error)
      return this.getFallbackResponse(userMessage)
    }
  }

  // Clean and improve the AI response
  cleanResponse(response, originalInput) {
    // Remove the input context from response
    let cleaned = response.replace(originalInput, '').trim()
    
    // Remove common AI artifacts
    cleaned = cleaned.replace(/^(AI:|Assistant:|MindCare:)/i, '').trim()
    cleaned = cleaned.replace(/Human:.*$/gm, '').trim()
    
    // Ensure it doesn't start with quotes
    cleaned = cleaned.replace(/^["']|["']$/g, '').trim()
    
    // Add supportive elements if response seems too clinical
    if (!cleaned.includes('😊') && !cleaned.includes('🌟') && !cleaned.includes('💙')) {
      if (Math.random() > 0.5) {
        cleaned += ' 😊'
      }
    }
    
    return cleaned
  }

  // Fallback responses when API fails
  getFallbackResponse(userMessage) {
    const supportiveResponses = [
      "I hear you, and I want you to know that your feelings are completely valid. It takes courage to share what you're going through. 💙",
      
      "Thank you for trusting me with your thoughts. Remember that you're not alone in this journey, and it's okay to have difficult days. 🌟",
      
      "I appreciate you opening up about this. Your mental health matters, and taking time to reflect on your feelings shows real strength. 😊",
      
      "That sounds really challenging to deal with. You're being incredibly brave by talking about it. What usually helps you feel a bit better when things get tough? 💙",
      
      "I can understand why that would be difficult. Remember, healing isn't linear, and it's completely normal to have ups and downs. You're doing better than you think. 🌱",
      
      "Thank you for sharing that with me. It's clear you're going through a lot right now. Have you been able to practice any self-care recently? Even small things can make a difference. ✨",
      
      "I want you to know that what you're feeling is valid, and you don't have to go through this alone. Sometimes just talking about our struggles can be the first step toward feeling better. 🤗",
      
      "That really resonates with me. Mental health challenges can feel overwhelming, but you're showing real courage by acknowledging them. What brings you comfort during difficult times? 💙"
    ]
    
    // Choose response based on user message content
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worry')) {
      return "I understand that anxiety can feel overwhelming. One thing that often helps is focusing on your breathing - try taking slow, deep breaths in through your nose and out through your mouth. You're stronger than your anxiety. 🌟"
    }
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('depression') || lowerMessage.includes('down')) {
      return "I hear that you're feeling down, and I want you to know that these feelings are temporary, even when they don't feel that way. You matter, and your feelings are valid. Have you been able to do anything small that usually brings you joy? 💙"
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed')) {
      return "Feeling stressed and overwhelmed is so common, especially these days. Remember that you don't have to handle everything at once. What's one small thing you could do today to take care of yourself? 🌱"
    }
    
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
      return "Sleep challenges can really affect how we feel during the day. Creating a calming bedtime routine and limiting screen time before bed can help. Your rest is important for your mental health. 😊"
    }
    
    // Default supportive response
    return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)]
  }

  // Reset conversation for new session
  resetConversation() {
    this.conversationHistory = []
  }
}

// Export the AI service
export default new MentalHealthAI()
