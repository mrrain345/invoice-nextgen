import express from 'express'
import { BadRequestError, HTTPError } from './errors.js'

import auth from './routes/auth.js'
import user from './routes/user.js'

const router = express.Router()

// API routes
router.use('/api', auth)
router.use('/api', user)

router.get('/api/test', (req, res) => {
  const error = new Error('cause')

  throw new BadRequestError('This is a test error', error)
})

router.get('/api/test/async', async (req, res) => {
  const error = new Error('async cause')

  // wait 1 second
  await new Promise(resolve => setTimeout(resolve, 1000))

  throw new BadRequestError('This is a test error', error)
})

export default router