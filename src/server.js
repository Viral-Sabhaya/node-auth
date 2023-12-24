import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import router from './routes/router.js';
import dbConnection from './connection/db.js';
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/", router)

app.listen(PORT, async () => {
  console.log(`server listening on http://localhost:${PORT}`);
})

dbConnection()
