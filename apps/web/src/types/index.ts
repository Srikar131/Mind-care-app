export interface User {
  _id: string
  email: string
  name: string
  roles: string[]
  settings: UserSettings
  createdAt: string
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  language: string
}

export interface Session {
  _id: string
  userId: string
  title: string
  systemPrompt: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  _id: string
  sessionId: string
  userId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface Note {
  _id: string
  userId: string
  title: string
  content: string
  mood?: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface MoodLog {
  _id: string
  userId: string
  score: number
  noteId?: string
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

export interface ChatStreamChunk {
  content: string
  done: boolean
}

export interface CrisisResources {
  hotlines: Array<{
    name: string
    number: string
    available: string
  }>
  websites: Array<{
    name: string
    url: string
    description: string
  }>
}