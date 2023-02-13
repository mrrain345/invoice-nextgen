import express from 'express'
import { Record, String } from 'runtypes'

const api = express.Router()

api.get('/auth', (req, res) => {
  res.json({ message: 'Hello World!' })
})


const PostBody = Record({
  email: String,
  password: String,
})

api.post('/auth', (req, res) => {
  const { email, password } = PostBody.check(req.body)

  res.json({ message: 'Hello World!' })
})

export default api