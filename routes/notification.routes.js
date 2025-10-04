import express from "express";
import {
  createNotification,
  getNotificationsForStudent,
  deleteNotification,
  getNotificationsForFaculty,
} from "../controllers/notification.controller.js";
import { facultyAuthMiddleware, FacultyAuthorityAuthMiddleware, studentAuthMiddleware, StudentAuthorityAuthMiddleware} from "../middlewares/auth.js";
import { orMiddleware } from "../middlewares/orMiddleware.js";

const router = express.Router();

// Create a notification (Only Admin/Faculty can create)
router.post("/", FacultyAuthorityAuthMiddleware, createNotification);

// Get notifications for a student (Authenticated student can access)
router.get("/", studentAuthMiddleware, getNotificationsForStudent);

// Get notifications for a student (Authenticated faculty can access)
router.get("/faculty",orMiddleware([facultyAuthMiddleware, FacultyAuthorityAuthMiddleware, StudentAuthorityAuthMiddleware]), getNotificationsForFaculty);

// Delete a notification (Only Admin can delete)
router.delete("/:id", facultyAuthMiddleware, deleteNotification);

export default router;
