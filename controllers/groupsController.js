

import Group from "../models/groupsModel.js";
import User from "../models/userModel.js";



const createGroup = async (req, res) => {
  const { groupName, groupMembers } = req.body;
  const userId = req.user.userId;

  // console.log("groupMembers",groupMembers)

  try {
    
   if (!groupName) {
      return res.status(400).json({ message: "Group name is required" });
    }

    if (!groupMembers) {
      return res.status(400).json({ message: "Group members are required" });
    }

    if (groupMembers.length === 0) {
      return res.status(400).json({ message: "Group must have at least one member" });
    }
    
    const creator = await User.findById(userId);
      
    // console.log("creator of group",creator)

    if (!creator) {
      return res.status(404).json({ message: "User not found" });
    }
    
    
    // Extract only member IDs from groupMembers array 
    const memberIds = groupMembers.map((member) => member._id);
    memberIds.push(creator._id)
    

    // Create the group with only IDs for members and creator
    const newGroup = new Group({
      groupName,
      groupMembers: memberIds,
      groupCreated: creator._id,
    });

    await newGroup.save();

    
    return res.status(201).json({
      message: "Group created successfully",
      group: {
        ...newGroup.toObject(),
        groupMembers: groupMembers, 
        groupCreated: {
          name: creator.name,
          email: creator.email,
          _id: creator._id,
        },
      },
    });
  } catch (error) {
    console.error("Error creating group:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};






const getGroupDetails = async (req, res) => {
  const { groupId } = req.params;

  try {
    
    const group = await Group.findById(groupId)
      .populate("groupMembers", "name email") 
      .populate("groupCreated", "name email") 
      .select("groupName groupMembers groupCreated createdAt updatedAt");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    
    const reshapedGroupMembers = group.groupMembers.map((member) => ({
      _id: member._id,
      name: member.name,
      email: member.email,
    }));

    return res.status(200).json({
      message: "Group details retrieved successfully",
      group: {
        ...group.toObject(),
        groupMembers: reshapedGroupMembers,
      },
    });
  } catch (error) {
    console.error("Error retrieving group details:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};








const getUserGroups = async (req, res) => {
  const userId = req.user.userId; 
  // console.log("userId>>>",userId)

  try {
    // Find groups where the user is a member
    const groups = await Group.find({
      groupMembers: userId, 
    })
      .populate({
        path: "groupCreated",
        select: "name email", // Populate the creator's name and email
      })
      .select("groupName _id groupCreated"); 

      // console.log("groups>>>>",groups)

  
    const groupDetails = groups.map((group) => ({
      groupName: group.groupName,
      groupId: group._id,
      groupCreated: group.groupCreated, 
    }));

    // console.log("groupDetails >> ",groupDetails)
    
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

