import express from "express";
import { createStudent, loginStudent, updateStudent, getAllStudents, getCurrentStudent } from "../controllers/student.controller.js";
import { studentAuthMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllStudents);

router.get("/me", studentAuthMiddleware, getCurrentStudent);

// Create a new student
router.post("/", createStudent);

router.post("/login", loginStudent);


router.put("/", studentAuthMiddleware, updateStudent);


export default router;
