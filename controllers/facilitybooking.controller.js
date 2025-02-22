import FacilityBooking from "../models/facilitybooking.models.js";

// @desc    Create a new facility booking
// @route   POST /api/bookings
// @access  Public (should be restricted to authenticated students)
export const createBooking = async (req, res) => {
  try {
    const { facilityName, bookedBy, date, timeSlot } = req.body;

    // Check if a booking already exists for the same facility, date, and time slot
    const existingBooking = await FacilityBooking.findOne({ facilityName, date, timeSlot });

    if (existingBooking) {
      return res.status(400).json({ message: "This time slot is already booked for the facility" });
    }

    // Create new booking
    const booking = new FacilityBooking({
      facilityName,
      bookedBy,
      date,
      timeSlot,
    });

    await booking.save();
    res.status(201).json({ message: "Facility booked successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all facility bookings
// @route   GET /api/bookings
// @access  Public (should be restricted)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await FacilityBooking.find().populate("bookedBy", "name email").populate("approvedBy", "name email");
    res.status(200).json(bookings);
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
