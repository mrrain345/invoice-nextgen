import mongoose, { Schema } from "mongoose"
import validator from "validator"

export interface IUser {
  email: string,
  username: string,
  password?: string,
  refreshTokens?: string[],
  createdAt?: Date,
  updatedAt?: Date,
}

const schema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => {
        return validator.isEmail(email)
      }
    }
  },
  username: {
    type: String,
    required: true,
    validate: {
      validator: (username: string) => {
        return username.length >= 3
      }
    }
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  refreshTokens: {
    type: [String],
    required: true,
    select: false,
    default: [],
  },
}, { timestamps: true })

export default mongoose.model<IUser>("User", schema)