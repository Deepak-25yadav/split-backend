
// New updated schema of groupExpenseModel.js after removing name and email from groupMembers.

import mongoose from "mongoose";

const groupExpenseSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    expenseDescription: {
      type: String,
      required: true,
      trim: true,
    },
    expenseCreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupMembers: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        paymentAmount: {
          type: Number,
          required: true,
          min: 0,
        },
        paymentStatus: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const GroupExpense = mongoose.model("GroupExpense", groupExpenseSchema);

export default GroupExpense;

