import mongoose from "mongoose";

const LeaveNotificationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    leaveType: {
      type: String,
      enum: ["Medical", "Personal", "Emergency", "Other"],
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    doctorVerified: {
      type: Boolean,
      default: false,
    },
    classCoordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    parentNotified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const LeaveNotification = mongoose.model("LeaveNotification", LeaveNotificationSchema);
export default LeaveNotification;
