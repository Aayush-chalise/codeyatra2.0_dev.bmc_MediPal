// middleware/auth.js
import jwt from "jsonwebtoken"
import user from "../models/user.js";
import { JWT_SECRET } from "../config/env.js";


const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // get the token after 'Bearer'
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Attach user to request
      req.user = await user.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
  }
};

export default protect