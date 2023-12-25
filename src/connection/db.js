import mongoose from "mongoose";
import { DB_URL } from '../common/environment.js'
const dbConnection = async () => {
  try {
    await mongoose.connect(DB_URL)
    console.log("DB connection established");
  } catch (error) {
    console.log(error);
  }
}

export default dbConnection;