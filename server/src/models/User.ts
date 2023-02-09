import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  email: string,
  username: string,
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
})

export default mongoose.model<IUser>("User", UserSchema)