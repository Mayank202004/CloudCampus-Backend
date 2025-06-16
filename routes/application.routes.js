import express from "express";
import { getAllApplications, getAllApplicationSenders, getStudentApplications, createApplication, approveApplication, rejectApplication, generateApplication, getApplicationPrint, reapplyApplication, getApplicationsForApproval, getAllAuthorityApplications, sendBackToApplicant} from "../controllers/application.controller.js";
import { facultyAuthMiddleware, isFacultyAuthority, studentAuthMiddleware, facultyOrAuthorityMiddleware,studentOrFacultyMiddleware} from "../middlewares/auth.js";

const router = express.Router();

router.use(express.static("public"));


router.post("/", studentAuthMiddleware, createApplication);
router.patch("/reapply", studentAuthMiddleware,reapplyApplication);
router.get("/all", studentOrFacultyMiddleware, getAllApplications);
router.get("/senders", studentAuthMiddleware, getAllApplicationSenders);
router.get("/my-applications", studentAuthMiddleware, getStudentApplications);
router.get("/applications-for-approval", facultyOrAuthorityMiddleware, getApplicationsForApproval);
router.get("/my-authority-applications", facultyOrAuthorityMiddleware, getAllAuthorityApplications);
router.patch("/approve/:applicationId", facultyOrAuthorityMiddleware, approveApplication);
router.patch("/reject/:applicationId", facultyOrAuthorityMiddleware, rejectApplication);
router.patch("/send-back/:applicationId", facultyOrAuthorityMiddleware, sendBackToApplicant);
router.get("/priint/:applicationId", studentAuthMiddleware, generateApplication);
router.get("/generate-html/:applicationId", getApplicationPrint);


export default router;
