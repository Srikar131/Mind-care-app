import { Router } from 'express'
import { User, TokenBlacklist } from '@/models/index.js'
import { hashPassword, comparePassword } from '@/utils/crypto.js'
import { generateTokens, verifyRefreshToken, decodeToken } from '@/utils/jwt.js'
import { validate } from '@/middleware/validation.js'
import { authRateLimit } from '@/middleware/rateLimiter.js'
import { authenticate } from '@/middleware/auth.js'
import { 
  loginSchema, 
  registerSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from '@/utils/schemas.js'
import { logger } from '@/utils/logger.js'
import { getConfig } from '@/config.js'

const router = Router()
const config = getConfig()

// Register
router.post('/register', authRateLimit, validate(registerSchema), async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = new User({
      name,
      email,
      passwordHash,
    })

    await user.save()

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      roles: user.roles,
    })

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    logger.info({ userId: user._id, email }, 'User registered successfully')

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      accessToken: tokens.accessToken,
    })
  } catch (error) {
    logger.error('Registration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Login
router.post('/login', authRateLimit, validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      roles: user.roles,
    })

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    logger.info('User logged in successfully', { userId: user._id, email })

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      accessToken: tokens.accessToken,
    })
  } catch (error) {
    logger.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not provided' })
    }

    // Check if token is blacklisted
    const blacklistedToken = await TokenBlacklist.findOne({ token: refreshToken })
    if (blacklistedToken) {
      return res.status(401).json({ message: 'Token has been invalidated' })
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken)

    // Find user
    const user = await User.findById(payload.userId)
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      roles: user.roles,
    })

    // Set new refresh token in cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.json({
      user: user.toJSON(),
      accessToken: tokens.accessToken,
    })
  } catch (error) {
    logger.error('Token refresh error:', error)
    res.status(401).json({ message: 'Invalid refresh token' })
  }
})

// Logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    const authHeader = req.headers.authorization
    const accessToken = authHeader?.substring(7)

    // Add tokens to blacklist
    const promises = []
    
    if (refreshToken) {
      const refreshPayload = decodeToken(refreshToken)
      if (refreshPayload?.exp) {
        promises.push(new TokenBlacklist({
          token: refreshToken,
          exp: new Date(refreshPayload.exp * 1000),
        }).save())
      }
    }
    
    if (accessToken) {
      const accessPayload = decodeToken(accessToken)
      if (accessPayload?.exp) {
        promises.push(new TokenBlacklist({
          token: accessToken,
          exp: new Date(accessPayload.exp * 1000),
        }).save())
      }
    }

    await Promise.all(promises)

    // Clear refresh token cookie
    res.clearCookie('refreshToken')

    res.json({ message: 'Logout successful' })
  } catch (error) {
    logger.error('Logout error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Forgot password (placeholder)
router.post('/forgot', authRateLimit, validate(forgotPasswordSchema), async (req, res) => {
  try {
    const { email } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      // Return success even if user doesn't exist for security
      return res.json({ message: 'If an account with that email exists, a reset link has been sent' })
    }

    // TODO: Implement email sending logic
    logger.info('Password reset requested', { email })

    res.json({ message: 'If an account with that email exists, a reset link has been sent' })
  } catch (error) {
    logger.error('Forgot password error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Reset password (placeholder)
router.post('/reset', authRateLimit, validate(resetPasswordSchema), async (req, res) => {
  try {
    const { token } = req.body

    // TODO: Implement token verification and password reset logic
    logger.info('Password reset attempted', { token })

    res.json({ message: 'Password reset successful' })
  } catch (error) {
    logger.error('Reset password error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router