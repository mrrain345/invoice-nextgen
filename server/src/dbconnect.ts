import mongoose from "mongoose"

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set.')
  process.exit(-1)
}

export default () => {
  const dbconnect = async () => {
    try {
      const db = process.env.MONGODB_URI!
      mongoose.set("strictQuery", true)
      await mongoose.connect(db)
    }
    catch (err) {
      console.error(err)
      process.exit(-1)
    }
  }

  dbconnect()
  mongoose.connection.on("disconnected", dbconnect)
}