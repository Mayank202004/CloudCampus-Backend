import FacultyAuthority from "../models/facultyauthorities.models.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"


// Create a new Faculty Authority
export const createFacultyAuthority = async (req, res) => {
  try {
    const { faculty, position } = req.body;

    // Validate required fields
    if (!faculty || !position) {
      return res.status(400).json({ message: "Faculty and position are required." });
    }

    const newAuthority = new FacultyAuthority({ faculty, position });
    await newAuthority.save();

    res.status(200).json({ message: "Faculty authority created successfully", data: newAuthority });
  } catch (error) {
    res.status(500).json({ message: "Error creating faculty authority", error: error.message });
  }
};

// Get all Faculty Authorities
export const getFacultyAuthorities = async (req, res) => {
  try {
    const authorities = await FacultyAuthority.find().populate("faculty", "name email role");

    res.status(200).json({ message: "Faculty authorities retrieved successfully", data: authorities });
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty authorities", error: error.message });
  }
};


export const loginFacultyAuthority = async (req, res) => {
    try {
  
      const { email, password } = req.body;
  
      const authority = await FacultyAuthority.findOne({ email });
  
      if (!authority) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const isMatch = await bcryptjs.compare(password, authority.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const payload = { authorityId: authority.id, username: authority.username };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

      res.cookie("token", token)
      res.cookie("role", authority.role)

      res.status(200).send({ token, authority, role: authority.role });
  
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  };