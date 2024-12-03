import express from "express";

import { createGroup, getGroupDetails, getUserGroups } from "../controllers/groupsController.js";

import userVerify from "../middlewares/userVerify.js";

const groupsRouter = express.Router();


groupsRouter.post("/create", userVerify, createGroup);


groupsRouter.get("/:groupId", userVerify, getGroupDetails);


groupsRouter.get("/", userVerify, getUserGroups);

export { groupsRouter };
