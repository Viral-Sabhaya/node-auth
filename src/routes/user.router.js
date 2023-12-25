import { register, login } from '../controllers/user.controller.js';
import express from 'express';
const userRouter = express.Router()

userRouter.post('/login', login)
userRouter.post('/register', register)

export default userRouter