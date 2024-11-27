import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';


const registerUser = async (req, res) => {
  const {name,email, password} = req.body;
  console.log("request body", req.body);
  try {
    const hashPassword = await bcrypt.hash(password, 7);
    if (!hashPassword)
      return res.status(400).json({ message: "Invalid email or password" });

    const userDetails = new User({
      name,
      email,
      password: hashPassword,
    });

    await userDetails.save();

    return res.status(201).json({
      message: `${name}, you are registered successfully`,
      userDetails,
    });

  } catch (error) {
    console.log("Error in user registration", error);
    return res.status(500).json({ message: "Something went wrong in Signup", error });
  }
};




const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await User.findOne({ email: email });
    
    // If email is not found
    if (!userData) {
      return res.status(400).json({ message: "Please check your email carefully" });
    }

    // If password doesn't match
    const matchedPassword = await bcrypt.compare(password, userData.password);
    if (!matchedPassword) {
      return res.status(400).json({ message: "Please check your password carefully" });
    }

    // Generate a token
    const token = jwt.sign(
      {
        userId: userData._id,
        userEmail: userData.email,
        userName: userData.name,
      },
      process.env.SECRET_KEY
    );

    // Successful login response
    res.status(200).json({
      message: `${userData.name}, You are logged in successfully.`,
      token: token
    });
    
  } catch (error) {
    res.status(500).json({ message: "Something went wrong during login", error });
  }
};



export {registerUser, loginUser}