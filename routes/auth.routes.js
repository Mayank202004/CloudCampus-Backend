import express from 'express';
import jwt from 'jsonwebtoken';
import Student from '../models/student.models.js';
import Faculty from '../models/faculty.models.js';
import FacultyAuthority from '../models/facultyauthorities.models.js';
import StudentAuthority from '../models/studentauthorities.models.js';

const router = express.Router();

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    const role = req.cookies.role; // student, faculty, facultyAuthority, studentAuthority

    if (!token || !role) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    let userData = null;

    switch (role) {
      case 'student':
        userData = await Student.findById(decoded._id).select('-password -createdAt -updatedAt').lean();
        break;

      case 'faculty':
        userData = await Faculty.findById(decoded._id).select('-password -createdAt -updatedAt').lean();
        break;

      case 'faculty-authority':
        userData = await FacultyAuthority.findById(decoded._id)
          .select('-password -createdAt -updatedAt')
          .populate('faculty', '_id name email profilePhoto')
          .lean();
        break;

      case 'student-authority':
        userData = await StudentAuthority.findById(decoded._id)
          .select('-password -createdAt -updatedAt')
          .populate('student', '_id name email profilePhoto')
          .lean();
        break;

      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    if (!userData) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({
      role,
      ...(role === 'faculty-authority' || role === 'student-authority' ? { authority: userData } : {}),
      ...(role === 'student' ? { student: userData } : {}),
      ...(role === 'faculty' ? { faculty: userData } : {}),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
