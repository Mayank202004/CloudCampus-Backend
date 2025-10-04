import StudentAuthority from "../models/studentauthorities.models.js";
import bcryptjs from "bcryptjs";

// @desc Create a new Student Authority
// @route POST /api/studentauthorities
// @access Public
export const createStudentAuthority = async (req, res) => {
  try {
    const { student, position } = req.body;

    // Validate required fields
    if (!student || !position) {
      return res.status(400).json({ message: "Student and position are required." });
    }

    const newAuthority = new StudentAuthority({ student, position });
    await newAuthority.save();

    res.status(200).json({ message: "Student authority created successfully", data: newAuthority });
  } catch (error) {
    res.status(500).json({ message: "Error creating student authority", error: error.message });
  }
};

// @desc Update a Student Authority
// @route PUT /api/studentauthorities/:id
// @access Public
export const getStudentAuthorities = async (req, res) => {
  try {
    const authorities = await StudentAuthority.find().populate("student", "name registrationNo");

    res.status(200).json({ message: "Student authorities retrieved successfully", data: authorities });
  } catch (error) {
    res.status(500).json({ message: "Error fetching student authorities", error: error.message });
  }
};

// @desc login a Student Authority
// @route POST /api/studentauthorities/login
// @access Public
export const loginStudentAuthority = async (req, res) => {
  try {

    const { email, password } = req.body;

    const authority = await StudentAuthority.findOne({ email });

    if (!authority) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcryptjs.compare(password, authority.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const payload = { _id: authority._id, username: authority.username };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    res.cookie("token", token)
    res.cookie("role", authority.role)

    res.status(200).send({ token, authority, role: authority.role });

  } catch (error) {
    res.status(500).send({ message: error.message })
  }
};