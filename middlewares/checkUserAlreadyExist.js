import User from "../models/userModel.js";

const checkUserAlreadyExist = async (req, res, next) => {

  const { email } = req.body;

  const userExist = await User.findOne({ email: email });

  console.log("userExist>>", userExist);
  
  if (userExist) {
    return res.status(409).json({ message: "This account already exists" }); 
  }
  next();
};

export { checkUserAlreadyExist };
