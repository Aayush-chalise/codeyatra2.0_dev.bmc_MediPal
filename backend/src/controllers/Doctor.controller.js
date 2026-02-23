import Doctor from "../models/Doctor.js";

export const createDoctor = async (req, res) => {
    const { name, email ,  specialization, department, schedule } = req.body;
    try { 
       let  doctorExists = await Doctor.findOne({ email });
        if (doctorExists) {
            return res.status(400).json({ message: "Doctor with this email already exists" });
        }
        const newDoctor = await Doctor.create({

            fullName: name,
            email,
            specialization,
            department, 
            schedule,
        });
        res.status(201).json({ message: "Doctor created successfully", doctor: {
             message: "Doctor created successfully",
             doctor: {
             fullName: newDoctor.fullName,
             email: newDoctor.email,
             id : newDoctor._id,
        } }});
    } catch (error) {
        console.error("Error creating doctor:", error);
        res.status(500).json({ message: "Failed to create doctor" });
    }
}
    

export const getDoctors = async (req, res) => {
    try {
        console.log( req.query.department);
        const doctors = await Doctor.find({ department: req.query.department });
        console.log(req.query.department);
        res.json({ doctors });
        console.log(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: "Failed to fetch doctors" });
    }
}