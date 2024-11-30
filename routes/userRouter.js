import express from "express";
import { checkUserAlreadyExist } from "../middlewares/checkUserAlreadyExist.js";
import { checkStrongPassword } from "../middlewares/checkStrongPassword.js";
import { addFriend, getFriendList, loginUser, registerUser, userDetails } from "../controllers/userController.js";
import userVerify from "../middlewares/userVerify.js";

const userRouter = express.Router()

userRouter.post("/register",checkUserAlreadyExist,checkStrongPassword,registerUser)

userRouter.post("/login",loginUser)
userRouter.get("/user-details",userVerify,userDetails)

// Route to add a friend
userRouter.post("/add-friend", userVerify, addFriend);

// Route to get the friend list
userRouter.get("/friends", userVerify, getFriendList);

export {userRouter}