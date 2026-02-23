import express from 'express';
import { createAppointment  , getAppointments} from '../controllers/appointment.controller.js';

const router = express.Router();

router.post('/book', createAppointment);
router.get('/', getAppointments);



export default router;
