import express from "express";
import { createStudent, loginStudent, updateStudent, getAllStudents } from "../controllers/student.controller.js";

const router = express.Router();

router.get("/", getAllStudents);

// Create a new student
router.post("/", createStudent);

router.post("/login", loginStudent);


router.patch("/:studentId", updateStudent);


export default router;
