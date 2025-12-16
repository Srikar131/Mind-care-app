import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ChatPage from './ChatPage.jsx'
import JournalPage from './JournalPage.jsx'
import AnalyticsPage from './AnalyticsPage.jsx'
import ProductivityPage from './ProductivityPage.jsx'

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      if (email === 'demo@mindcare.app' && password === 'demo123') {
        await new Promise(resolve => setTimeout(resolve, 1000))
        onLogin()
      } else {
        setError('Please use: demo@mindcare.app / demo123')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Floating Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: '150px',
        height: '150px',
        borderRadius: '30px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(15px)',
        animation: 'float 8s ease-in-out infinite reverse',
        transform: 'rotate(45deg)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        animation: 'float 7s ease-in-out infinite'
      }} />

      <div style={{
        maxWidth: '420px',
        width: '100%',
        padding: '2.5rem',
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: '700',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
            animation: 'pulse 3s ease-in-out infinite'
          }}>
            M
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 0.5rem', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            Welcome to MindCare
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', margin: 0, fontWeight: '500' }}>
            Your complete mental health & productivity companion
          </p>
        </div>
        
        {error && (
          <div style={{
            padding: '1rem',
            marginBottom: '1rem',
            background: 'rgba(239, 68, 68, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            borderRadius: '12px',
            color: '#fee2e2',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '0.75rem', color: 'white' }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                fontSize: '15px',
                color: 'white',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '0.75rem', color: 'white' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                fontSize: '15px',
                color: 'white',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading ? 'rgba(156, 163, 175, 0.8)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <strong style={{ color: 'white' }}>Demo Account:</strong><br/>
          Email: demo@mindcare.app<br/>
          Password: demo123
        </div>
      </div>

      <style>
        {`
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          input::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
          }
        `}
      </style>
    </div>
  )
}

function DashboardPage({ onLogout, onNavigate }) {
  const currentTime = new Date().getHours()
  const greeting = currentTime < 12 ? 'Good morning' : currentTime < 17 ? 'Good afternoon' : 'Good evening'
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%, #f8fafc 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 20s ease infinite',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative'
    }}>

      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        top: '5%',
        right: '10%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)',
        filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '5%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.15) 0%, rgba(0, 242, 254, 0.15) 100%)',
        filter: 'blur(30px)',
        animation: 'float 10s ease-in-out infinite reverse'
      }} />

      {/* Header with Glass Effect */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              animation: 'pulse 4s ease-in-out infinite'
            }}>
              M
            </div>
            <h1 style={{ 
              color: '#1f2937', 
              margin: 0, 
              fontSize: '20px',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              textShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              MindCare
            </h1>
          </div>
          
          <button 
            onClick={onLogout}
            style={{
              padding: '10px 20px',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              color: '#6b7280',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              letterSpacing: '-0.01em',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '3rem 2rem',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Welcome Section with Creative Typography */}
        <div style={{ 
          marginBottom: '4rem',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: '42px', 
            fontWeight: '800', 
            margin: '0 0 0.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em',
            textShadow: '0 4px 20px rgba(102, 126, 234, 0.2)'
          }}>
            {greeting} 🌟
          </h2>
          <p style={{ 
            fontSize: '18px', 
            color: '#6b7280',
            fontWeight: '500',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Your complete mental health & productivity platform
          </p>
        </div>

        {/* Floating Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {[
            { label: 'Streak', value: '7', unit: 'days', color: '#3b82f6', emoji: '🔥' },
            { label: 'Today', value: 'Great', unit: 'mood', color: '#10b981', emoji: '😊' },
            { label: 'Entries', value: '12', unit: 'written', color: '#8b5cf6', emoji: '📝' },
            { label: 'Sessions', value: '5', unit: 'chats', color: '#f59e0b', emoji: '💬' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '140px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ 
                fontSize: '40px', 
                marginBottom: '0.75rem',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
                position: 'relative',
                zIndex: 2
              }}>
                {stat.emoji}
              </div>
              <div style={{ 
                fontSize: '28px', 
                fontWeight: '800', 
                color: '#1f2937',
                marginBottom: '0.5rem',
                letterSpacing: '-0.02em',
                position: 'relative',
                zIndex: 2
              }}>
                {stat.value}
              </div>
              <div style={{ 
                fontSize: '13px', 
                color: '#6b7280',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                position: 'relative',
                zIndex: 2
              }}>
                {stat.label}
              </div>
              <div style={{ 
                width: '40px',
                height: '3px',
                background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                marginTop: '1rem',
                borderRadius: '2px',
                position: 'relative',
                zIndex: 2
              }} />
            </div>
          ))}
        </div>

        {/* Creative Feature Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', 
          gap: '2.5rem'
        }}>
          {[
            { 
              title: 'AI Companion', 
              description: 'Thoughtful conversations powered by advanced AI technology',
              action: 'Start conversation',
              gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              icon: '🤖',
              onClick: () => onNavigate('chat')
            },
            { 
              title: 'Digital Journal', 
              description: 'Private space for reflection and personal growth',
              action: 'New entry',
              gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              icon: '📖',
              onClick: () => onNavigate('journal')
            },
            { 
              title: 'Analytics & Insights', 
              description: 'Understanding patterns in your mental wellness journey',
              action: 'View analytics',
              gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              icon: '📊',
              onClick: () => onNavigate('analytics')
            },
            { 
              title: 'Productivity Hub', 
              description: 'Manage tasks, important dates, and goals for better wellness',
              action: 'Organize life',
              gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              icon: '🎯',
              onClick: () => onNavigate('productivity')
            },
            { 
              title: 'Meditation & Breathing', 
              description: 'Guided mindfulness exercises and breathing techniques',
              action: 'Start session',
              gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              icon: '🧘‍♀️',
              onClick: () => alert('Meditation feature coming soon! 🧘‍♀️✨')
            },
            { 
              title: 'Community Support', 
              description: 'Connect with others on their mental health journey',
              action: 'Join community',
              gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              icon: '🤝',
              onClick: () => alert('Community feature coming soon! 🤝✨')
            }
          ].map((feature, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '0',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}>
              
              {/* Animated Gradient Header */}
              <div style={{
                height: '6px',
                background: feature.gradient,
                backgroundSize: '200% 200%',
                animation: 'gradientShift 4s ease infinite'
              }} />
              
              <div style={{ padding: '2.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '1.5rem' 
                }}>
                  <div style={{
                    fontSize: '40px',
                    marginRight: '1rem',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ 
                    color: '#1f2937', 
                    fontSize: '22px', 
                    fontWeight: '700', 
                    margin: 0,
                    letterSpacing: '-0.02em'
                  }}>
                    {feature.title}
                  </h3>
                </div>
                
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '15px', 
                  lineHeight: '1.6',
                  margin: '0 0 2.5rem',
                  fontWeight: '500'
                }}>
                  {feature.description}
                </p>
                
                <button 
                  onClick={feature.onClick}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    background: feature.gradient,
                    color: 'white',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    letterSpacing: '-0.01em',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                >
                  {feature.action}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Quote Section */}
        <div style={{
          textAlign: 'center',
          marginTop: '5rem',
          padding: '3rem',
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ 
            fontSize: '20px', 
            color: '#4b5563', 
            fontStyle: 'italic', 
            margin: '0',
            fontWeight: '600',
            letterSpacing: '-0.01em',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            "Your mental health journey is unique. Every small step counts Kavya." ✨
          </p>
        </div>
      </div>

      {/* Creative Footer */}
      <footer style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '3rem 0',
        marginTop: '4rem',
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
          textAlign: 'center'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}>
              M
            </div>
            <h3 style={{ 
              color: '#1f2937', 
              margin: 0, 
              fontSize: '18px',
              fontWeight: '700',
              letterSpacing: '-0.01em'
            }}>
              MindCare
            </h3>
          </div>
          
          <p style={{
            color: '#6b7280',
            fontSize: '15px',
            margin: '0 0 1rem',
            fontWeight: '500'
          }}>
            Created by <strong style={{ 
              color: '#1f2937', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '700'
            }}>Srikar Vaka</strong>
          </p>
          
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <p style={{
              color: '#9ca3af',
              fontSize: '13px',
              margin: 0,
              fontWeight: '500'
            }}>
              Complete Mental Health & Productivity Platform • Made with ❤️ for 🐒
            </p>
          </div>
        </div>
      </footer>

      <style>
        {`
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
    </div>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')
  
  const handleNavigation = (page) => {
    setCurrentPage(page)
  }
  
  const handleBackToDashboard = () => {
    setCurrentPage('dashboard')
  }
  
  // Show chat page
  if (isLoggedIn && currentPage === 'chat') {
    return <ChatPage onBack={handleBackToDashboard} />
  }
  
  // Show journal page
  if (isLoggedIn && currentPage === 'journal') {
    return <JournalPage onBack={handleBackToDashboard} />
  }
  
  // Show analytics page
  if (isLoggedIn && currentPage === 'analytics') {
    return <AnalyticsPage onBack={handleBackToDashboard} />
  }
  
  // Show productivity page
  if (isLoggedIn && currentPage === 'productivity') {
    return <ProductivityPage onBack={handleBackToDashboard} />
  }
  
  return (
    <Router>
      <div>
        <Routes>
          <Route 
            path="/login" 
            element={
              isLoggedIn ? 
              <Navigate to="/dashboard" /> : 
              <LoginPage onLogin={() => setIsLoggedIn(true)} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isLoggedIn ? 
              <DashboardPage 
                onLogout={() => setIsLoggedIn(false)} 
                onNavigate={handleNavigation}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
