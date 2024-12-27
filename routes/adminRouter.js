import express from "express";
import { checkAdminAlreadyExist } from "../middlewares/checkAdminAlreadyExist.js";
import { checkStrongPassword } from "../middlewares/checkStrongPassword.js";
import { registerAdmin } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/register", checkAdminAlreadyExist, checkStrongPassword, registerAdmin);

export { adminRouter };

