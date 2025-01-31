import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';
import Admin from '../models/adminModel.js';
import { sendEmailToAdmin } from '../services/sendEmail.js';
import { sendTwillioMessageToAdmin } from '../services/sendTwillioMessage.js';
// import Admin from '../models/adminModel.js';





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



    
    
    const sanitizedUserDetails = {
      _id: userDetails._id,
      name: userDetails.name,
      email: userDetails.email,
      createdAt: userDetails.createdAt,
      updatedAt: userDetails.updatedAt,
    };

    const admin = await Admin.findOne(); 
    console.log("admin inside userRegister function",admin)
    if (admin) {
      admin.usersSignup.push(userDetails._id);
      await admin.save();

      let newGroup=""
      // Send email to admin
      sendEmailToAdmin(admin.email, sanitizedUserDetails, newGroup);
      sendTwillioMessageToAdmin(sanitizedUserDetails,newGroup)
    }

    

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
    
    
    if (!userData) {
      return res.status(400).json({ message: "Please check your email carefully" });
    }

    
    const matchedPassword = await bcrypt.compare(password, userData.password);
    if (!matchedPassword) {
      return res.status(400).json({ message: "Please check your password carefully" });
    }

   
    const token = jwt.sign(
      {
        userId: userData._id,
        userEmail: userData.email,
        userName: userData.name,
      },
      process.env.SECRET_KEY
    );

    
    res.status(200).json({
      message: `${userData.name}, You are logged in successfully.`,
      token: token
    });
    
  } catch (error) {
    res.status(500).json({ message: "Something went wrong during login", error });
  }
};






const userDetails = async (req,res)=>{

  const userId =req.user.userId

  const userData= await User.findOne({_id:userId})

  console.log("userDatat",userData)

  try {
  if(!userData){
    return res.status(400).json({message:"Please check your credential carefully"})
  }
    return res.status(200).json({message:`${userData.name}, You got your details successfully`, userData:userData})
  } catch (error) {
    
  }
}





const addFriend = async (req, res) => {

  const { friendEmail } = req.body; 
  const userId = req.user.userId; 

  try {
    
    const friend = await User.findOne({ email: friendEmail });

    if (!friend) {
      return res.status(404).json({ message: "Friend not found in the database" });
    }

    
    const user = await User.findById(userId);


    if(user._id.equals(friend._id)){
      return res.status(400).json({message:"You can not add yourself in your friend contact"})
     }

    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: "This user is already your friend" });
    }

    
    user.friends.push(friend._id);

    
    friend.friends.push(user._id);

    
    await user.save();
    await friend.save();

    return res.status(200).json({ message: "Friend added successfully", friend });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};






const getFriendList = async (req, res) => {
  
  const userId = req.user.userId; 

  try {
    
    const user = await User.findById(userId).populate("friends", "name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Friend list retrieved successfully", friends: user.friends });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};





export {registerUser, loginUser, addFriend, getFriendList, userDetails}


