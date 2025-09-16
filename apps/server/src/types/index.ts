export interface IUser {
  _id: string
  email: string
  passwordHash: string
  name: string
  roles: string[]
  settings: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    language: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface ISession {
  _id: string
  userId: string
  title: string
  systemPrompt: string
  createdAt: Date
  updatedAt: Date
}

export interface IMessage {
  _id: string
  sessionId: string
  userId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

export interface INote {
  _id: string
  userId: string
  title: string
  content: string
  mood?: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface IMoodLog {
  _id: string
  userId: string
  score: number
  noteId?: string
  tags: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface ITokenBlacklist {
  token: string
  exp: Date
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface JWTPayload {
  userId: string
  email: string
  roles: string[]
  iat?: number
  exp?: number
}

export interface ChatStreamChunk {
  content: string
  done: boolean
}