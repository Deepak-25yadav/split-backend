
// New updated schema of groupExpenseModel.js after removing name and email from groupMembers.

// import mongoose from "mongoose";

// const groupExpenseSchema = new mongoose.Schema(
//   {
//     groupId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Group",
//       required: true,
//     },
//     totalAmount: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     expenseDescription: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     expenseCreatedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     groupMembers: [
//       {
//         _id: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//         },
//         paymentAmount: {
//           type: Number,
//           required: true,
//           min: 0,
//         },
//         paymentStatus: {
//           type: Boolean,
//           default: false,
//         },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// const GroupExpense = mongoose.model("GroupExpense", groupExpenseSchema);

// export default GroupExpense;










// Updated schema for groupExpenseModel.js with new fields

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
    expensedDate: {
      type: Date,
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
    payeeMembers: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        payeeAmount: {
          type: Number,
          required: true,
          min: 0,
        },
        balanceAmount: {
          type: Number,
          required: true,
        },
        balanceStatus: {
          type: String,
          enum: ["plus", "minus", "zero"],
          required: true,
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
