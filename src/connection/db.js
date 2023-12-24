import mongoose from "mongoose";
import dotenv from 'dotenv'
import express from 'express';
dotenv.config()
const DB_URL = process.env.DB_URL;

const dbConnection = async () => {
  try {
    await mongoose.connect(DB_URL)
    console.log("DB connection established");
  } catch (error) {
    console.log(error);
  }
}

export default dbConnection;