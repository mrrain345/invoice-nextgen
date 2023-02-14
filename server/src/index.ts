import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'express-async-errors'
import dbconnect from './dbconnect.js'
import router from './routes/router.js'
import errorHandler from './middlewares/error-handler.js'
import { NotFoundError } from './errors.js'
import { unauth } from './middlewares/auth.js'

// Create Express server
const app = express()

// Express configuration
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ALLOW_ORIGIN : '*',
  credentials: true,
}))
app.use(unauth)

// Connect to database
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set.')
  process.exit(-1)
}

dbconnect()

// Routes
app.use("/api", router)

// Catch 404 Not Found
app.all('*', (req, res) => {
  throw new NotFoundError()
})

// Error handler
app.use(errorHandler)

// Start Express server
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`)
})