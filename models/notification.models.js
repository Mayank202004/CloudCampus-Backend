import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    notifiedTo: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    fromModel: {
      type: String,
      // required: true,
      enum: ["FacultyAuthority", "StudentAuthority"],
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
