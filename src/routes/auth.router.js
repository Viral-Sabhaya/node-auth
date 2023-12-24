import { register, login } from '../controllers/auth.controller.js';
import express from 'express';
const authRouter = express.Router()

authRouter.get('/login', login)
authRouter.post('/register', register)

export default authRouter