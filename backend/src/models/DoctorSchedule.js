const doctorScheduleSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },

  date: String,

  slots: [
    {
      time: String,
      isBooked: {
        type: Boolean,
        default: false,
      }
    }
  ]
});