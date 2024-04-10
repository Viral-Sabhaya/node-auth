import { register, login, allUsers, changePassword, statusUpdate, forgetPassword, userUpdate } from '../controllers/user.controller.js';
import express from 'express';
import authorization from '../middleware/authorization.js';
import passport from 'passport';
import initializePassport from '../middleware/initializingPassport.js';
import { SECRET_KEY } from '../common/environment.js';

initializePassport(passport, SECRET_KEY)
const userRouter = express.Router()

userRouter.post('/login', login)
userRouter.post('/register', register)
userRouter.post('/forgetPassword', forgetPassword)
userRouter.post('/changePassword', authorization, changePassword)
userRouter.post('/user/update', authorization, userUpdate)
userRouter.post('/status/update', authorization, statusUpdate)
userRouter.get('/allUser', passport.authenticate('jwt', { session: false }), allUsers)

export default userRouter