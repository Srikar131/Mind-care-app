import { useState, useRef, useEffect } from 'react'
import aiService from './aiService.js'

function ChatPage({ onBack }) {
  // State for storing all chat messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI companion. I'm here to listen and support you. How are you feeling today? 😊",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  
  // State for the current input text
  const [inputText, setInputText] = useState('')
  
  // State to show loading animation when AI is "thinking"
  const [isLoading, setIsLoading] = useState(false)
  
  // Reference to scroll to bottom of messages
  const messagesEndRef = useRef(null)

  // Function to automatically scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Scroll to bottom whenever new messages are added
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Function to send a message with REAL AI
  const sendMessage = async () => {
    // Don't send if input is empty or AI is still responding
    if (!inputText.trim() || isLoading) return

    // Create user message object
    const userMessage = {
      id: Date.now(), // Unique ID using timestamp
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    // Add user message to the chat
    setMessages(prev => [...prev, userMessage])
    
    // Store the user input before clearing
    const userInput = inputText
    
    // Clear the input field
    setInputText('')
    
    // Show loading animation
    setIsLoading(true)

    // Get REAL AI response
    try {
      // Get real AI response
      const aiResponse = await aiService.getResponse(userInput)
      
      // Create AI message object
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }

      // Add AI response to chat
      setMessages(prev => [...prev, aiMessage])
      
    } catch (error) {
      console.error('Chat error:', error)
      
      // Fallback message if AI fails
      const fallbackMessage = {
        id: Date.now() + 1,
        text: "I'm having a little trouble connecting right now, but I'm here to listen. Can you tell me more about how you're feeling? 💙",
        sender: 'ai',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      // Hide loading animation
      setIsLoading(false)
    }
  }

  // Handle Enter key press to send message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // Prevent new line
      sendMessage()
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* TOP HEADER */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {/* Back Button */}
          <button 
            onClick={onBack}
            style={{
              background: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#6b7280',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#f9fafb'
              e.target.style.borderColor = '#d1d5db'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent'
              e.target.style.borderColor = '#e5e7eb'
            }}
          >
            ← Back to Dashboard
          </button>
          
          {/* Title */}
          <div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: 0,
              color: '#1f2937',
              letterSpacing: '-0.01em'
            }}>
              AI Companion 🤖
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              Your supportive mental health companion • Powered by AI
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CHAT CONTAINER */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        height: 'calc(100vh - 180px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* MESSAGES AREA */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          background: 'white',
          borderRadius: '16px 16px 4px 4px',
          border: '1px solid #f3f4f6',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          marginBottom: '1rem'
        }}>
          
          {/* Render each message */}
          {messages.map((message) => (
            <div key={message.id} style={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                maxWidth: '75%',
                padding: '1rem 1.25rem',
                borderRadius: message.sender === 'user' 
                  ? '20px 20px 4px 20px'   // User: rounded except bottom-right
                  : '20px 20px 20px 4px',  // AI: rounded except bottom-left
                background: message.sender === 'user' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : '#f9fafb',
                color: message.sender === 'user' ? 'white' : '#1f2937',
                boxShadow: message.sender === 'user' 
                  ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                  : '0 2px 8px rgba(0, 0, 0, 0.05)',
                position: 'relative'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '15px',
                  lineHeight: '1.5',
                  fontWeight: '400'
                }}>
                  {message.text}
                </p>
                <div style={{
                  fontSize: '11px',
                  marginTop: '0.5rem',
                  opacity: 0.7,
                  textAlign: message.sender === 'user' ? 'right' : 'left'
                }}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {/* LOADING ANIMATION (AI is thinking) */}
          {isLoading && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-start', 
              marginBottom: '1.5rem' 
            }}>
              <div style={{
                padding: '1rem 1.25rem',
                borderRadius: '20px 20px 20px 4px',
                background: '#f9fafb',
                color: '#6b7280',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '6px', 
                  alignItems: 'center' 
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#6b7280',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#6b7280',
                    animation: 'pulse 1.5s ease-in-out infinite 0.2s'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#6b7280',
                    animation: 'pulse 1.5s ease-in-out infinite 0.4s'
                  }}></div>
                </div>
                <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
                  AI is thinking...
                </div>
              </div>
            </div>
          )}
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          background: 'white',
          padding: '1.25rem',
          borderRadius: '4px 4px 16px 16px',
          border: '1px solid #f3f4f6',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          
          {/* Text Input */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts and feelings... Press Enter to send 💭"
            disabled={isLoading}
            style={{
              flex: 1,
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              resize: 'none',
              minHeight: '44px',
              maxHeight: '120px',
              fontFamily: 'inherit',
              lineHeight: '1.5',
              background: isLoading ? '#f9fafb' : 'white',
              color: isLoading ? '#9ca3af' : '#1f2937'
            }}
            rows="1"
          />
          
          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            style={{
              background: (!inputText.trim() || isLoading) 
                ? '#e5e7eb' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: (!inputText.trim() || isLoading) ? 'not-allowed' : 'pointer',
              minWidth: '90px',
              transition: 'all 0.2s',
              boxShadow: (!inputText.trim() || isLoading) 
                ? 'none' 
                : '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}
            onMouseOver={(e) => {
              if (!(!inputText.trim() || isLoading)) {
                e.target.style.transform = 'translateY(-1px)'
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)'
              }
            }}
            onMouseOut={(e) => {
              if (!(!inputText.trim() || isLoading)) {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)'
              }
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              </div>
            ) : (
              'Send 🚀'
            )}
          </button>
        </div>
      </div>

      {/* CSS ANIMATIONS */}
      <style>
        {`
          @keyframes pulse {
            0%, 80%, 100% { 
              opacity: 0.3; 
              transform: scale(0.9);
            }
            40% { 
              opacity: 1; 
              transform: scale(1);
            }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default ChatPage
