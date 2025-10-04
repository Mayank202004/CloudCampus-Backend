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
            const student = await Student.findById(decoded.studentId);
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
            const faculty = await Faculty.findById(decoded.facultyId);
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
            const faculty = await FacultyAuthority.findById(decoded.authorityId);
            req.authorityFaculty = faculty;
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
            const faculty = await StudentAuthority.findById(decoded.authorityId);
            req.authorityFaculty = faculty;
            next();
        });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};


// Middleware to check if the user is a faculty or an faculty authority
export const facultyOrAuthorityMiddleware = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token || req.body.token;

        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied.' });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token is not valid.' });
            }

            let faculty = await Faculty.findById(decoded.facultyId);
            if (faculty) {
                req.authority = faculty;
                return next();
            }

            let studentAuthority = await StudentAuthority.findById(decoded.authorityId);
            if (studentAuthority) {
                req.authority = { email: studentAuthority.email, name: studentAuthority.position };
                return next();
            }

            let authorityFaculty = await FacultyAuthority.findById(decoded.authorityId);
            if (authorityFaculty) {
                req.authority = { email: authorityFaculty.email, name: authorityFaculty.position };
                return next();
            }

            return res.status(403).json({ message: "Unauthorized access." });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Middleware to check if the user is a student, Student authority, faculty or faculty authority
export const studentOrFacultyMiddleware = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token || req.body.token;

        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied.' });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token is not valid.' });
            }

            let student = await Student.findById(decoded.studentId);
            if (student) {
                req.student = student;
                return next();
            }

            let studentAuthority = await StudentAuthority.findById(decoded.authorityId);
            if (studentAuthority) {
                req.student = studentAuthority;
                return next();
            }

            let faculty = await Faculty.findById(decoded.facultyId);
            if (faculty) {
                req.faculty = faculty;
                return next();
            }

            let authorityFaculty = await FacultyAuthority.findById(decoded.authorityId);
            if (authorityFaculty) {
                req.faculty = authorityFaculty;
                return next();
            }

            return res.status(403).json({ message: "Unauthorized access." });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
