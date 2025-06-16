import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    to: [{
      authority: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["approved", "rejected", "pending","returned back to applicant"]
      }
    }],
    reason: {
      type: String,
      required: function () {
        return this.status === "rejected" || this.status === "returned back to applicant";
      },
      default: ""
    },
    isApproved: {
      type: Boolean,
    },
    body: {
      type: String
    },
    file: {
      type: String
    },
    currentRecipient: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "high"
    }
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", ApplicationSchema);
export default Application;
