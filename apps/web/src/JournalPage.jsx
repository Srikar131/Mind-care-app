import { useState, useEffect } from 'react'

function JournalPage({ onBack }) {
  const [currentView, setCurrentView] = useState('list') // 'list' or 'write'
  const [entries, setEntries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  
  // New entry form data
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('😊')

  // Load entries from localStorage on component mount
  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem('mindcare-journal-entries')
      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries)
        setEntries(Array.isArray(parsedEntries) ? parsedEntries : [])
      }
    } catch (error) {
      console.error('Error loading entries:', error)
      setEntries([])
    }
  }, [])

  // Save entry function
  const handleSaveEntry = () => {
    // Validation
    if (!title.trim()) {
      alert('Please add a title to your journal entry.')
      return
    }
    
    if (!content.trim()) {
      alert('Please add some content to your journal entry.')
      return
    }

    // Create new entry
    const newEntry = {
      id: Date.now(), // Simple unique ID
      title: title.trim(),
      content: content.trim(),
      mood: mood,
      date: new Date().toISOString(),
      wordCount: content.trim().split(/\s+/).filter(word => word.length > 0).length
    }

    try {
      // Add to entries array
      const updatedEntries = [...entries, newEntry]
      setEntries(updatedEntries)
      
      // Save to localStorage
      localStorage.setItem('mindcare-journal-entries', JSON.stringify(updatedEntries))
      
      // Reset form
      setTitle('')
      setContent('')
      setMood('😊')
      
      // Go back to list view
      setCurrentView('list')
      
      console.log('Entry saved successfully:', newEntry)
      
    } catch (error) {
      console.error('Error saving entry:', error)
      alert('There was an error saving your entry. Please try again.')
    }
  }

  // Delete entry function
  const handleDeleteEntry = (entryId) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        const updatedEntries = entries.filter(entry => entry.id !== entryId)
        setEntries(updatedEntries)
        localStorage.setItem('mindcare-journal-entries', JSON.stringify(updatedEntries))
      } catch (error) {
        console.error('Error deleting entry:', error)
        alert('There was an error deleting the entry.')
      }
    }
  }

  // Filter entries based on search
  const filteredEntries = entries.filter(entry => 
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          maxWidth: '1000px',
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
                color: '#6b7280',
                transition: 'all 0.2s'
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
                Digital Journal 📖
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                Private space for reflection and personal growth
              </p>
            </div>
          </div>

          {currentView === 'list' && (
            <button
              onClick={() => {
                setTitle('')
                setContent('')
                setMood('😊')
                setCurrentView('write')
              }}
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(240, 147, 251, 0.3)'
              }}
            >
              ✍️ New Entry
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        
        {/* LIST VIEW */}
        {currentView === 'list' && (
          <div>
            {/* Search Bar */}
            <div style={{ marginBottom: '2rem' }}>
              <input
                type="text"
                placeholder="Search your journal entries... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  background: 'white',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #f3f4f6',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>
                  {entries.length}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  Total Entries
                </div>
              </div>
              
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #f3f4f6',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>
                  {entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0)}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  Words Written
                </div>
              </div>
            </div>

            {/* Entries List */}
            {entries.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '3rem',
                textAlign: 'center',
                border: '1px solid #f3f4f6'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📝</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 0.5rem' }}>
                  Start Your Journey
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Write your first journal entry to begin tracking your thoughts and feelings.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredEntries
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((entry) => (
                    <div key={entry.id} style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid #f3f4f6',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                    }}>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '20px' }}>{entry.mood}</span>
                            <h3 style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1f2937',
                              margin: 0
                            }}>
                              {entry.title}
                            </h3>
                          </div>
                          
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '1rem' }}>
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })} • {entry.wordCount || 0} words
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            color: '#dc2626',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      <div style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#374151'
                      }}>
                        {entry.content.length > 150 ? `${entry.content.substring(0, 150)}...` : entry.content}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* WRITE VIEW */}
        {currentView === 'write' && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid #f3f4f6'
          }}>
            
            {/* Title Input */}
            <input
              type="text"
              placeholder="What's on your mind today?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                fontSize: '20px',
                fontWeight: '600',
                border: 'none',
                outline: 'none',
                marginBottom: '1rem',
                color: '#1f2937',
                boxSizing: 'border-box'
              }}
            />

            {/* Mood Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '0.5rem'
              }}>
                How are you feeling?
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['😊', '😢', '😤', '😰', '🥳', '😴', '🤔', '😍', '😕', '🤗'].map(emojiOption => (
                  <button
                    key={emojiOption}
                    onClick={() => setMood(emojiOption)}
                    style={{
                      fontSize: '24px',
                      padding: '8px',
                      border: mood === emojiOption ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: mood === emojiOption ? '#eff6ff' : 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {emojiOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Textarea */}
            <textarea
              placeholder="Write about your thoughts, feelings, experiences, or anything that's important to you right now..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: '100%',
                minHeight: '300px',
                fontSize: '15px',
                lineHeight: '1.6',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1rem',
                resize: 'vertical',
                fontFamily: 'inherit',
                color: '#374151',
                boxSizing: 'border-box'
              }}
            />

            {/* Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #f3f4f6'
            }}>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                {content.trim().split(/\s+/).filter(word => word.length > 0).length} words
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setCurrentView('list')}
                  style={{
                    background: 'transparent',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    color: '#6b7280',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleSaveEntry}
                  style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JournalPage
