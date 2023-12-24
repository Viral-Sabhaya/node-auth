import AuthModel from "../models/auth.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const HASH_SALT = process.env.HASH_SALT
const SECRET_KEY = process.env.SECRET_KEY

const register = async (req, res) => {

  const { name, surname, email, password, contactNumber, role } = req.body
  // Existing user check
  // Hash password
  // User creation
  // Token generate
  try {
    const existingUser = await AuthModel.findOne({ email: email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await AuthModel.create({
      name: name,
      surname: surname,
      email: email,
      contactNumber: contactNumber,
      role: role,
      password: hashedPassword,
    })

    const token = jwt.sign({ email: result.emil, id: result._id }, SECRET_KEY)
    res.status(201).json({ user: result, token: token, message: "User crate successfully" })

  } catch (error) {
    console.log(error);
    res.status(500).json(error.message)
  }
}
const login = (req, res) => {
  res.send("sdjhfjsdhjfhsk")
}

export { register, login }
