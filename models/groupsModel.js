
// updated Schema after removing name and email only have kept groupMembersId at groupMembers field.

import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      trim: true,
    },
    groupMembers: [
      {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true,
      },
    ],
    groupCreated: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;

