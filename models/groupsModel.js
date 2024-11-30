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
        email: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    groupCreated: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;


