import { register, login, allUsers, changePassword, statusUpdate, forgetPassword, userUpdate } from '../controllers/user.controller.js';
import express from 'express';
const userRouter = express.Router()

userRouter.post('/login', login)
userRouter.post('/register', register)
userRouter.post('/changePassword', changePassword)
userRouter.post('/forgetPassword', forgetPassword)
userRouter.post('/user/update', userUpdate)
userRouter.post('/status/update', statusUpdate)
userRouter.get('/allUser', allUsers)

export default userRouter