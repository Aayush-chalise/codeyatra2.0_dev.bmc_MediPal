import { getDoctors } from "../controllers/Doctor.controller.js";

import express from "express";

const router = express.Router();

router.get("/doctors", getDoctors);

export default router;