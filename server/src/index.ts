import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import 'express-async-errors'
import connect from './connect.js'
import router from './router.js'
import errorHandler from './middlewares/error-handler.js'
import { NotFoundError } from './errors.js'

// Load environment variables from .env file
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.dev' })
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set.')
  process.exit(-1)
}

// Create Express server
const app = express()

// Express configuration
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// Connect to database
connect({ db: process.env.MONGODB_URI })

// Routes
app.use("/", router)

// Catch 404 Not Found
app.all('*', (req, res) => {
  throw new NotFoundError()
})

// Error handler
app.use(errorHandler)

// Start Express server
const port = process.env.PORT ?? 3000

app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`)
})