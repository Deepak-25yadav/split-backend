
import GroupExpense from "../models/groupExpenseModel.js";
import Group from "../models/groupsModel.js";
import User from "../models/userModel.js"; 




const createGroupExpense = async (req, res) => {
  const { groupId, totalAmount, expenseDescription, groupMembers } = req.body;
  const expenseCreatedBy = req.user.userId; // Authenticated user's ID

  try {


    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required" });
    }

  
    if (!totalAmount) {
      return res.status(400).json({ message: "Total amount is required" });
    }

    
    if (!expenseDescription) {
      return res.status(400).json({ message: "Expense description is required" });
    }

    
    if (!groupMembers) {
      return res.status(400).json({ message: "Group members are required" });
    }

    
    if (groupMembers.length === 0) {
      return res.status(400).json({ message: "Group must have at least one member" });
    }


    
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    
    const isValidMembers = groupMembers.every((member) =>
      group.groupMembers.some((gm) => gm.toString() === member._id)
    );


    if (!isValidMembers) {
      return res.status(400).json({ message: "Invalid group members provided" });
    }

    
    const newExpense = new GroupExpense({
      groupId,
      totalAmount,
      expenseDescription,
      expenseCreatedBy,
      groupMembers: groupMembers.map((member) => ({
        _id: member._id,
        paymentAmount: member.paymentAmount,
        paymentStatus: member.paymentStatus,
      })),
    });

    await newExpense.save();

    
    const populatedExpense = await newExpense.populate("expenseCreatedBy", "name email");

    return res.status(201).json({
      message: "Expense created successfully",
      expense: populatedExpense,
    });
  } catch (error) {
    console.error("Error creating group expense:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};







const getGroupExpenses = async (req, res) => {
  const { groupId } = req.params;

  try {
    const expenses = await GroupExpense.find({ groupId })
      .populate("expenseCreatedBy", "name email")
      .populate("groupMembers._id", "name email");

    if (!expenses.length) {
      return res.status(404).json({ message: "No expenses found for this group" });
    }

    // Map the response to match the previous format
    const formattedExpenses = expenses.map((expense) => ({
      _id: expense._id,
      groupId: expense.groupId,
      totalAmount: expense.totalAmount,
      expenseDescription: expense.expenseDescription,
      expenseCreatedBy: expense.expenseCreatedBy,
      groupMembers: expense.groupMembers.map((member) => ({
        _id: member._id._id,
        name: member._id.name,
        email: member._id.email,
        paymentAmount: member.paymentAmount,
        paymentStatus: member.paymentStatus,
      })),
    }));

    return res.status(200).json({
      message: "Expenses retrieved successfully",
      expenses: formattedExpenses,
    });
  } catch (error) {
    console.error("Error retrieving group expenses:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};








const getExpenseDetails = async (req, res) => {
  const { expenseId } = req.params;

  try {
    const expense = await GroupExpense.findById(expenseId)
      .populate("expenseCreatedBy", "name email")
      .populate("groupMembers._id", "name email");

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Format the response to match the previous format
    const formattedExpense = {
      _id: expense._id,
      groupId: expense.groupId,
      totalAmount: expense.totalAmount,
      expenseDescription: expense.expenseDescription,
      expenseCreatedBy: expense.expenseCreatedBy,
      groupMembers: expense.groupMembers.map((member) => ({
        _id: member._id._id,
        name: member._id.name,
        email: member._id.email,
        paymentAmount: member.paymentAmount,
        paymentStatus: member.paymentStatus,
      })),
    };

    return res.status(200).json({
      message: "Expense details retrieved successfully",
      expense: formattedExpense,
    });
  } catch (error) {
    console.error("Error fetching expense details:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};









const updatePaymentStatus = async (req, res) => {
  const { expenseId, groupMemberId } = req.body;

  try {
    
    if (!expenseId) {
      return res.status(400).json({ message: "Expense ID is required" });
    }

    if (!groupMemberId) {
      return res.status(400).json({ message: "Group Member ID is required" });
    }


    const expense = await GroupExpense.findById(expenseId).populate("groupMembers._id", "name email");
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const groupMember = expense.groupMembers.find((member) => member._id._id.toString() === groupMemberId);
    if (!groupMember) {
      return res.status(404).json({ message: "Group member not found in this expense" });
    }

    groupMember.paymentStatus = true;
    await expense.save();

    // Include updated member details in response
    const updatedMember = {
      _id: groupMember._id._id,
      name: groupMember._id.name,
      email: groupMember._id.email,
      paymentAmount: groupMember.paymentAmount,
      paymentStatus: groupMember.paymentStatus,
    };

    return res.status(200).json({
      message: "Group member's payment status updated successfully",
      groupMember: updatedMember,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};



export { createGroupExpense, getGroupExpenses, getExpenseDetails, updatePaymentStatus };

