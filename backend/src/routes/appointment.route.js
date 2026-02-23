import express from 'express';
import { createAppointment } from '../controllers/appointment.controller';

const router = express.Router();

router.post('/book', createAppointment);

router.get('/available-slots', getAvailableSlots);
router.post('/cancel', cancelAppointment);
router.get('/appointments', getAppointments);
router.get('/optimize-slots', optimizeSlots);

export default router;
