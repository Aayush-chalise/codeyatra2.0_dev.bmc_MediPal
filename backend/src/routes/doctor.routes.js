import { getDoctors } from "../controllers/Doctor.controller.js";

import express from "express";

const router = express.Router();

router.get("/", getDoctors);

export default router;