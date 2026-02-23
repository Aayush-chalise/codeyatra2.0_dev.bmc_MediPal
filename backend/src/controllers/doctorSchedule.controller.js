import Doctor from "../models/Doctor";
import DoctorSchedule from "../models/DoctorSchedule";  
import Appointment from "../models/Appointment";        



function convertTimeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}


export const IsDoctorAvaliable = async (doctorId , appointmentDate,appointmentTime) => {
  try {

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const appointmentDay = new Date(appointmentDate).toLocaleDateString(
         "en-US", { weekday: "long" } );

    if (!doctor.schedule.workingDays.includes(appointmentDay)) {
     console.log("Doctor does not work on this day");
      return false; 
    }

    const appointmentTimeMinutes = convertTimeToMinutes(appointmentTime);
    const workingHoursStartMinutes = convertTimeToMinutes(doctor.schedule.workingHours.start);
    const workingHoursEndMinutes = convertTimeToMinutes(doctor.schedule.workingHours.end);
    if (appointmentTimeMinutes < workingHoursStartMinutes || appointmentTimeMinutes >= workingHoursEndMinutes) {
        console.log("Appointment time is outside of doctor's working hours");
      return false; 
    }

    const existingAppointment = await Appointment.findOne({
        doctorId,
        appointmentDate,
        appointmentTime,
        status: "confirmed",
    });
    if (existingAppointment) {
        console.log("Doctor is already booked for this time slot");
        return false; 
    }
    console.log("Doctor is available for this time slot");
    return true;
  } catch (error) {
    console.error("Error checking doctor availability:", error);
    return false;
  }
}


export const getDoctorSchedule = async (req, res) => {
    try {
        const { doctorId , appointmentDate } = req.body;
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        const schedule =  DoctorSchedule.findOne({ doctor: doctorId }).populate("doctor", "fullName specialization department");
    } catch (error) {
        console.error("Error fetching doctor schedule:", error);
        res.status(500).json({ message: "Failed to fetch doctor schedule" });
    }
}


export const avaliableSlots = async (req, res) => {
    try {
        const { doctorId, appointmentDate } = req.body;
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const schedule = await DoctorSchedule.findOne({ doctor: doctorId });
        if (!schedule) {
            return res.status(404).json({ message: "Doctor schedule not found" });
        }

        const bookedAppointments = doctor.bookedSlots.filter(appointment => appointment.date === appointmentDate);

        const availableSlots = generateSlots(
            doctor.schedule.workingHours,
            doctor.schedule.breakTime,
            doctor.schedule.appointmentDuration,
            bookedAppointments
        );

        res.status(200).json({ availableSlots });
    } catch (error) {
        console.error("Error generating available slots:", error);
        res.status(500).json({ message: "Failed to generate available slots" });
    }
}

const generateSlots = (workingHours, breakTime, duration, bookedAppointments) => {
  const slots = [];

//   function to convert "HH:MM" to total minutes
  const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const startTime = toMinutes(workingHours.start);
  const endTime = toMinutes(workingHours.end);
  const breakStart = toMinutes(breakTime.start);
  const breakEnd = toMinutes(breakTime.end);

  let currentTime = startTime;

  while (currentTime + duration <= endTime) {
    const slotStart = currentTime;
    const slotEnd = currentTime + duration;

    // skip if slot overlaps with break time
    if (slotStart < breakEnd && slotEnd > breakStart) {
      currentTime = breakEnd;
      continue;
    }

   //   check if slot overlaps with any booked appointment

    const isOverlapping = bookedAppointments.some(appointment => {
      const appointmentStart = toMinutes(appointment.time);
      const appointmentEnd = appointmentStart + duration;
      return slotStart < appointmentEnd && slotEnd > appointmentStart;
    });

    if (!isOverlapping) {
      const hours = Math.floor(slotStart / 60);
      const minutes = slotStart % 60;
    //   we wanr 09:26 , padding with zero if needed
      const timeString = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      slots.push(timeString);
    }

    currentTime += duration;
  }

  return slots;
};