import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    title: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "fromModel",
      required: true,
    },
    fromModel: {
        type: String,
        required: true,
        enum: ["Student", "StudentAuthority"],
      },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "toModel",
    },
    toModel: {
      type: String,
      required: true,
      enum: ["FacultyAuthority", "StudentAuthority"],
    }
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", RequestSchema);
export default Request;
