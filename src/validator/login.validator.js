import Joi from "joi";
import { validator } from "./validator.js";

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(3).required(),
})

export default validator(authSchema)