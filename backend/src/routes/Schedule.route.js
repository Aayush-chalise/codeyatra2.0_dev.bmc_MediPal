import { avaliableSlots } from "../controllers/doctorSchedule.controller.js";
import express from "express";

const router = express.Router();

router.post("/availableSlots", avaliableSlots);

export default router;