import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  fullName: {
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
  approvalStatus: {
    type: Boolean,
    require: true,
  },
}, { timestamps: true })

const UserModel = mongoose.model('User', userSchema)
export default UserModel