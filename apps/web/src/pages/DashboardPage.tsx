type DashboardPageProps = {
  onLogout: () => void;
};

function DashboardPage({ onLogout }: DashboardPageProps) {
  const currentTime = new Date().getHours()
  const greeting = currentTime < 12 ? 'Good morning' : currentTime < 17 ? 'Good afternoon' : 'Good evening'
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Minimal Header */}
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
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #000000 0%, #374151 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              letterSpacing: '-0.02em'
            }}>
              M
            </div>
            <h1 style={{ 
              color: '#1f2937', 
              margin: 0, 
              fontSize: '18px',
              fontWeight: '600',
              letterSpacing: '-0.02em'
            }}>
              MindCare
            </h1>
          </div>
          
          <button 
            onClick={onLogout}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              letterSpacing: '-0.01em'
            }}
            onMouseOver={(e) => {
              const btn = e.target as HTMLButtonElement
              btn.style.background = '#f9fafb'
              btn.style.borderColor = '#d1d5db'
            }}
            onMouseOut={(e) => {
              const btn = e.target as HTMLButtonElement
              btn.style.background = 'transparent'
              btn.style.borderColor = '#e5e7eb'
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
        padding: '3rem 2rem'
      }}>
        
        {/* Minimal Welcome */}
        <div style={{ 
          marginBottom: '4rem'
        }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: '300', 
            margin: '0 0 0.5rem',
            color: '#1f2937',
            letterSpacing: '-0.02em'
          }}>
            {greeting} 🌟
          </h2>
          <p style={{ 
            fontSize: '16px', 
            margin: 0, 
            color: '#6b7280',
            fontWeight: '400'
          }}>
            Let's focus on your wellbeing today
          </p>
        </div>

        {/* Clean Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1px',
          marginBottom: '4rem',
          background: '#e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {[
            { label: 'Streak', value: '7', unit: 'days', color: '#3b82f6', emoji: '🔥' },
            { label: 'Today', value: 'Great', unit: 'mood', color: '#10b981', emoji: '😊' },
            { label: 'Entries', value: '12', unit: 'written', color: '#8b5cf6', emoji: '📝' },
            { label: 'Sessions', value: '5', unit: 'chats', color: '#f59e0b', emoji: '💬' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px'
            }}>
              <div style={{ 
                fontSize: '32px', 
                marginBottom: '0.5rem'
              }}>
                {stat.emoji}
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                color: '#1f2937',
                marginBottom: '0.25rem',
                letterSpacing: '-0.02em'
              }}>
                {stat.value}
              </div>
              <div style={{ 
                fontSize: '13px', 
                color: '#6b7280',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {stat.label}
              </div>
              <div style={{ 
                width: '24px',
                height: '2px',
                background: stat.color,
                marginTop: '0.75rem',
                borderRadius: '1px'
              }} />
            </div>
          ))}
        </div>

        {/* Premium Feature Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '2rem'
        }}>
          {[
            { 
              title: 'AI Companion', 
              description: 'Thoughtful conversations powered by advanced AI technology',
              action: 'Start conversation',
              gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              icon: '🤖'
            },
            { 
              title: 'Digital Journal', 
              description: 'Private space for reflection and personal growth',
              action: 'New entry',
              gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              icon: '📖'
            },
            { 
              title: 'Insights', 
              description: 'Understanding patterns in your mental wellness journey',
              action: 'View analytics',
              gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              icon: '📊'
            }
          ].map((feature, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '0',
              border: '1px solid #f3f4f6',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              
              {/* Card Header with Gradient */}
              <div style={{
                height: '4px',
                background: feature.gradient
              }} />
              
              <div style={{ padding: '2rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '1rem' 
                }}>
                  <span style={{ 
                    fontSize: '32px', 
                    marginRight: '0.75rem' 
                  }}>
                    {feature.icon}
                  </span>
                  <h3 style={{ 
                    color: '#1f2937', 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    margin: 0,
                    letterSpacing: '-0.01em'
                  }}>
                    {feature.title}
                  </h3>
                </div>
                
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  margin: '0 0 2rem',
                  fontWeight: '400'
                }}>
                  {feature.description}
                </p>
                
                <button style={{
                  width: '100%',
                  padding: '12px',
                  background: '#f9fafb',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '-0.01em'
                }}
                onMouseOver={(e) => {
                  const btn = e.target as HTMLButtonElement
                  btn.style.background = '#f3f4f6'
                  btn.style.borderColor = '#d1d5db'
                }}
                onMouseOut={(e) => {
                  const btn = e.target as HTMLButtonElement
                  btn.style.background = '#f9fafb'
                  btn.style.borderColor = '#e5e7eb'
                }}>
                  {feature.action}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Minimal Quote Section */}
        <div style={{
          textAlign: 'center',
          marginTop: '4rem',
          padding: '2rem',
          borderTop: '1px solid #f3f4f6'
        }}>
          <p style={{ 
            fontSize: '16px', 
            color: '#6b7280', 
            fontStyle: 'italic', 
            margin: '0',
            fontWeight: '400',
            letterSpacing: '-0.01em'
          }}>
            "Progress, not perfection" ✨
          </p>
        </div>
      </div>

      {/* Professional Footer */}
      <footer style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        padding: '2rem 0',
        marginTop: '4rem'
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
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              background: 'linear-gradient(135deg, #000000 0%, #374151 100%)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: '700'
            }}>
              M
            </div>
            <h3 style={{ 
              color: '#1f2937', 
              margin: 0, 
              fontSize: '16px',
              fontWeight: '600',
              letterSpacing: '-0.01em'
            }}>
              MindCare
            </h3>
          </div>
          
          <p style={{
            color: '#6b7280',
            fontSize: '13px',
            margin: 0,
            fontWeight: '400'
          }}>
            Created by <strong style={{ color: '#1f2937' }}>Srikar Vaka</strong>
          </p>
          
          <div style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #f3f4f6'
          }}>
            <p style={{
              color: '#9ca3af',
              fontSize: '11px',
              margin: 0,
              fontWeight: '400'
            }}>
              Your mental wellness companion • Made with ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
