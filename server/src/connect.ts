import mongoose from "mongoose"

type DBInput = {
  db?: string,
}

export default ({ db }: DBInput) => {
  const connect = async () => {
    if (db === undefined) {
      console.error(`No database connection string provided.`)
      process.exit(1)
    }

    try {
      mongoose.set("strictQuery", true)
      const conn = await mongoose.connect(db)
      console.info(`Successfully connected to ${db}`)
    }
    catch (err) {
      console.error(`Error connecting to database:`, err)
      process.exit(1)
    }
  }

  connect()
  mongoose.connection.on("disconnected", connect)
}