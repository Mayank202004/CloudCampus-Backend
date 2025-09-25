import mongoose from "mongoose";

const ElectionSchema = new mongoose.Schema(
    {
        electionName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
    },
    { timestamps: true }
);

const Election = mongoose.model("Election", ElectionSchema);
export default Election;
