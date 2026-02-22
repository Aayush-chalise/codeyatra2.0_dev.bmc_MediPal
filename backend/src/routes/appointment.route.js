import express from 'express';
import {
    getAvailableSlots,
    bookAppointment,
    cancelAppointment,
    getAppointments,
    optimizeSlots
} from '../controllers/appointment.controller.js';

const router = express.Router();

router.get('/available-slots', getAvailableSlots);
router.post('/book', bookAppointment);
router.post('/cancel', cancelAppointment);
router.get('/appointments', getAppointments);
router.get('/optimize-slots', optimizeSlots);

export default router;
