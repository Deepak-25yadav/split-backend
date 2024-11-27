import express from "express";
import { checkUserAlreadyExist } from "../middlewares/checkUserAlreadyExist.js";
import { checkStrongPassword } from "../middlewares/checkStrongPassword.js";
import { loginUser, registerUser } from "../controllers/userController.js";

const userRouter = express.Router()

userRouter.post("/register",checkUserAlreadyExist,checkStrongPassword,registerUser)

userRouter.post("/login",loginUser)

export {userRouter}