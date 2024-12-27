import Admin from "../models/adminModel.js";


const checkAdminAlreadyExist = async (req, res, next) => {

  const { email } = req.body;

  const adminExist = await Admin.findOne({ email: email });

  console.log("adminExist>>", adminExist);
  
  if (adminExist) {
    return res.status(409).json({ message: `This admin ${email} account is already exists` }); 
  }
  next();
};

export { checkAdminAlreadyExist };
