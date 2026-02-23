import { getDoctors , createDoctor} from "../controllers/Doctor.controller.js";
import express from "express";
const router = express.Router();

router.post("/addDoctor", createDoctor);
router.get("/doctors", getDoctors);

export default router;