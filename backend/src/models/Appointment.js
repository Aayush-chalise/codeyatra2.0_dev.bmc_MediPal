import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },

  appointmentDate: {
    type: String,
    required: true,
  },

  appointmentTime: {
    type: String,
    required: true,
  },

  consultationType: {
    type: String,
    enum: ["physical", "online"],
  },

  symptoms: {
    type: String,
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },

  cancellationReason: {
    type: String,
  },

  cancelledAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { 
    timestamps: true 
 });

export default mongoose.model("Appointment", appointmentSchema);