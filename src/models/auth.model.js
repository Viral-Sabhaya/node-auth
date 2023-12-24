import mongoose from "mongoose";

const authSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  surname: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  contactNumber: {
    type: String,
    require: true,
    unique: true
  },
  role: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
}, { timestamp: true })

const AuthModel = mongoose.model('Auth', authSchema)
export default AuthModel