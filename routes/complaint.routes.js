import express from "express";
import {
  createComplaint,
  getAllComplaints,
//   getComplaintById,
  deleteComplaint,
  getAllComplaintSenders,
  increaseAnonymousCount,
} from "../controllers/complaint.controller.js";
import { studentAuthMiddleware, FacultyAuthorityAuthMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Create a new complaint (only for authenticated students)
router.post("/", studentAuthMiddleware, createComplaint);

// Get all complaints (for admin or faculty handling complaints)
router.get("/", studentAuthMiddleware, getAllComplaints);
router.get("/senders", studentAuthMiddleware, getAllComplaintSenders);

router.patch("/approve/:complaintId", FacultyAuthorityAuthMiddleware, increaseAnonymousCount)

// Get a single complaint by ID
// router.get("/:id", studentAuthMiddleware, getComplaintById);

// Delete a complaint (only student who created it can delete)
// router.delete("/:id", studentAuthMiddleware, deleteComplaint);

export default router;
