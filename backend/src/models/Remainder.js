const reminderSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },

  reminderTime: Date,

  type: {
    type: String,
    enum: ["email", "sms"],
  },

  isSent: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});