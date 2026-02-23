import Appointment from "../models/Appointment.js";

export const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, appointmentTime, consultationType } = req.body;

    if(!patientId || !doctorId || !appointmentDate || !appointmentTime || !consultationType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    //  check doctor availability
    const isAvailable = await IsDoctorAvaliable(doctorId, appointmentDate, appointmentTime);
    if (!isAvailable) {
      return res.status(400).json({ message: "Doctor is not available for this time slot" });
    }

    const newAppointment = await  Appointment.create ({
      patient: patientId,
      doctor: doctorId,
      appointmentDate,
      appointmentTime,
      consultationType
    });
    // update the doctor's booked slots
    const doctor = await Doctor.findById(doctorId);
    doctor.bookedSlots.push({ date: appointmentDate, time: appointmentTime, bookedAt: new Date() });
    await doctor.save();

    res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Failed to create appointment" });
  } 
}

//  get user appointments
export const getAppointments = async (req, res) => {
  try {
    const { userId } = req.query;
    if(!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }
    const appointments = await Appointment.find({ patient: userId }).populate("doctor", "fullName specialization datt");
    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
}

