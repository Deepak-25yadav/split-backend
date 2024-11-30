import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const userVerify = async (req, res, next) => {
    console.log("req.headers.authorization",req.headers.authorization)
  const token = req.headers.authorization?.split(" ")[1]; // Get token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify and decode the token
    req.user = {
      userId: decoded.userId,
      userName: decoded.userName,
      userEmail: decoded.userEmail,
    };
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error });
  }
};

export default userVerify;
