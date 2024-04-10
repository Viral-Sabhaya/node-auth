import UserModel from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { HASH_SALT, SECRET_KEY } from '../common/environment.js'

const findUser = async (id, res) => {
  try {
    const findUser = await UserModel.find({ _id: id })
    if (findUser.length === 0) {
      return res.status(404).send({ status: false, message: "User not found" })
    }
    return true

  } catch (error) {
    console.log("error:>", error);
  }
}

const register = async (req, res) => {

  const { fullName, email, password, contactNumber, role } = req.body
  // Existing user check
  // Hash password
  // User creation
  // Token generate
  try {
    const existingUser = await UserModel.findOne({ email: email })
    if (existingUser) {
      return res.status(400).json({ status: false, message: "User already exists" })
    }
    // const hashedPassword = await bcrypt.hash(password, 10)
    const data = await UserModel.create({
      fullName: fullName,
      email: email,
      contactNumber: contactNumber,
      role: role,
      password: password,
      approvalStatus: "pending"
    })

    const token = jwt.sign({ email: data.email, id: data._id }, SECRET_KEY);
    const user = { ...data._doc, token }
    return res.status(201).json({ status: true, message: "User crate successfully", user })

  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message)
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    var data = await UserModel.findOne({ email: email });

    if (!data) {
      return res.status(400).json({ status: false, message: "Your username and password are incorrect!" });
    }

    // const matchPassword = await bcrypt.compare(password, data.password);

    if (password != data.password) {
      return res.status(400).json({ status: false, message: "Your username and password are incorrect!" });
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
    console.log(req.user);
    const users = await UserModel.find({})
    res.status(200).send({ code: 200, status: true, message: "Fetch all users successfully", data: users })
  } catch (error) {
    console.log(error);
  }
}

const changePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = await UserModel.findById({ _id: req.userId })
    if (!user) {
      return res.status(404).send({ status: false, message: "User not found" })
    }
    // const comparePassword = await bcrypt.compare(password, user[0].password)

    if (password != user.password) {
      return res.status(404).json({ status: false, message: "Password not match" })
    }
    // const hashedPassword = await bcrypt.hash(newPassword, 10)
    const updatePassword = await UserModel.updateOne({ _id: req.userId }, {
      $set: { password: newPassword }
    },
      { $currentDate: { lastUpdated: true } }
    )
    res.status(200).json({ status: true, message: "Password update successfully" })

  } catch (error) {
    console.log(error);
    res.status(400).send(error.message)
  }
}

const statusUpdate = async (req, res) => {
  try {
    const { role, id, approvalStatus } = req.body;
    const user = await findUser(id, res)
    if (user) {

      const updateDetails = await UserModel.findByIdAndUpdate(id, {
        $set: { role: role, approvalStatus: approvalStatus }
      },
        {
          new: true,
          useFindAndModify: false
        }
      )
      res.status(201).json({ status: true, message: "Approval successfully" })
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message)
  }
}

const forgetPassword = async (req, res) => {

  const { email, contactNumber, password } = req.body

  try {
    const user = await UserModel.findOne({ "email": email, "contactNumber": contactNumber })
    console.log("user:>", user);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" })
    }
    // const hashedPassword = await bcrypt.hash(password, 10)
    const forgetPass = await UserModel.findOneAndUpdate(user._id,
      { password: password },
      { new: true }
    )
    return res.status(200).json({ status: true, message: "Password update successfully!" })
  } catch (error) {
    console.log(error);
  }

}

const userUpdate = async (req, res) => {

  try {
    const { fullName, email, contactNumber } = req.body;
    const user = await findUser(req.userId, res)
    if (user) {
      const updateDetails = await UserModel.findByIdAndUpdate(req.userId, {
        $set: { fullName: fullName, email: email, contactNumber: contactNumber }
      },
        {
          new: true,
          useFindAndModify: false
        }
      )
      res.status(200).send({ status: true, message: "User data update successfully", data: updateDetails })
    }
  } catch (error) {
    console.log("Error:>", error);
    res.status(400).send(error.message)
  }
}

export { register, login, allUsers, statusUpdate, changePassword, forgetPassword, userUpdate }
