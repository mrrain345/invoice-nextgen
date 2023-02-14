import express from "express"
import bcrypt from "bcrypt"
import { Record, String, Partial } from "runtypes"
import User from "../models/User.js"
import auth from "../middlewares/auth.js"
import { BadRequestError } from "../errors.js"

const router = express.Router()

/// Get user data
router.get("/user", auth, async (req, res) => {
  const user = await User.findById(req.userId)
  if (!user) throw new Error("User not found")

  res.json(user)
})


const PostBody = Record({
  username: String,
  email: String,
  password: String,
})

/// Register a new user
router.post("/user", async (req, res) => {
  const { username, email, password } = PostBody.check(req.body)

  if (await User.findOne({ email })) throw new BadRequestError("USER_EMAIL_EXISTS")

  const hash = await bcrypt.hash(password, 10)

  const user = await User.create({ username, email, password: hash })
  res.json(user)
})


const PatchBody = Partial({
  username: String,
  email: String,
  password: String,
  currentPassword: String,
})

/// Change user data
router.patch("/user", auth, async (req, res) => {
  const { username, email, password, currentPassword } = PatchBody.check(req.body)

  const user = await User.findById(req.userId).select("+password")
  if (!user) throw new Error("User not found")

  const correct = currentPassword && await bcrypt.compare(currentPassword, user.password!)

  if (username) user.username = username
  if (email && correct) user.email = email
  if (password && correct) user.password = await bcrypt.hash(password, 10)

  await user.save()
  res.json(user)
})


const DeleteBody = Record({
  password: String,
})

/// Delete user
router.delete("/user", auth, async (req, res) => {
  const { password } = DeleteBody.check(req.body)

  const user = await User.findById(req.userId).select("+password")
  if (!user) throw new Error("User not found")

  const correct = await bcrypt.compare(password, user.password!)
  if (!correct) throw new BadRequestError("USER_PASSWORD_INCORRECT")

  await user.remove()
  res.json({})
})

export default router;
