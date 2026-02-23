import { sumarrizeMedicalReport } from "../controllers/file.controller.js";
import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer( { storage: multer.memoryStorage() } );

router.post("/summarize", upload.single("file"), sumarrizeMedicalReport);

export default router;