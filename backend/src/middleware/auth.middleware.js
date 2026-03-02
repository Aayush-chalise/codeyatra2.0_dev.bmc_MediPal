// middleware/auth.js
import jwt from "jsonwebtoken";
import user from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

const protect = async (req, res, next) => {
  let token;
  console.log("hello");
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // get the token after 'Bearer'
      console.log(token);
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);

      // Attach user to request
      req.user = await user.findById(decoded.id).select("-password");
      console.log("Authenticated user:", req.user);
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
  }
};

export default protect;
