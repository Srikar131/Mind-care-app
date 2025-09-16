import { useState, useEffect } from 'react'

function AnalyticsPage({ onBack }) {
  const [timeRange, setTimeRange] = useState('week') // 'week' or 'month'
  const [journalEntries, setJournalEntries] = useState([])
  const [analytics, setAnalytics] = useState(null)

  // Load data and calculate analytics
  useEffect(() => {
    try {
      // Load journal entries
      const savedEntries = localStorage.getItem('mindcare-journal-entries')
      const entries = savedEntries ? JSON.parse(savedEntries) : []
      setJournalEntries(entries)

      // Calculate analytics
      const calculatedAnalytics = calculateAnalytics(entries, timeRange)
      setAnalytics(calculatedAnalytics)
    } catch (error) {
      console.error('Error loading analytics:', error)
      setJournalEntries([])
      setAnalytics(null)
    }
  }, [timeRange])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Header */}
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
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={onBack}
              style={{
                background: 'transparent',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#6b7280'
              }}
            >
              ← Back to Dashboard
            </button>
            
            <div>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '600',
                margin: 0,
                color: '#1f2937'
              }}>
                Analytics & Insights 📊
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                Understanding patterns in your mental wellness journey
              </p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setTimeRange('week')}
              style={{
                padding: '6px 12px',
                background: timeRange === 'week' ? '#3b82f6' : 'transparent',
                color: timeRange === 'week' ? 'white' : '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              style={{
                padding: '6px 12px',
                background: timeRange === 'month' ? '#3b82f6' : 'transparent',
                color: timeRange === 'month' ? 'white' : '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        
        {analytics ? (
          <>
            {/* Key Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '3rem'
            }}>
              <MetricCard 
                icon="🔥"
                value={analytics.streak}
                label="Day Streak"
                trend="+2 from last week"
                color="#ef4444"
              />
              <MetricCard 
                icon="📝"
                value={analytics.totalEntries}
                label="Journal Entries"
                trend={`${analytics.entriesThisPeriod} this ${timeRange}`}
                color="#8b5cf6"
              />
              <MetricCard 
                icon="😊"
                value={analytics.averageMood}
                label="Average Mood"
                trend={analytics.moodTrend}
                color="#10b981"
              />
              <MetricCard 
                icon="📈"
                value={analytics.totalWords}
                label="Words Written"
                trend={`${analytics.avgWordsPerEntry} per entry`}
                color="#3b82f6"
              />
            </div>

            {/* Charts Section - Fixed Layout */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              
              {/* Mood Chart - Full Width */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid #f3f4f6',
                width: '100%',
                overflow: 'hidden'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '1.5rem'
                }}>
                  Mood Trends Over Time 😊
                </h3>
                <MoodChart data={analytics.moodData} />
              </div>

              {/* Writing Activity Chart - Full Width */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid #f3f4f6',
                width: '100%',
                overflow: 'hidden'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '1.5rem'
                }}>
                  Writing Activity Pattern 📝
                </h3>
                <WritingChart data={analytics.writingData} />
              </div>
            </div>

            {/* Insights */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid #f3f4f6'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1.5rem'
              }}>
                Personal Insights 🔍
              </h3>
              <InsightsSection analytics={analytics} />
            </div>
          </>
        ) : (
          <NoDataState />
        )}
      </div>
    </div>
  )
}

