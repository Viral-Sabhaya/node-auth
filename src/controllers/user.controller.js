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

    const hashedPassword = await bcrypt.hash(password, 10)

    const data = await UserModel.create({
      fullName: fullName,
      email: email,
      contactNumber: contactNumber,
      role: role,
      password: hashedPassword,
      approvalStatus: false
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
      return res.status(400).json({ status: false, message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, data.password);

    if (!matchPassword) {
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
    const users = await UserModel.find({})
    res.status(200).send({ code: 200, status: true, message: "Fetch all users successfully", data: users })
  } catch (error) {
    console.log(error);
  }
}

const changePassword = async (req, res) => {
  try {
    const { id, password, newPassword } = req.body;
    const user = await UserModel.find({ _id: id })
    if (user.length === 0) {
      return res.status(404).send({ status: false, message: "User not found" })
    }
    const comparePassword = await bcrypt.compare(password, user[0].password)

    if (!comparePassword) {
      return res.status(404).json({ status: false, message: "Password not match" })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await UserModel.findByIdAndUpdate(id, {
      $set: { password: hashedPassword }
    },
      {
        new: true,
        useFindAndModify: false
      }
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
    const user = await UserModel.find({ "email": email, "contactNumber": contactNumber })

    if (!user) {
      return res.send(404).json({ status: false, message: "User not found" })
    }
    const comparePassword = await bcrypt.compare(password, user[0].password)

    if (!comparePassword) {
      return res.status(404).json({ status: false, message: "Password not match" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const forgetPass = await UserModel.findOneAndUpdate(
      { email: email, contactNumber: contactNumber },
      { password: hashedPassword },
      { new: true }
    )
    return res.status(200).json({ status: true, message: "Password update successfully!" })
  } catch (error) {
    console.log(error);
  }

}

const userUpdate = async (req, res) => {

  try {
    const { id, fullName, email, contactNumber } = req.body;
    const user = await findUser(id, res)
    if (user) {
      const updateDetails = await UserModel.findByIdAndUpdate(id, {
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
