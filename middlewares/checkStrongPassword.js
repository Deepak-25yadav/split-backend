
const checkStrongPassword = async (req, res, next) => {
    const { password } = req.body;
  
    const isLengthValid = password?.length >= 8;
    if (!isLengthValid) return res.status(400).json({ message: "Password length is less than 8 characters" });
  
    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
  
    const hasLowerCase = /[a-z]/.test(password);
    if (!hasLowerCase) return res.status(400).json({ message: "Password must contain at least one lowercase letter" });
  
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
    if (!hasSpecialChar) return res.status(400).json({ message: "Password must contain at least one special character" });
  
    const hasNumericDigit = /\d/.test(password);
    if (!hasNumericDigit) return res.status(400).json({ message: "Password must contain at least one numeric digit" });
  
    next();
  };
  
  export { checkStrongPassword };
  