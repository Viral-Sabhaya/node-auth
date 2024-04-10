import { ExtractJwt, Strategy } from 'passport-jwt';
import UserModel from "../models/user.model.js";
const initializePassport = (passport, key) => {
  passport.use(
    new Strategy({
      secretOrKey: key,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
      async function (jwt_payload, next) {
        try {
          const user = await UserModel.findById(jwt_payload.id);
          if (user) {
            next(null, user);
          } else {
            next(null, false);
          }
        } catch (error) {
          next(error, false);
        }
      }
    )
  )
}


export default initializePassport;