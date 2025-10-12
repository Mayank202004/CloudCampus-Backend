import express from "express";
import {
  createComplaint,
  getAllComplaints,
//   getComplaintById,
  deleteComplaint,
  getAllComplaintSenders,
  increaseAnonymousCount,
} from "../controllers/complaint.controller.js";
import { studentAuthMiddleware, FacultyAuthorityAuthMiddleware, facultyAuthMiddleware, StudentAuthorityAuthMiddleware } from "../middlewares/auth.js";
import { orMiddleware } from "../middlewares/orMiddleware.js";

const router = express.Router();

// Create a new complaint (only for authenticated students)
router.post("/", orMiddleware([FacultyAuthorityAuthMiddleware, studentAuthMiddleware, facultyAuthMiddleware, StudentAuthorityAuthMiddleware]), createComplaint);

// Get all complaints (for admin or faculty handling complaints)
router.get("/",orMiddleware([FacultyAuthorityAuthMiddleware, studentAuthMiddleware, facultyAuthMiddleware, StudentAuthorityAuthMiddleware]), getAllComplaints);
router.get("/senders", orMiddleware([FacultyAuthorityAuthMiddleware, studentAuthMiddleware, facultyAuthMiddleware, StudentAuthorityAuthMiddleware]), getAllComplaintSenders);

router.patch("/approve/:complaintId", orMiddleware([FacultyAuthorityAuthMiddleware,facultyAuthMiddleware,StudentAuthorityAuthMiddleware]), increaseAnonymousCount)

// Get a single complaint by ID
// router.get("/:id", studentAuthMiddleware, getComplaintById);

// Delete a complaint (only student who created it can delete)
// router.delete("/:id", studentAuthMiddleware, deleteComplaint);

export default router;
