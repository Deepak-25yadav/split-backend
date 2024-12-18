import Group from "../models/groupsModel.js";
import User from "../models/userModel.js";


const createGroup = async (req, res) => {

  const { groupName, groupMembers } = req.body;

  const userId = req.user.userId; 

  try {
    
    if (!groupName || !groupMembers || groupMembers.length === 0) {
      return res
        .status(400)
        .json({ message: "Group name and members are required" });
    }

    
    
    const creator = await User.findById(userId);

    if (!creator) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const groupCreatorObj={name:creator.name, email:creator.email, _id:creator._id}

    groupMembers.push(groupCreatorObj)
    
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
     
      const group = await Group.findById(groupId)
        .populate("groupMembers._id", "name email") 
        .select("groupName groupMembers groupCreated createdAt updatedAt");
  
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
  
      
      const reshapedGroupMembers = group.groupMembers.map(member => ({
        _id: member._id._id, 
        name: member._id.name,
        email: member._id.email,
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

    try {
      const groups = await Group.find({
        "groupMembers._id": userId, 
      }).select("groupName _id groupCreated"); 
  
      
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