// Metric Card Component
function MetricCard({ icon, value, label, trend, color }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      border: '1px solid #f3f4f6',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>
        {icon}
      </div>
      <div style={{ 
        fontSize: '24px', 
        fontWeight: '600', 
        color: '#1f2937',
        marginBottom: '0.25rem'
      }}>
        {value}
      </div>
      <div style={{ 
        fontSize: '13px', 
        color: '#6b7280',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </div>
      <div style={{ 
        fontSize: '12px', 
        color: color,
        background: `${color}15`,
        padding: '4px 8px',
        borderRadius: '12px',
        display: 'inline-block'
      }}>
        {trend}
      </div>
    </div>
  )
}

// Fixed Responsive Mood Chart Component
function MoodChart({ data }) {
  const moodValues = { '😢': 1, '😕': 2, '🤔': 3, '😊': 4, '🥳': 5, '😐': 3 }
  
  return (
    <div style={{ 
      height: '250px', 
      width: '100%',
      display: 'flex', 
      alignItems: 'end', 
      justifyContent: 'center',
      gap: '4px', 
      padding: '1rem 0',
      overflowX: 'hidden'
    }}>
      {data.map((day, index) => {
        const moodValue = moodValues[day.mood] || 3
        const height = (moodValue / 5) * 180
        
        return (
          <div key={index} style={{
            flex: '1',
            maxWidth: '60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '100%',
              height: `${height}px`,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '6px 6px 0 0',
              minHeight: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <span style={{ 
                fontSize: '18px',
                position: 'absolute',
                top: '8px'
              }}>
                {day.mood}
              </span>
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: '#6b7280',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}>
              {day.day}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Fixed Responsive Writing Chart Component
function WritingChart({ data }) {
  const maxWords = Math.max(...data.map(d => d.words), 1)
  
  return (
    <div style={{ 
      height: '250px', 
      width: '100%',
      display: 'flex', 
      alignItems: 'end', 
      justifyContent: 'center',
      gap: '4px', 
      padding: '1rem 0',
      overflowX: 'hidden'
    }}>
      {data.map((day, index) => {
        const height = maxWords > 0 ? (day.words / maxWords) * 180 : 20
        
        return (
          <div key={index} style={{
            flex: '1',
            maxWidth: '60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{
              width: '100%',
              height: `${Math.max(height, 20)}px`,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '6px 6px 0 0',
              minHeight: '20px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: '4px'
            }}>
              {day.words > 0 && (
                <span style={{ 
                  fontSize: '10px', 
                  color: 'white',
                  fontWeight: '600'
                }}>
                  {day.words}
                </span>
              )}
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: '#6b7280',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}>
              {day.day}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Insights Section Component
function InsightsSection({ analytics }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {analytics.insights.map((insight, index) => (
        <div key={index} style={{
          padding: '1rem',
          background: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '16px' }}>{insight.icon}</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
              {insight.title}
            </span>
          </div>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0,
            lineHeight: '1.5'
          }}>
            {insight.description}
          </p>
        </div>
      ))}
    </div>
  )
}

// No Data State
function NoDataState() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '4rem',
      textAlign: 'center',
      border: '1px solid #f3f4f6'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '1rem' }}>📊</div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 0.5rem' }}>
        No Data Yet
      </h3>
      <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 1.5rem' }}>
        Create some journal entries to see your analytics and insights!
      </p>
      <button
        onClick={() => window.history.back()}
        style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 20px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Go Write Your First Entry ✍️
      </button>
    </div>
  )
}

// Analytics calculation function
function calculateAnalytics(entries, timeRange) {
  if (!entries || entries.length === 0) {
    return null
  }

  const now = new Date()
  const daysToShow = timeRange === 'week' ? 7 : 30
  const dates = []
  
  // Generate date range
  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    dates.push(date)
  }

  // Map moods to numbers for calculations
  const moodValues = { '😢': 1, '😕': 2, '🤔': 3, '😊': 4, '🥳': 5, '😰': 2, '😴': 3, '😍': 5, '🤗': 4 }
  const moodEmojis = { 1: '😢', 2: '😕', 3: '🤔', 4: '😊', 5: '🥳' }

  // Create mood data for chart
  const moodData = dates.map(date => {
    const dateStr = date.toDateString()
    const dayEntries = entries.filter(entry => 
      new Date(entry.date).toDateString() === dateStr
    )
    
    if (dayEntries.length === 0) {
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        mood: '😐',
        value: 3
      }
    }
    
    const avgMoodValue = dayEntries.reduce((sum, entry) => sum + (moodValues[entry.mood] || 3), 0) / dayEntries.length
    const roundedMood = Math.round(avgMoodValue)
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      mood: moodEmojis[roundedMood] || '😊',
      value: roundedMood
    }
  })

  // Create writing data for chart
  const writingData = dates.map(date => {
    const dateStr = date.toDateString()
    const dayEntries = entries.filter(entry => 
      new Date(entry.date).toDateString() === dateStr
    )
    
    const totalWords = dayEntries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0)
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      words: totalWords,
      entries: dayEntries.length
    }
  })

  // Calculate key metrics
  const totalEntries = entries.length
  const entriesThisPeriod = entries.filter(entry => {
    const entryDate = new Date(entry.date)
    const cutoffDate = new Date(now)
    cutoffDate.setDate(cutoffDate.getDate() - daysToShow)
    return entryDate >= cutoffDate
  }).length

  const totalWords = entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0)
  const avgWordsPerEntry = Math.round(totalWords / totalEntries) || 0

  const recentMoods = entries.slice(-7).map(entry => moodValues[entry.mood] || 3)
  const averageMood = recentMoods.length > 0 
    ? moodEmojis[Math.round(recentMoods.reduce((sum, mood) => sum + mood, 0) / recentMoods.length)]
    : '😊'

  // Calculate streaks (simplified)
  const streak = calculateStreak(entries)

  // Generate insights
  const insights = generateInsights(entries, moodData, writingData)

  return {
    streak,
    totalEntries,
    entriesThisPeriod,
    averageMood,
    moodTrend: 'Stable',
    totalWords,
    avgWordsPerEntry,
    moodData,
    writingData,
    insights
  }
}

