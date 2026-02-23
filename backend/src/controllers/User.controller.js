import user from "../models/user.js";


export const createUser = async (req, res) => {
    const { fullName , email, phone, password, address } = req.body;
    try {
        let userExists = await user.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User with this email already exists" });
        }
        const newUser = await user.create({
            fullName,
            email,
            phone,
            password,
            address,
        });
        res.status(201).json({ message: "User created successfully", user: {
            fullName: newUser.fullName,
            email: newUser.email,
            id : newUser._id,
        } });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Failed to create user" });
    }
}
