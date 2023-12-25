import { register, login, allUsers } from '../controllers/user.controller.js';
import express from 'express';
const userRouter = express.Router()

userRouter.post('/login', login)
userRouter.post('/register', register)
userRouter.get('/allUser', allUsers)

export default userRouter