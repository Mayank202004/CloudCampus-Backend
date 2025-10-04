import jwt from 'jsonwebtoken';
import Student from '../models/student.models.js';
import Faculty from '../models/faculty.models.js';
import FacultyAuthority from '../models/facultyauthorities.models.js';
import StudentAuthority from '../models/studentauthorities.models.js';

// Middleware to check if the user is a student
export const studentAuthMiddleware = async (req, res, next) => {

    try {

        const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token || req.body.token;
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied.' });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token is not valid.' });
            }
            // If token is valid, attach the user data to the request
            const student = await Student.findById(decoded._id);
            req.student = student;
            next();
        });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};

// Middleware to check if the user is a faculty
export const facultyAuthMiddleware = async (req, res, next) => {

    try {

        const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token || req.body.token;

        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied.' });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token is not valid.' });
            }
            // If token is valid, attach the user data to the request
            const faculty = await Faculty.findById(decoded._id);
            req.faculty = faculty;
            next();
        });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};

// Middleware to check if the user is a faculty authority
export const FacultyAuthorityAuthMiddleware = async (req, res, next) => {

    try {

        const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token || req.body.token;

        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied.' });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token is not valid.' });
            }
            // If token is valid, attach the user data to the request
            const facultyAuthority = await FacultyAuthority.findById(decoded._id);
            req.authorityFaculty = facultyAuthority;
            next();
        });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};

// Middleware to check if the user is a student authority
export const StudentAuthorityAuthMiddleware = async (req, res, next) => {

    try {

        const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token || req.body.token;

        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied.' });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token is not valid.' });
            }
            // If token is valid, attach the user data to the request
            const studentAuthority = await StudentAuthority.findById(decoded.authorityId);
            req.studentAuthority = studentAuthority;
            next();
        });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};
