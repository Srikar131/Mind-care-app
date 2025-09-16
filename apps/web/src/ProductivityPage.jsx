import { useState, useEffect } from 'react'

function ProductivityPage({ onBack }) {
  const [activeTab, setActiveTab] = useState('tasks') // 'tasks', 'dates', 'goals'
  
  // State for all features
  const [tasks, setTasks] = useState([])
  const [importantDates, setImportantDates] = useState([])
  const [weeklyGoals, setWeeklyGoals] = useState([])
  const [monthlyGoals, setMonthlyGoals] = useState([])

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('mindcare-tasks')
      const savedDates = localStorage.getItem('mindcare-important-dates')
      const savedWeeklyGoals = localStorage.getItem('mindcare-weekly-goals')
      const savedMonthlyGoals = localStorage.getItem('mindcare-monthly-goals')

      if (savedTasks) setTasks(JSON.parse(savedTasks))
      if (savedDates) setImportantDates(JSON.parse(savedDates))
      if (savedWeeklyGoals) setWeeklyGoals(JSON.parse(savedWeeklyGoals))
      if (savedMonthlyGoals) setMonthlyGoals(JSON.parse(savedMonthlyGoals))
    } catch (error) {
      console.error('Error loading productivity data:', error)
    }
  }, [])

  // Save data to localStorage
  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving to storage:', error)
    }
  }

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
                Productivity Hub 🎯
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                Organize your tasks, dates, and goals for better mental wellness
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            background: 'white',
            borderRadius: '8px',
            padding: '4px',
            border: '1px solid #e5e7eb'
          }}>
            {[
              { id: 'tasks', label: 'Tasks', icon: '📋' },
              { id: 'dates', label: 'Dates', icon: '📅' },
              { id: 'goals', label: 'Goals', icon: '🎯' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  background: activeTab === tab.id ? '#3b82f6' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        
        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <TasksSection 
            tasks={tasks}
            setTasks={setTasks}
            saveToStorage={saveToStorage}
          />
        )}

        {/* Important Dates Tab */}
        {activeTab === 'dates' && (
          <DatesSection 
            dates={importantDates}
            setDates={setImportantDates}
            saveToStorage={saveToStorage}
          />
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <GoalsSection 
            weeklyGoals={weeklyGoals}
            monthlyGoals={monthlyGoals}
            setWeeklyGoals={setWeeklyGoals}
            setMonthlyGoals={setMonthlyGoals}
            saveToStorage={saveToStorage}
          />
        )}
      </div>
    </div>
  )
}

