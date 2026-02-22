import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema({
    patient_name: { type: String, required: true },
    phone: { type: String, required: true },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    slot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot', required: true },
    status: {
        type: String,
        enum: ['waiting', 'assigned', 'cancelled'],
        default: 'waiting'
    }
}, { timestamps: true });

export default mongoose.model('Waitlist', waitlistSchema);
