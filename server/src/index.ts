import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import connect from './connect.js'
import user from './routes/user.js'

// Load environment variables from .env file
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.dev' })
}

// Create Express server
const app = express()

// Express configuration
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// Connect to database
connect({ db: process.env.MONGODB_URI })

// API routes
app.use('/api', user)

// Routes
app.get('/', (req, res) => {
  res.send(`Index`)
});

// Start Express server
(() => {
  const port = process.env.PORT || 3000

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })

})()