import LeaveNotification from "../models/leavenotification.models.js";

// @desc Create a new leave request
// @route POST /api/leaves
// @access Public
export const createLeave = async (req, res) => {
  try {
    const { student, registrationNo, reason, leaveType, fromDate, toDate, classCoordinator } = req.body;

    if (!student || !registrationNo || !reason || !leaveType || !fromDate || !toDate || !classCoordinator) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const newLeave = new LeaveNotification({
      student,
      registrationNo,
      reason,
      leaveType,
      fromDate,
      toDate,
      classCoordinator,
    });

    await newLeave.save();
    res.status(201).json({ message: "Leave request submitted successfully", leave: newLeave });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get all leave requests
// @route GET /api/leaves
// @access Public
export const getLeaves = async (req, res) => {
  try {
    const leaves = await LeaveNotification.find().populate("student classCoordinator", "name email");
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
