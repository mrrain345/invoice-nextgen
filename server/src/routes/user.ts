import express from "express"

const api = express.Router()

api.get("/user", (req, res) => {
  res.json({ message: "Hello World!" })
})

export default api;
