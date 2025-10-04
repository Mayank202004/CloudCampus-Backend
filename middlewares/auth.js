import jwt from 'jsonwebtoken';
import Student from '../models/student.models.js';
import Faculty from '../models/faculty.models.js';
import FacultyAuthority from '../models/facultyauthorities.models.js';
import StudentAuthority from '../models/studentauthorities.models.js';

// Generic helper to get token
const getToken = (req) => {
  return (
    req.headers['authorization']?.split(' ')[1] ||
    req.cookies.token ||
    req.body.token
  );
};

// Student middleware
export const studentAuthMiddleware = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) throw new Error('No token');

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const student = await Student.findById(decoded._id);
    if (!student) throw new Error('Invalid student');

    req.student = student;
    return next();
  } catch (err) {
    return next(err); 
  }
};

// Faculty middleware
export const facultyAuthMiddleware = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) throw new Error('No token');

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const faculty = await Faculty.findById(decoded._id);
    if (!faculty) throw new Error('Invalid faculty');

    req.faculty = faculty;
    return next();
  } catch (err) {
    return next(err);
  }
};

// Faculty Authority middleware
export const FacultyAuthorityAuthMiddleware = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) throw new Error('No token');

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const facultyAuthority = await FacultyAuthority.findById(decoded._id);
    if (!facultyAuthority) throw new Error('Invalid faculty authority');

    req.facultyAuthority = facultyAuthority;
    return next();
  } catch (err) {
    return next(err);
  }
};

// Student Authority middleware
export const StudentAuthorityAuthMiddleware = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) throw new Error('No token');

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const studentAuthority = await StudentAuthority.findById(decoded.authorityId);
    if (!studentAuthority) throw new Error('Invalid student authority');

    req.studentAuthority = studentAuthority;
    return next();
  } catch (err) {
    return next(err);
  }
};
