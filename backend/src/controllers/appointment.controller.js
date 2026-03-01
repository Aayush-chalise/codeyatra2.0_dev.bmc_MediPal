import Appointment from "../models/Appointment.js";
import { JWT_SECRET } from "../config/env.js";
import Doctor from "../models/Doctor.js";
import jwt from "jsonwebtoken";

export const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate } = req.body;
    const appointmentTime = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    console.log(req.body);

    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // //  check doctor availability
    // const isAvailable = await IsDoctorAvaliable(
    //   doctorId,
    //   appointmentDate,
    //   appointmentTime,
    // );
    // if (!isAvailable) {
    //   return res
    //     .status(400)
    //     .json({ message: "Doctor is not available for this time slot" });
    // }

    // //  lets prase auth header to get patient id
    // const authHeader = req.headers.authorization;
    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }

    // const token = authHeader.split(" ")[1]
    // if (!token){
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    // console.log("Received token:", token);

    const newAppointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
    });
    console.log("New appointment created:", newAppointment);
    // update the doctor's booked slots
    const doctor = await Doctor.findById(doctorId);
    doctor.bookedSlots.push({
      date: appointmentDate,
      time: appointmentTime,
      bookedAt: new Date(),
    });
    await doctor.save();

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Failed to create appointment" });
  }
};

//  get user appointments
export const getAppointments = async (req, res) => {
  try {
    console.log("haosdjof");
    const userId = req.user._id;
    console.log(userId);
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }
    const appointments = await Appointment.find({ patient: userId }).populate(
      "doctor",
      "fullName specialization date",
    );
    console.log("this is app:", appointments);
    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};
