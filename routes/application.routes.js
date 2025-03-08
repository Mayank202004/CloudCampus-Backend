import express from "express";
import { getAllApplications, getAllApplicationSenders, getStudentApplications, getApplicationsForFaculty, createApplication, approveApplication, rejectApplication, generateApplication, getApplicationPrint, reapplyApplication } from "../controllers/application.controller.js";
import { facultyAuthMiddleware, isFacultyAuthority, studentAuthMiddleware, facultyOrAuthorityMiddleware} from "../middlewares/auth.js";

const router = express.Router();

router.use(express.static("public"));


router.post("/", studentAuthMiddleware, createApplication);
router.post("/", studentAuthMiddleware, createApplication);
router.patch("/reapply", studentAuthMiddleware,reapplyApplication);
router.get("/all", facultyAuthMiddleware, getAllApplications);
router.get("/senders", studentAuthMiddleware, getAllApplicationSenders);
router.get("/my-applications", studentAuthMiddleware, getStudentApplications);
router.get("/faculty-applications", facultyOrAuthorityMiddleware, getApplicationsForFaculty);
router.patch("/approve/:applicationId", isFacultyAuthority, approveApplication);
router.patch("/reject/:applicationId", isFacultyAuthority, rejectApplication);
router.get("/priint/:applicationId", studentAuthMiddleware, generateApplication);
router.get("/generate-html/:applicationId", getApplicationPrint);


export default router;
