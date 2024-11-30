import express from "express";
import { createGroup, getGroupDetails, getUserGroups } from "../controllers/groupsController.js";
import userVerify from "../middlewares/userVerify.js";

const groupsRouter = express.Router();

// Route to create a group
groupsRouter.post("/create", userVerify, createGroup);

// Route to get details of a specific group by group ID
groupsRouter.get("/:groupId", userVerify, getGroupDetails);

// Route to get all groups the user is part of
groupsRouter.get("/", userVerify, getUserGroups);

export { groupsRouter };
