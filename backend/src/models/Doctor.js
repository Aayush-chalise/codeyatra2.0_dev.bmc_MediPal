import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phone: {
    type: String,
  },

  specialization: {
    type: String,
  },

  department: {
    type: String,
  },

  experienceYears: {
    type: Number,
  },

  consultationFee: {
    type: Number,
  },

  schedule: {
    workingDays: {
      type: [String], // ["Monday", "Tuesday"]
      required: true,
    },

    workingHours: {
      start: String, // "09:00"
      end: String,   // "17:00"
    },

    breakTime: {
      start: String,
      end: String,
    },

    appointmentDuration: {
      type: Number, // minutes
      default: 30,
    }
  },

  bookedSlots: [
    {
      date: String,
      time: String,
      bookedAt: Date,
    }
  ],

  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("Doctor", doctorSchema);