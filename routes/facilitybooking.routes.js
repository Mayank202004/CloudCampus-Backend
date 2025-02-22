import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/facilitybooking.controller.js";
import { studentAuthMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Create a new booking
router.post("/", studentAuthMiddleware, createBooking);

// Get all bookings
router.get("/", studentAuthMiddleware, getAllBookings);

// Get a booking by ID
// router.get("/:id", getBookingById);

// Update booking status (approve/reject)
router.put("/:id", updateBookingStatus);

// Delete a booking
router.delete("/:id", deleteBooking);

export default router;
