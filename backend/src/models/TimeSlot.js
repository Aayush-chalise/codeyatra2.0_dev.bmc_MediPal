import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    capacity: { type: Number, required: true, default: 1 },
    booked_count: { type: Number, required: true, default: 0 },
}, { timestamps: true, optimisticConcurrency: true });

export default mongoose.model('TimeSlot', timeSlotSchema);
