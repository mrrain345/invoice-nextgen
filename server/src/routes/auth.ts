import express, { CookieOptions } from 'express'
import bcrypt from 'bcrypt'
import jwt from '../helpers/jwt.js'
import { Record, String } from 'runtypes'
import User from '../models/User.js'
import { BadRequestError, ForbiddenError, UnauthorizedError } from '../errors.js'

const router = express.Router()

/// Refresh access and refresh tokens
router.get('/auth', async (req, res) => {
  // Get refresh token
  const refreshToken = jwt.refresh.token(req)
  if (!refreshToken) throw new UnauthorizedError()

  // Check if refresh token is valid
  const { id } = await jwt.refresh.verify(refreshToken).catch((err) => {
    jwt.refresh.clearCookie(res)
    throw new ForbiddenError({ cause: err as Error })
  })

  // Get user
  const user = await User.findById(id).select('+refreshTokens')
  if (!user) {
    jwt.refresh.clearCookie(res)
    throw new Error('User not found')
  }

  // Check if refresh token wasn't revoked
  const exists = user.refreshTokens!.find(token => token === refreshToken)
  if (!exists) {
    // Token was stolen, log out all user sessions
    jwt.refresh.clearCookie(res)
    user.refreshTokens = []
    await user.save()
    throw new ForbiddenError({ message: 'Refresh token was revoked' })
  }

  // Generate new refresh token
  const newRefreshToken = await jwt.refresh.sign(id)
  user.refreshTokens = user.refreshTokens!.map(token => token === refreshToken ? newRefreshToken : token)
  await user.save()
  jwt.refresh.setCookie(res, newRefreshToken)

  // Generate new access token
  const accessToken = await jwt.access.sign(id)
  res.json({ token: accessToken })
})



const PostBody = Record({
  email: String,
  password: String,
})

/// Authenticate user and return access and refresh tokens
router.post('/auth', async (req, res) => {
  const { email, password } = PostBody.check(req.body)

  // Check if user is already logged in
  const token = jwt.refresh.token(req)
  if (token) throw new BadRequestError('AUTH_ALREADY_LOGGED_IN')

  // Get user
  const user = await User.findOne({ email }).select('+password +refreshTokens')
  if (!user) throw new BadRequestError('AUTH_INVALID_CREDENTIALS')

  // Check if password is valid
  const valid = await bcrypt.compare(password, user.password!)
  if (!valid) throw new BadRequestError('AUTH_INVALID_CREDENTIALS')

  // Generate access and refresh tokens
  const accessToken = await jwt.access.sign(user.id)
  const refreshToken = await jwt.refresh.sign(user.id)

  // Save refresh token
  user.refreshTokens!.push(refreshToken)
  await user.save()
  jwt.refresh.setCookie(res, refreshToken)

  res.json({ token: accessToken })
})

/// Logout user
router.delete('/auth', async (req, res) => {
  // Get refresh token
  const refreshToken = jwt.refresh.token(req)
  if (!refreshToken) return res.json({})

  // Verify refresh token
  const { id } = await jwt.refresh.verify(refreshToken).catch((err) => {
    jwt.refresh.clearCookie(res)

    if (err.name === 'TokenExpiredError') {
      return jwt.refresh.decode(refreshToken) as { id: string }
    } else {
      throw new ForbiddenError({ cause: err as Error })
    }
  })

  // Get user
  const user = await User.findById(id).select('+refreshTokens')
  if (!user) {
    jwt.refresh.clearCookie(res)
    throw new Error('User not found')
  }

  // Check if refresh token wasn't revoked
  const exists = user.refreshTokens!.find(token => token === refreshToken)
  if (!exists) {
    // Token was stolen, log out all user sessions
    jwt.refresh.clearCookie(res)
    user.refreshTokens = []
    await user.save()
    throw new ForbiddenError({ message: 'Refresh token was revoked' })
  }

  // Revoke refresh token
  user.refreshTokens = user.refreshTokens!.filter(token => token !== refreshToken)
  jwt.refresh.clearCookie(res)
  await user.save()

  return res.json({})
})

export default router