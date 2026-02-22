import express from 'express';
import dotenv from 'dotenv';
// import cors from 'cors';
import { connectDB } from './config/db.js';
import appointmentRoutes from './routes/appointment.route.js';

dotenv.config();

const app = express();

// Middleware
// app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Health Check
app.get('/', (req, res) => {
  res.send('MediPal API is running...');
});

app.get("/chat", (req, res) => {

}

// Routes
app.use('/', appointmentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});