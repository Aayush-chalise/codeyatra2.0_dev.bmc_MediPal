import { request } from "express";
import user from "../models/user.js";
import { generateToken } from "../utils/token.js";

export const createUser = async (req, res) => {
  const { fullName, email, phone, password, address } = req.body;
  console.log(req.body);
  try {
    let userExists = await user.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    const newUser = await user.create({
      fullName,
      email,
      phone,
      password,
      address,
    });
    res.status(201).json({
      id: newUser._id,
      role: newUser.role,
      token: generateToken(newUser._id, newUser.role),
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const User = await user.findOne({ email });

  if (User && (await User.matchPassword(password))) {
    res.json({
      id: User._id,
      role: User.role,
      token: generateToken(User._id, User.role),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};
