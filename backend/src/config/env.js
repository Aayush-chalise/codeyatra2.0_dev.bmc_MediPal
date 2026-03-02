import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const GROK_API_KEY = process.env.GROK_API_KEY;
