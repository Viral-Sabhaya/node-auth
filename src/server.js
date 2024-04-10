import express from 'express';
import router from './routes/router.js';
import dbConnection from './connection/db.js';
import { PORT } from './common/environment.js'
const app = express();
import passport from 'passport';
app.use(express.json());
app.use("/", router)
app.use(passport.initialize());
app.listen(PORT, async () => {
  console.log(`server listening on http://localhost:${PORT}`);
  await dbConnection()
})

