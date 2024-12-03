import express from "express";

import { createGroupExpense, getExpenseDetails, getGroupExpenses, updatePaymentStatus } from "../controllers/groupExpenseController.js";

import userVerify from "../middlewares/userVerify.js";

const groupExpenseRouter = express.Router();


groupExpenseRouter.post("/create-group-expense", userVerify, createGroupExpense);

groupExpenseRouter.get("/:groupId", userVerify, getGroupExpenses);

groupExpenseRouter.get("/single-expense-details/:expenseId", userVerify, getExpenseDetails);

groupExpenseRouter.patch("/update-payment-status", userVerify, updatePaymentStatus);


export {groupExpenseRouter};
