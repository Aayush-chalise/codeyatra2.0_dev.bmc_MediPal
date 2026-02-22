import { analyzeSymptoms } from "../controllers/gemini.controller.js";
import express from "express";

const router = express.Router();
router.post("/symptoms/analyze", analyzeSymptoms);

export default router;
