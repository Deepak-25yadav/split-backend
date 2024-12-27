

import Admin from "../models/adminModel.js";
import Group from "../models/groupsModel.js";
import User from "../models/userModel.js";
import { sendEmailToAdmin } from "../services/sendEmail.js";
import { sendTwillioMessageToAdmin } from "../services/sendTwillioMessage.js";



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

    

    // Populate groupMembers and groupCreated
    const populatedGroup = await Group.findById(newGroup._id)
      .populate("groupMembers", "name email")
      .populate("groupCreated", "name email");


    const admin = await Admin.findOne(); 
    // console.log("admin inside createGroup function",admin)
    if (admin) {
      admin.usersGroup.push(newGroup._id);
      await admin.save();
        
      let sanitizedUserDetails=""
      // Send email to admin
      sendEmailToAdmin(admin.email, sanitizedUserDetails, populatedGroup);
      sendTwillioMessageToAdmin(sanitizedUserDetails,populatedGroup)
    }

    
    
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

    let groupResult={
      message: "Group details retrieved successfully",
      group
    }
   console.log("group >> simply have console group from groupDetails function 💁‍♂️💁‍♂️",groupResult)
    
    return res.status(200).json({
      message: "Group details retrieved successfully",
      group
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


    let response ={
      message: "Groups retrieved successfully",
      groups: groupDetails,
    }
    // console.log(" fetch all that groups in those groups this particular user exist > getUserGroups >> ",response)
    
    console.log("Full Response: fetch all that groups in those groups this particular user exist > getUserGroups >>", JSON.stringify(response, null, 2));


     
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

