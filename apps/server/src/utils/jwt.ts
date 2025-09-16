import jwt from 'jsonwebtoken'
import { getConfig } from '@/config.js'
import type { AuthTokens, JWTPayload } from '@/types'

const config = getConfig()

export function generateTokens(payload: Omit<JWTPayload, 'iat' | 'exp'>): AuthTokens {
  const accessToken = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  })

  const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
  })

  return { accessToken, refreshToken }
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, config.JWT_SECRET) as JWTPayload
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as JWTPayload
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload
  } catch {
    return null
  }
}