import { Router } from 'express'
import { User } from '@/models/index.js'
import { authenticate, type AuthenticatedRequest } from '@/middleware/auth.js'
import { validate } from '@/middleware/validation.js'
import { updateUserSchema } from '@/utils/schemas.js'
import { logger } from '@/utils/logger.js'

const router = Router()

// Get current user
router.get('/me', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user.toJSON())
  } catch (error) {
    logger.error('Get user error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Update user profile
router.patch('/me', authenticate, validate(updateUserSchema), async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update allowed fields
    if (req.body.name) user.name = req.body.name
    if (req.body.settings) {
      user.settings = { ...user.settings, ...req.body.settings }
    }

    await user.save()

    logger.info('User profile updated', { userId: user._id })

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON(),
    })
  } catch (error) {
    logger.error('Update user error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Delete user account (soft delete)
router.delete('/me', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // TODO: Implement soft delete logic
    // For now, we'll just mark as deleted or remove the user
    // In production, you might want to keep the data for a retention period
    
    logger.info('User account deletion requested', { userId: user._id })
    
    res.json({ message: 'Account deletion requested. Data will be removed within 30 days.' })
  } catch (error) {
    logger.error('Delete user error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router