import UserModel from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { HASH_SALT, SECRET_KEY } from '../common/environment.js'

function successResponse(statusCode, status, message, data) {
  return {
    statusCode,
    status,
    message,
    data: json(data)
  }
}

const register = async (req, res) => {

  const { fullName, email, password, contactNumber, role, approvalStatus } = req.body
  // Existing user check
  // Hash password
  // User creation
  // Token generate
  try {
    const existingUser = await UserModel.findOne({ email: email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const data = await UserModel.create({
      fullName: fullName,
      email: email,
      contactNumber: contactNumber,
      role: role,
      password: hashedPassword,
      approvalStatus: approvalStatus
    })
    res.status(201).json({ status: true, message: "User crate successfully", data })

  } catch (error) {
    console.log(error);
    res.status(500).json(error.message)
  }
}
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    var data = await UserModel.findOne({ email: email });

    if (!data) {
      return res.status(400).json({ message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, data.password);

    if (!matchPassword) {
      return res.status(400).json({ message: "Your username and password are incorrect!" });
    }

    const token = jwt.sign({ email: data.email, id: data._id }, SECRET_KEY);

    return res.status(200).json({
      status: true,
      message: "Login successfully",
      data: { ...data._doc, token: token }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await UserModel.find({})
    res.status(200).json(users)
  } catch (error) {
    console.log(error);
  }
}

const forgetPassword = async (req, res) => {
  try {
    const { id, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)
    await UserModel.findByIdAndUpdate(id, {
      $set: { password: hashedPassword }
    },
      {
        new: true,
        useFindAndModify: false
      }
    )
    res.status(201).json({ status: true, message: "Password update successfully" })

  } catch (error) {
    console.log(error);
    res.status(400).send(error.message)
  }

}

const statusUpdate = async (req, res) => {

  try {
    const { role, id, approvalStatus } = req.body;
    const updateDetails = await UserModel.findByIdAndUpdate(id, {
      $set: { role: role, approvalStatus: approvalStatus }
    },
      {
        new: true,
        useFindAndModify: false
      }
    )
    res.status(201).json({ status: true, message: "Approval successfully" })
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message)
  }


}

export { register, login, allUsers, statusUpdate, forgetPassword }
