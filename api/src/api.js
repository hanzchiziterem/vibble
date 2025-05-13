import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectToDatabase } from './lib/db.connect.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT;

//Enables you to parse user data from body.
app.use(express.json());

//To be able to grab the token for the cookies
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("api/message", messageRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    connectToDatabase();
})