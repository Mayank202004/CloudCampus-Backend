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
        candidates: [
            {
                candidate: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Student'
                },
                manifesto: {
                    type: String,
                    required: true
                },
                isApproved: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        date: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

const Election = mongoose.model("Election", ElectionSchema);
export default Election;
