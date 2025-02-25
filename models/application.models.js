import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      // refPath: "fromModel",
      required: true,
    },
    title:{
      type: String,
    },
    // fromModel: {
    //   type: String,
    //   // required: true,
    //   enum: ["Student", "StudentAuthority"],
    // },
    to: [{
      type: String,
      required: true,
      // refPath: "toModel",
    }],
    isApproved:{
      type: Boolean,
      
    },
    // toModel: {
    //   type: String,
    //   required: true,
    //   enum: ["FacultyAuthority", "StudentAuthority"],
    // },
    body: {
      type: String
    },
    file: {
      type: String
    }
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", ApplicationSchema);
export default Application;
