import StudentAuthority from "../models/studentauthorities.models.js";

// Create a new Student Authority
export const createStudentAuthority = async (req, res) => {
  try {
    const { student, position } = req.body;

    // Validate required fields
    if (!student || !position) {
      return res.status(400).json({ message: "Student and position are required." });
    }

    const newAuthority = new StudentAuthority({ student, position });
    await newAuthority.save();

    res.status(201).json({ message: "Student authority created successfully", data: newAuthority });
  } catch (error) {
    res.status(500).json({ message: "Error creating student authority", error: error.message });
  }
};

// Get all Student Authorities
export const getStudentAuthorities = async (req, res) => {
  try {
    const authorities = await StudentAuthority.find().populate("student", "name registrationNo");

    res.status(200).json({ message: "Student authorities retrieved successfully", data: authorities });
  } catch (error) {
    res.status(500).json({ message: "Error fetching student authorities", error: error.message });
  }
};
