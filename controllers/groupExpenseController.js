import GroupExpense from "../models/groupExpenseModel.js";

import Group from "../models/groupsModel.js";




const createGroupExpense = async (req, res) => {

  const { groupId, totalAmount, expenseDescription, groupMembers } = req.body;

  const expenseCreatedBy = req.user.userId; 


  try {
    
    if (!groupId || !totalAmount || !expenseDescription || !groupMembers || groupMembers.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    
    const isValidMembers = groupMembers.every((member) =>
      group.groupMembers.some((gm) => gm._id.toString() === member._id)
    );


    if (!isValidMembers) {
      return res.status(400).json({ message: "Invalid group members provided" });
    }

    
    const newExpense = new GroupExpense({
      groupId,
      totalAmount,
      expenseDescription,
      expenseCreatedBy,
      groupMembers,
    });

    await newExpense.save();

    return res.status(201).json({
      message: "Expense created successfully",
      expense: newExpense,
    });

  } catch (error) {

    console.error("Error creating group expense:", error);

    return res.status(500).json({ message: "Something went wrong", error });
  }
};







const getGroupExpenses = async (req, res) => {
  const { groupId } = req.params;

  try {
    const expenses = await GroupExpense.find({ groupId }).populate("expenseCreatedBy", "name email");

    if (!expenses.length) {
      return res.status(404).json({ message: "No expenses found for this group" });
    }

    return res.status(200).json({
      message: "Expenses retrieved successfully",
      expenses,
    });
  } catch (error) {

    console.error("Error retrieving group expenses:", error);

    return res.status(500).json({ message: "Something went wrong", error });
  }
};





const getExpenseDetails = async (req, res) => {

    const { expenseId } = req.params;
  
    try {

      const expense = await GroupExpense.findById(expenseId).populate("expenseCreatedBy", "name email");
  
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
  
      return res.status(200).json({
        message: "Expense details retrieved successfully",
        expense,
      });
    } catch (error) {

      console.error("Error fetching expense details:", error);

      return res.status(500).json({ message: "Something went wrong", error });
    }
  };
  




  const updatePaymentStatus = async (req, res) => {

    const { expenseId, groupMemberId } = req.body;
  
    try {
      // Validate required fields
      if (!expenseId || !groupMemberId) {
        return res.status(400).json({ message: "Expense ID and Group Member ID are required" });
      }
  
      // Find the expense by expenseId
      const expense = await GroupExpense.findById(expenseId);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
  
      // Find the group member in the expense's groupMembers array
      const groupMember = expense.groupMembers.find(
        (member) => member._id.toString() === groupMemberId
      );

  
      if (!groupMember) {
        return res.status(404).json({ message: "Group member not found in this expense" });
      }
  

      // Update the paymentStatus to true
      groupMember.paymentStatus = true;
  

      // Save the updated expense
      await expense.save();
  

      return res.status(200).json({
        message: "Group member's payment status updated successfully",
        groupMember,
      });
    } catch (error) {

      console.error("Error updating payment status:", error);

      return res.status(500).json({ message: "Something went wrong", error });
    }
  };
  



export { createGroupExpense, getGroupExpenses, getExpenseDetails, updatePaymentStatus };
