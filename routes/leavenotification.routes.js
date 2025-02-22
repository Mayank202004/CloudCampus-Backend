import express from "express";
import { createLeave, getLeaves } from "../controllers/leavenotification.controller.js";
import { isFacultyAuthority } from "../middlewares/auth.js";

const router = express.Router();

// Create a new leave request
router.post("/", isFacultyAuthority, createLeave);

// Get all leave requests
router.get("/", getLeaves);

export default router;
