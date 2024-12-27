import bcrypt from "bcrypt";
// import nodemailer from "nodemailer";
// import Admin from "../models/adminModel.js";
// import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";

const registerAdmin = async (req, res) => {
  const { name, email, password, mobile, countryCode } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 7);

    const newAdmin = new Admin({
      name,
      email,
      password: hashPassword,
      mobile,
      countryCode,
    });

    await newAdmin.save();

    return res.status(201).json({
      message: `${name}, you are registered successfully as an admin.`,
      adminDetails: newAdmin,
    });
  } catch (error) {
    console.error("Error registering admin:", error);
    return res.status(500).json({ message: "Error registering admin", error });
  }
};






export { registerAdmin };