import Group from "../models/groupsModel.js";
import User from "../models/userModel.js";

// Controller to create a new group
const createGroup = async (req, res) => {
  const { groupName, groupMembers } = req.body;
  const userId = req.user.userId; // Extracted from userVerify middleware

  try {
    // Validate the groupName and groupMembers
    if (!groupName || !groupMembers || groupMembers.length === 0) {
      return res
        .status(400)
        .json({ message: "Group name and members are required" });
    }

    // Find the user who is creating the group
    const creator = await User.findById(userId);
    if (!creator) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const groupCreatorObj={name:creator.name, email:creator.email, _id:creator._id}
    groupMembers.push(groupCreatorObj)
    // Create and save the new group
    const newGroup = new Group({
      groupName,
      groupMembers,
      groupCreated: {
        name: creator.name,
        email: creator.email,
        _id: creator._id,
      },
    });

    await newGroup.save();

    return res.status(201).json({
      message: "Group created successfully",
      group: newGroup,
    });
  } catch (error) {
    console.error("Error creating group:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};







const getGroupDetails = async (req, res) => {
    const { groupId } = req.params;
  
    try {
      // Populate groupMembers to include their name, email, and _id details
      const group = await Group.findById(groupId)
        .populate("groupMembers._id", "name email") // Populate the `_id` field in each member
        .select("groupName groupMembers groupCreated createdAt updatedAt");
  
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
  
      // Reshape the `groupMembers` array to match the desired output
      const reshapedGroupMembers = group.groupMembers.map(member => ({
        _id: member._id._id, // Extract the _id from the populated object
        name: member._id.name,
        email: member._id.email,
      }));
  
      return res.status(200).json({
        message: "Group details retrieved successfully",
        group: {
          ...group.toObject(), // Convert the Mongoose document to a plain object
          groupMembers: reshapedGroupMembers, // Replace the groupMembers array with the reshaped version
        },
      });
    } catch (error) {
      console.error("Error retrieving group details:", error);
      return res.status(500).json({ message: "Something went wrong", error });
    }
  };
  





// Controller to get all groups a user is part of
const getUserGroups = async (req, res) => {
    const userId = req.user.userId; // Extracted from userVerify middleware
  
    try {
      // Find all groups where the user is a member
      const groups = await Group.find({
        "groupMembers._id": userId, // Check if the user's ID exists in the `groupMembers` array
      }).select("groupName _id groupCreated"); // Select only the required fields
  
      // Map the result to include only required details
      const groupDetails = groups.map((group) => ({
        groupName: group.groupName,
        groupId: group._id,
        groupCreated: group.groupCreated,
      }));
  
      return res.status(200).json({
        message: "Groups retrieved successfully",
        groups: groupDetails,
      });
    } catch (error) {
      console.error("Error retrieving user groups:", error);
      return res.status(500).json({ message: "Something went wrong", error });
    }
  };
  




  export { createGroup, getGroupDetails, getUserGroups };

