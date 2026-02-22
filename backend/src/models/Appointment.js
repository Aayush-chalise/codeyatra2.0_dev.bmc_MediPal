import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patient_name: { type: String, required: true },
    phone: { type: String, required: true },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    slot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot', required: true },
    status: {
        type: String,
        enum: ['booked', 'cancelled', 'completed'],
        default: 'booked'
    }
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
