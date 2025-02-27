import Facility from "../models/facility.models.js";
import FacilityBooking from "../models/facilitybooking.models.js";
import Student from "../models/student.models.js";

// @desc    Create a new facility booking
// @route   POST /api/bookings
// @access  Public (should be restricted to authenticated students)
export const bookSlot = async (req, res) => {
  try {
    const { facilityName, date, timeSlots } = req.body;
    const bookedBy = req.student._id;
    // const bookedBy = req.student.email; // Assuming student info is extracted from auth middleware

    if (!facilityName || !date || !timeSlots || !Array.isArray(timeSlots)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const queryDate = new Date(date);
    let facility = await Facility.findOneAndUpdate(
      { facilityName },
      { $setOnInsert: { facilityName, bookings: [] } },
      { new: true, upsert: true } // upsert: true creates the facility if not found
    );

    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    let existingBooking = facility.bookings.find(
      (booking) => new Date(booking.date).toISOString() === queryDate.toISOString()
    );

    if (existingBooking) {
      // Prevent duplicate slot times
      const existingTimes = new Set(existingBooking.slots.map(slot => slot.time));
      const newSlots = timeSlots
        .filter(time => !existingTimes.has(time)) // Only add if it's not already booked
        .map(time => ({ time, bookedBy }));

      existingBooking.slots.push(...newSlots);
    } else {
      // Create a new booking entry
      facility.bookings.push({
        date: queryDate,
        slots: timeSlots.map(time => ({ time, bookedBy }))
      });
    }

    await facility.save();

    res.status(200).json({ message: "Slots booked successfully", facility });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





// @desc    Get all facility bookings
// @route   GET /api/bookings
// @access  Public (should be restricted)
export const getBookedSlots = async (req, res) => {
  try {
    const { date, facilityName } = req.body;

    if (!date || !facilityName) {
      return res.status(400).json({ message: "Date and facilityName are required" });
    }

    const queryDate = new Date(date);
    // queryDate.setHours(0, 0, 0, 0); 

    const facility = await Facility.findOne({
      facilityName,
    });

    if (!facility) {
      // const facility = new Facility({ date, facilityName, bookings:[] });
      // await facility.save();
      return res.status(404).send({message:"Facility not found"})
    }

    const bookingsForDate = facility.bookings.find(
      (booking) => new Date(booking.date).toISOString() === queryDate.toISOString()
    );

    if (!bookingsForDate) {
      return res.status(200).json({ date: queryDate, slots: [] });
    }

    const bookedSlotsWithDetails = await Promise.all(
      bookingsForDate.slots.map(async (slot) => {
        const student = await Student.findOne({ email: slot.bookedBy }).select("name email department");
        return {
          time: slot.time,
          bookedBy: student || { email: slot.bookedBy, name: "Unknown", department: "Unknown" }, // Handle cases where student isn't found
        };
      })
    );

    res.status(200).json({ date: queryDate, slots: bookedSlotsWithDetails, times: bookedSlotsWithDetails.map(booking => booking.time) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get facility booking by ID
// @route   GET /api/bookings/:id
// @access  Public (should be restricted)
export const getBookingById = async (req, res) => {
  try {
    const booking = await FacilityBooking.findById(req.params.id).populate("bookedBy", "name email").populate("approvedBy", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (approve/reject)
// @route   PUT /api/bookings/:id
// @access  Private (faculty/admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, approvedBy, reasonForRejection } = req.body;
    const booking = await FacilityBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update booking status
    booking.status = status;
    if (status === "Approved") {
      booking.approvedBy = approvedBy;
      booking.reasonForRejection = null;
    } else if (status === "Rejected") {
      booking.reasonForRejection = reasonForRejection;
    }

    await booking.save();
    res.status(200).json({ message: `Booking ${status.toLowerCase()} successfully`, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private (only the student who booked or admin can delete)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await FacilityBooking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
