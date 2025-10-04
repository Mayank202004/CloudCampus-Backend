import express from "express";
import { getAllApplications, getAllApplicationSenders, getStudentApplications, createApplication, approveApplication, rejectApplication, generateApplication, getApplicationPrint, reapplyApplication, getApplicationsForApproval, getAllAuthorityApplications, sendBackToApplicant} from "../controllers/application.controller.js";
import { facultyAuthMiddleware, FacultyAuthorityAuthMiddleware, studentAuthMiddleware, StudentAuthorityAuthMiddleware} from "../middlewares/auth.js";
import { orMiddleware } from "../middlewares/orMiddleware.js";
const router = express.Router();

router.use(express.static("public"));


router.post("/", studentAuthMiddleware, createApplication);
router.patch("/reapply", studentAuthMiddleware,reapplyApplication);
router.get("/all", orMiddleware([studentAuthMiddleware, FacultyAuthorityAuthMiddleware]), getAllApplications);
router.get("/senders", getAllApplicationSenders);
router.get("/my-applications", studentAuthMiddleware, getStudentApplications);
router.get("/applications-for-approval", orMiddleware([facultyAuthMiddleware, FacultyAuthorityAuthMiddleware, StudentAuthorityAuthMiddleware]), getApplicationsForApproval);
router.get("/my-authority-applications", orMiddleware([facultyAuthMiddleware, FacultyAuthorityAuthMiddleware, StudentAuthorityAuthMiddleware]), getAllAuthorityApplications);
router.patch("/approve/:applicationId", orMiddleware([facultyAuthMiddleware, FacultyAuthorityAuthMiddleware, StudentAuthorityAuthMiddleware]), approveApplication);
router.patch("/reject/:applicationId", orMiddleware([facultyAuthMiddleware, FacultyAuthorityAuthMiddleware, StudentAuthorityAuthMiddleware]), rejectApplication);
router.patch("/send-back/:applicationId", orMiddleware([facultyAuthMiddleware, FacultyAuthorityAuthMiddleware, StudentAuthorityAuthMiddleware]), sendBackToApplicant);
router.get("/priint/:applicationId", studentAuthMiddleware, generateApplication);
router.get("/generate-html/:applicationId", getApplicationPrint);


export default router;
