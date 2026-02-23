import { createDoctor } from "../controllers/Doctor.controller.js";
import { createUser } from "../controllers/User.controller.js";
import express from "express";

const router = express.Router();

router.post("/adduser", createUser);
router.post("/addDoctor", createDoctor);

export default router;