// Calculate writing streak
function calculateStreak(entries) {
  if (entries.length === 0) return 0
  
  let streak = 0
  const today = new Date()
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    
    const hasEntryOnDate = entries.some(entry => {
      const entryDate = new Date(entry.date)
      return entryDate.toDateString() === checkDate.toDateString()
    })
    
    if (hasEntryOnDate) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  
  return streak
}

// Generate personalized insights
function generateInsights(entries, moodData, writingData) {
  const insights = []
  
  if (entries.length >= 3) {
    const recentEntries = entries.slice(-3)
    const avgWords = recentEntries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0) / 3
    
    if (avgWords > 100) {
      insights.push({
        icon: '✍️',
        title: 'Great Writing Habit',
        description: `You've been writing an average of ${Math.round(avgWords)} words per entry recently. Consistent journaling helps process emotions and reduce stress.`
      })
    }
  }
  
  const recentMoods = moodData.slice(-5).map(d => d.value)
  const avgMood = recentMoods.reduce((sum, mood) => sum + mood, 0) / recentMoods.length
  
  if (avgMood >= 4) {
    insights.push({
      icon: '🌟',
      title: 'Positive Trend',
      description: 'Your mood has been consistently positive lately! Keep up the great work with your mental health practices.'
    })
  } else if (avgMood <= 2.5) {
    insights.push({
      icon: '💙',
      title: 'Support Available',
      description: 'It looks like you\'ve been going through a tough time. Remember that it\'s okay to reach out for support when you need it.'
    })
  }
  
  if (entries.length >= 7) {
    insights.push({
      icon: '📈',
      title: 'Consistency Matters',
      description: `You've written ${entries.length} journal entries! Regular reflection is a powerful tool for mental wellness and emotional growth.`
    })
  }
  
  if (insights.length === 0) {
    insights.push({
      icon: '🌱',
      title: 'Getting Started',
      description: 'You\'re just beginning your mental wellness journey with MindCare. Keep writing and tracking your moods to see personalized insights here!'
    })
  }
  
  return insights
}

export default AnalyticsPage