// Tasks Section Component
function TasksSection({ tasks, setTasks, saveToStorage }) {
  const [newTask, setNewTask] = useState('')
  const [newPriority, setNewPriority] = useState('medium')

  const addTask = () => {
    if (!newTask.trim()) return

    const task = {
      id: Date.now(),
      text: newTask.trim(),
      priority: newPriority,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    }

    const updatedTasks = [...tasks, task]
    setTasks(updatedTasks)
    saveToStorage('mindcare-tasks', updatedTasks)
    setNewTask('')
  }

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : null
        }
      }
      return task
    })
    setTasks(updatedTasks)
    saveToStorage('mindcare-tasks', updatedTasks)
  }

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId)
    setTasks(updatedTasks)
    saveToStorage('mindcare-tasks', updatedTasks)
  }

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length

  return (
    <div>
      {/* Tasks Stats */}
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
            {totalTasks}
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Tasks
          </div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #f3f4f6',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#10b981' }}>
            {completedTasks}
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Completed
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #f3f4f6',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#3b82f6' }}>
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Progress
          </div>
        </div>
      </div>

      {/* Add New Task */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #f3f4f6',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Add New Task
        </h3>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter your task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            style={{
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              minWidth: '120px'
            }}
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          
          <button
            onClick={addTask}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #f3f4f6'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Your Tasks
        </h3>
        
        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📋</div>
            <p>No tasks yet. Add your first task above!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tasks
              .sort((a, b) => {
                if (a.completed !== b.completed) return a.completed - b.completed
                const priorityOrder = { high: 0, medium: 1, low: 2 }
                return priorityOrder[a.priority] - priorityOrder[b.priority]
              })
              .map(task => (
                <div key={task.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  background: task.completed ? '#f9fafb' : 'white',
                  border: '1px solid #f3f4f6',
                  borderRadius: '8px',
                  gap: '1rem'
                }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  
                  <div style={{
                    width: '4px',
                    height: '30px',
                    background: priorityColors[task.priority],
                    borderRadius: '2px'
                  }} />
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      color: task.completed ? '#9ca3af' : '#1f2937',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      fontWeight: task.completed ? '400' : '500'
                    }}>
                      {task.text}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '0.25rem' }}>
                      {task.priority} priority • {new Date(task.createdAt).toLocaleDateString()}
                      {task.completed && task.completedAt && (
                        <> • Completed {new Date(task.completedAt).toLocaleDateString()}</>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
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
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Important Dates Section Component
function DatesSection({ dates, setDates, saveToStorage }) {
  const [newDate, setNewDate] = useState({
    title: '',
    date: '',
    type: 'appointment',
    description: ''
  })

  const addDate = () => {
    if (!newDate.title.trim() || !newDate.date) return

    const dateItem = {
      id: Date.now(),
      ...newDate,
      title: newDate.title.trim(),
      description: newDate.description.trim(),
      createdAt: new Date().toISOString()
    }

    const updatedDates = [...dates, dateItem]
    setDates(updatedDates)
    saveToStorage('mindcare-important-dates', updatedDates)
    setNewDate({ title: '', date: '', type: 'appointment', description: '' })
  }

  const deleteDate = (dateId) => {
    const updatedDates = dates.filter(date => date.id !== dateId)
    setDates(updatedDates)
    saveToStorage('mindcare-important-dates', updatedDates)
  }

  const typeIcons = {
    appointment: '👩‍⚕️',
    birthday: '🎂',
    deadline: '⏰',
    reminder: '🔔',
    event: '🎉'
  }

  const upcomingDates = dates
    .filter(date => new Date(date.date) >= new Date().setHours(0, 0, 0, 0))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div>
      {/* Add New Date */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #f3f4f6',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Add Important Date
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Event title..."
            value={newDate.title}
            onChange={(e) => setNewDate(prev => ({ ...prev, title: e.target.value }))}
            style={{
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          
          <input
            type="date"
            value={newDate.date}
            onChange={(e) => setNewDate(prev => ({ ...prev, date: e.target.value }))}
            style={{
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <select
            value={newDate.type}
            onChange={(e) => setNewDate(prev => ({ ...prev, type: e.target.value }))}
            style={{
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            <option value="appointment">👩‍⚕️ Appointment</option>
            <option value="birthday">🎂 Birthday</option>
            <option value="deadline">⏰ Deadline</option>
            <option value="reminder">🔔 Reminder</option>
            <option value="event">🎉 Event</option>
          </select>
          
          <input
            type="text"
            placeholder="Description (optional)..."
            value={newDate.description}
            onChange={(e) => setNewDate(prev => ({ ...prev, description: e.target.value }))}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          
          <button
            onClick={addDate}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Add Date
          </button>
        </div>
      </div>

      {/* Upcoming Dates */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #f3f4f6'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Important Dates
        </h3>
        
        {dates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📅</div>
            <p>No important dates added yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {dates
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map(dateItem => {
                const isUpcoming = new Date(dateItem.date) >= new Date().setHours(0, 0, 0, 0)
                const daysUntil = Math.ceil((new Date(dateItem.date) - new Date()) / (1000 * 60 * 60 * 24))
                
                return (
                  <div key={dateItem.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    background: isUpcoming ? '#fef9c3' : '#f9fafb',
                    border: '1px solid #f3f4f6',
                    borderRadius: '8px',
                    gap: '1rem'
                  }}>
                    <div style={{ fontSize: '24px' }}>
                      {typeIcons[dateItem.type]}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                        {dateItem.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '0.25rem' }}>
                        {new Date(dateItem.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {isUpcoming && daysUntil >= 0 && (
                          <span style={{ color: '#f59e0b', fontWeight: '500' }}>
                            {daysUntil === 0 ? ' • Today!' : ` • In ${daysUntil} days`}
                          </span>
                        )}
                      </div>
                      {dateItem.description && (
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '0.25rem' }}>
                          {dateItem.description}
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => deleteDate(dateItem.id)}
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
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}

// Goals Section Component
function GoalsSection({ weeklyGoals, monthlyGoals, setWeeklyGoals, setMonthlyGoals, saveToStorage }) {
  const [goalType, setGoalType] = useState('weekly') // 'weekly' or 'monthly'
  const [newGoal, setNewGoal] = useState('')

  const addGoal = () => {
    if (!newGoal.trim()) return

    const goal = {
      id: Date.now(),
      text: newGoal.trim(),
      completed: false,
      progress: 0,
      createdAt: new Date().toISOString(),
      completedAt: null
    }

    if (goalType === 'weekly') {
      const updated = [...weeklyGoals, goal]
      setWeeklyGoals(updated)
      saveToStorage('mindcare-weekly-goals', updated)
    } else {
      const updated = [...monthlyGoals, goal]
      setMonthlyGoals(updated)
      saveToStorage('mindcare-monthly-goals', updated)
    }
    
    setNewGoal('')
  }

  const toggleGoal = (goalId, type) => {
    const goals = type === 'weekly' ? weeklyGoals : monthlyGoals
    const setGoals = type === 'weekly' ? setWeeklyGoals : setMonthlyGoals
    const storageKey = type === 'weekly' ? 'mindcare-weekly-goals' : 'mindcare-monthly-goals'

    const updated = goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          completed: !goal.completed,
          progress: !goal.completed ? 100 : 0,
          completedAt: !goal.completed ? new Date().toISOString() : null
        }
      }
      return goal
    })
    
    setGoals(updated)
    saveToStorage(storageKey, updated)
  }

  const updateProgress = (goalId, type, progress) => {
    const goals = type === 'weekly' ? weeklyGoals : monthlyGoals
    const setGoals = type === 'weekly' ? setWeeklyGoals : setMonthlyGoals
    const storageKey = type === 'weekly' ? 'mindcare-weekly-goals' : 'mindcare-monthly-goals'

    const updated = goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          progress: Math.max(0, Math.min(100, progress)),
          completed: progress >= 100,
          completedAt: progress >= 100 ? new Date().toISOString() : null
        }
      }
      return goal
    })
    
    setGoals(updated)
    saveToStorage(storageKey, updated)
  }

  const deleteGoal = (goalId, type) => {
    const goals = type === 'weekly' ? weeklyGoals : monthlyGoals
    const setGoals = type === 'weekly' ? setWeeklyGoals : setMonthlyGoals
    const storageKey = type === 'weekly' ? 'mindcare-weekly-goals' : 'mindcare-monthly-goals'

    const updated = goals.filter(goal => goal.id !== goalId)
    setGoals(updated)
    saveToStorage(storageKey, updated)
  }

  const currentGoals = goalType === 'weekly' ? weeklyGoals : monthlyGoals
  const completedGoals = currentGoals.filter(goal => goal.completed).length

  return (
    <div>
      {/* Goal Stats */}
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
            {weeklyGoals.length}
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Weekly Goals
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
            {monthlyGoals.length}
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Monthly Goals
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #f3f4f6',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#10b981' }}>
            {completedGoals}
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {goalType} Completed
          </div>
        </div>
      </div>

      {/* Add New Goal */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #f3f4f6',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Add New Goal
        </h3>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <select
            value={goalType}
            onChange={(e) => setGoalType(e.target.value)}
            style={{
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            <option value="weekly">🗓️ Weekly Goal</option>
            <option value="monthly">📅 Monthly Goal</option>
          </select>
          
          <input
            type="text"
            placeholder={`Enter your ${goalType} goal...`}
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          
          <button
            onClick={addGoal}
            style={{
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Add Goal
          </button>
        </div>
      </div>

      {/* Goals Tabs */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <button
          onClick={() => setGoalType('weekly')}
          style={{
            padding: '8px 16px',
            background: goalType === 'weekly' ? '#8b5cf6' : 'white',
            color: goalType === 'weekly' ? 'white' : '#6b7280',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          🗓️ Weekly Goals ({weeklyGoals.length})
        </button>
        <button
          onClick={() => setGoalType('monthly')}
          style={{
            padding: '8px 16px',
            background: goalType === 'monthly' ? '#8b5cf6' : 'white',
            color: goalType === 'monthly' ? 'white' : '#6b7280',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          📅 Monthly Goals ({monthlyGoals.length})
        </button>
      </div>

      {/* Goals List */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #f3f4f6'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          {goalType === 'weekly' ? 'Weekly' : 'Monthly'} Goals
        </h3>
        
        {currentGoals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🎯</div>
            <p>No {goalType} goals yet. Add your first goal above!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentGoals
              .sort((a, b) => b.progress - a.progress)
              .map(goal => (
                <div key={goal.id} style={{
                  padding: '1.5rem',
                  background: goal.completed ? '#f0fdf4' : 'white',
                  border: '1px solid #f3f4f6',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: goal.completed ? '#10b981' : '#1f2937',
                        marginBottom: '0.25rem'
                      }}>
                        {goal.completed && '✅ '}{goal.text}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        Created {new Date(goal.createdAt).toLocaleDateString()}
                        {goal.completed && goal.completedAt && (
                          <> • Completed {new Date(goal.completedAt).toLocaleDateString()}</>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button
                        onClick={() => toggleGoal(goal.id, goalType)}
                        style={{
                          background: goal.completed ? '#dcfce7' : '#ddd6fe',
                          color: goal.completed ? '#166534' : '#6d28d9',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        {goal.completed ? 'Completed' : 'Mark Complete'}
                      </button>
                      
                      <button
                        onClick={() => deleteGoal(goal.id, goalType)}
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
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{
                      flex: 1,
                      height: '8px',
                      background: '#f3f4f6',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${goal.progress}%`,
                        background: goal.completed ? '#10b981' : '#8b5cf6',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={goal.progress}
                      onChange={(e) => updateProgress(goal.id, goalType, parseInt(e.target.value) || 0)}
                      style={{
                        width: '60px',
                        padding: '4px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        fontSize: '12px',
                        textAlign: 'center'
                      }}
                    />
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>%</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductivityPage
