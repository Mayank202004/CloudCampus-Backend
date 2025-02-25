import express from "express";
import { getAllApplications, getStudentApplications, getApplicationsForFaculty, createApplication } from "../controllers/application.controller.js";
import { facultyAuthMiddleware, isFacultyAuthority, studentAuthMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", studentAuthMiddleware, createApplication);
router.get("/all", facultyAuthMiddleware, getAllApplications);
router.get("/my-applications", studentAuthMiddleware, getStudentApplications);
router.get("/faculty-applications", isFacultyAuthority, getApplicationsForFaculty);

export default router;
