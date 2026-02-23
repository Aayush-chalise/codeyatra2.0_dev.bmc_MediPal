import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import appointmentRoutes from './routes/appointment.route.js';
import geminiRoutes from './routes/gemini.route.js';
import scheduleRoutes from './routes/Schedule.route.js';
import accountRoutes from './routes/account.route.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Account login and signup routes
app.use("/", accountRoutes)


app.use("/api", geminiRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/account', accountRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});