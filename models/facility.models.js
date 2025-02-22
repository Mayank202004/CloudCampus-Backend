import mongoose from "mongoose";

const FacilitySchema = new mongoose.Schema(
  {
    facilityName: {
      type: String,
      required: true,
    },
    subfacilities: [{
      subfacilityName: {
        type: String,
        required: true
      }
    }]
  },
  { timestamps: true }
);

const FacilityBooking = mongoose.model("Facility", FacilitySchema);
export default Facility;
