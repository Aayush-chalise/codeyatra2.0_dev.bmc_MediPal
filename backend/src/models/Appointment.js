import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    required: true,
    unique: true,
  },

  confirmationNumber: {
    type: String,
    required: true,
  },

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
    default: "confirmed",
  },

  cancellationReason: {
    type: String,
  },

  cancelledAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("Appointment", appointmentSchema);