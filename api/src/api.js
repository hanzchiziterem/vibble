import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route.js';
import { connectToDatabase } from './lib/db.connect.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT;

//Enables you to parse user data from body.
app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    connectToDatabase();
})