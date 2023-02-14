import express from 'express'
import authorize from '../middlewares/auth.js'

import auth from './auth.js'
import user from './user.js'

const router = express.Router()

// Not protected routes
router.use(auth)
router.use(user)

// Protected routes
router.use(authorize)

export default router