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
    required: true,
  },

  department: {
    type: String,
    required: true,
  },

  experienceYears: {
    type: Number,
  },

  consultationFee: {
    type: Number,
  },

  schedule: {
        workingDays: {
          type: [String], 
          required: true,
        },

        workingHours: {
          start: String, 
          end: String,   
        },

        breakTime: {
          start: String,
          end: String,
        },

        appointmentDuration: {
          type: Number, 
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