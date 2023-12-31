import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../common/environment.js'

const authorization = async (req, res, next) => {
  try {
    let token = req.headers.authorization
    if (token) {
      let userToken = token.split(" ")[1]
      let user = await jwt.verify(userToken, SECRET_KEY);
      req.userId = user.id
    } else {
      res.status(401).json({ status: false, message: "Unauthorized user!" })
    }
    next()
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: false, message: "Unauthorized user!" })

  }

}

export default authorization;