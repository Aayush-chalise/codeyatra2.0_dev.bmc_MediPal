import mongoose from 'mongoose';
import TimeSlot from '../models/TimeSlot.js';
import Appointment from '../models/Appointment.js';
import Waitlist from '../models/Waitlist.js';
import Doctor from '../models/Doctor.js';

export const getAvailableSlots = async (req, res) => {
    try {
        const { doctor_id, date } = req.query;
        let query = {
            start_time: { $gte: new Date() },
            $expr: { $lt: ['$booked_count', '$capacity'] }
        };

        if (doctor_id) query.doctor_id = doctor_id;

        // basic date filtering
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.start_time = { $gte: startDate, $lt: endDate };
        }

        const slots = await TimeSlot.find(query).populate('doctor_id', 'name');
        res.status(200).json({ success: true, data: slots });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const bookAppointment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { patient_name, phone, doctor_id, slot_id } = req.body;

        const slot = await TimeSlot.findById(slot_id).session(session);
        if (!slot) {
            throw new Error('Slot not found');
        }

        if (slot.status === 'cancelled') {
            throw new Error('Slot is cancelled');
        }

        // Check capacity
        if (slot.booked_count >= slot.capacity) {
            // Smart Waitlist Feature
            const waitlistEntry = new Waitlist({
                patient_name,
                phone,
                doctor_id,
                slot_id,
                status: 'waiting'
            });
            await waitlistEntry.save({ session });
            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({
                success: true,
                message: 'Slot full. Added to waitlist.',
                waitlisted: true
            });
        }

        // Increment booked count
        slot.booked_count += 1;
        await slot.save({ session });

        // Create appointment
        const appointment = new Appointment({
            patient_name,
            phone,
            doctor_id,
            slot_id,
            status: 'booked'
        });
        await appointment.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ success: true, data: appointment });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ success: false, message: error.message });
    }
};

export const cancelAppointment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { appointment_id } = req.body;
        const appointment = await Appointment.findById(appointment_id).session(session);

        if (!appointment || appointment.status === 'cancelled') {
            throw new Error('Valid appointment not found');
        }

        appointment.status = 'cancelled';
        await appointment.save({ session });

        const slot = await TimeSlot.findById(appointment.slot_id).session(session);

        // Smart Waitlist Auto-Assign
        const nextInWaitlist = await Waitlist.findOne({
            slot_id: slot._id,
            status: 'waiting'
        }).sort({ createdAt: 1 }).session(session);

        if (nextInWaitlist) {
            // We assign it to the waitlist person
            nextInWaitlist.status = 'assigned';
            await nextInWaitlist.save({ session });

            const newAppointment = new Appointment({
                patient_name: nextInWaitlist.patient_name,
                phone: nextInWaitlist.phone,
                doctor_id: nextInWaitlist.doctor_id,
                slot_id: nextInWaitlist.slot_id,
                status: 'booked'
            });
            await newAppointment.save({ session });
            // We don't change the slot.booked_count because it's replaced
        } else {
            // Just decrement capacity
            if (slot.booked_count > 0) {
                slot.booked_count -= 1;
                await slot.save({ session });
            }
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: 'Appointment cancelled successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getAppointments = async (req, res) => {
    try {
        const { phone } = req.query; // Usually you'd get this from authenticated user token
        const query = phone ? { phone } : {};

        const appointments = await Appointment.find(query)
            .populate('doctor_id', 'name')
            .populate('slot_id', 'start_time end_time');

        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Advanced Automation Features: AI Slot Optimization
// Simple simulation predicting high demand and suggesting more slots
export const optimizeSlots = async (req, res) => {
    try {
        // Group slots by hour to find the most demanded ones
        const demandStats = await Appointment.aggregate([
            {
                $lookup: {
                    from: 'timeslots',
                    localField: 'slot_id',
                    foreignField: '_id',
                    as: 'slot'
                }
            },
            { $unwind: '$slot' },
            {
                $group: {
                    _id: { $hour: '$slot.start_time' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Simple heuristic: if any hour has very high appointments, suggest more capacity
        const suggestions = demandStats.map(stat => ({
            hour: stat._id,
            demand_level: stat.count > 10 ? 'High' : stat.count > 5 ? 'Medium' : 'Low',
            suggestion: stat.count > 10 ? `Increase capacity or add more slots at ${stat._id}:00` : 'Sufficient capacity'
        }));

        res.status(200).json({ success: true, data: suggestions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
