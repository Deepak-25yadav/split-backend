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




// Controller to handle adding a friend
const addFriend = async (req, res) => {
  const { friendEmail } = req.body; // Friend's email from the request body
  const userId = req.user.userId; // Get the user ID from the verified token

  try {
    // Find the friend in the database
    const friend = await User.findOne({ email: friendEmail });

    if (!friend) {
      return res.status(404).json({ message: "Friend not found in the database" });
    }

    // Ensure the user and friend are not already friends
    const user = await User.findById(userId);
    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: "This user is already your friend" });
    }

    // Add the friend to the user's friend list
    user.friends.push(friend._id);

    // Add the user to the friend's friend list
    friend.friends.push(user._id);

    // Save both users
    await user.save();
    await friend.save();

    return res.status(200).json({ message: "Friend added successfully", friend });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

// Controller to handle retrieving the friend list
const getFriendList = async (req, res) => {
  const userId = req.user.userId; // Get the user ID from the verified token

  try {
    // Populate the user's friend list
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