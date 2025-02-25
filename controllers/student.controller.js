import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import Student from "../models/student.models.js";

// @desc Create a new student
// @route POST /api/students
// @access Public
export const createStudent = async (req, res) => {
  try {
    const { registrationNo, name, email, password, department, profilePhoto, idPhoto, dob } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ $or: [{ email }, { registrationNo }] });
    if (existingStudent) {
      return res.status(400).json({ message: "Student with this email or registration number already exists." });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    let newStudent = new Student({
      registrationNo,
      name,
      email,
      password: hashedPassword,
      department,
      idPhoto,
      profilePhoto,
      dob
    });
    await newStudent.save();

    const payload = { studentId: newStudent.id, username: newStudent.username };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    newStudent.password = "";

    // res.cookie("token", token);
    res.cookie("token", token, {
      httpOnly: true,   // ✅ Prevents JavaScript access
      secure: false,    // ❌ Must be false in development (HTTPS needed for true)
      sameSite: "lax",  // ✅ Required for cross-origin requests
  });

    res.status(200).json({ message: "Student registered successfully", student: newStudent, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCurrentStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);
    res.status(200).send({student})
  } catch (error){
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const updateStudent = async (req, res) => {
  try {
    const { profilePhoto } = req.body;
    console.log(profilePhoto)

    // Check if student already exists
    await Student.findByIdAndUpdate(req.student._id, {profilePhoto});
    const student = await Student.findById(req.student._id)
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    // console.log(student)
    // student.profilePhoto = profilePhoto;

    // await student.save();

    res.status(200).json({ message: "Student updates successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const loginStudent = async (req, res) => {
  try {

    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcryptjs.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const payload = { studentId: student.id, username: student.username };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    res.cookie("token", token);


    res.status(200).send({ student, token });

  } catch (error) {
    res.status(500).send({ message: error.message })
  }
};