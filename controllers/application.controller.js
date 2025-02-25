import Application from "../models/application.models.js";
import FacultyAuthority from "../models/facultyauthorities.models.js";
import Student from "../models/student.models.js";
import StudentAuthority from "../models/studentauthorities.models.js";

// Create a new application
export const createApplication = async (req, res) => {
  try {
    const { title, to, body, file } = req.body;
    const from = req.student._id; 
    // const fromModel = ""; // Assuming role is "Student" or "StudentAuthority"

    if (!title || !to || !body) {
      return res.status(400).json({ message: "Title, to, toModel, and body are required" });
    }

    const newApplication = new Application({
      from,
    //   fromModel,
      title,
      to,
    //   toModel,
      body,
      file
    });


    await newApplication.save();
    res.status(200).json({ message: "Application created successfully", application: newApplication });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applications (visible to all students)
export const getAllApplications = async (req, res) => {
    try {
      let applications = await Application.find();
  
      // Fetch 'from' and 'to' details manually
      applications = await Promise.all(
        applications.map(async (app) => {
          // Fetch `from` details
          const fromEntity = await Student.findOne({ _id: app.from }).select("name email");
  
          // Fetch `to` details
          const toEntities = await Promise.all(
            app.to.map(async (toId) => {
              const faculty = await FacultyAuthority.findOne({ _id: toId }).select("name email");
              if (faculty) return faculty.toObject();
              
              const studentAuth = await StudentAuthority.findOne({ _id: toId }).select("name email");
              return studentAuth ? studentAuth.toObject() : null;
            })
          );
  
          return {
            ...app.toObject(),
            from: fromEntity ? fromEntity.toObject() : null, // Convert `from` to object
            to: toEntities.filter(Boolean), // Remove null values
          };
        })
      );
  
      res.status(200).json({ applications });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const getStudentApplications = async (req, res) => {
    try {
      let applications = await Application.find({ from: req.student._id });
  
      // Fetch 'from' and 'to' details manually
      applications = await Promise.all(
        applications.map(async (app) => {
          const student = await Student.findOne({ _id: app.from }).select("name email");
          const toEntities = await Promise.all(
            app.to.map(async (toId) => {
              const faculty = await FacultyAuthority.findOne({ _id: toId }).select("name email");
              if (faculty) return faculty.toObject();
              
              const studentAuth = await StudentAuthority.findOne({ _id: toId }).select("name email");
              return studentAuth ? studentAuth.toObject() : null;
            })
          );
  
          return {
            ...app.toObject(),
            from: student ? student.toObject() : null, // Convert from string to object
            to: toEntities.filter(Boolean), // Remove null values
          };
        })
      );
  
      res.status(200).json({ applications });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Get applications addressed to a faculty or faculty authority
export const getApplicationsForFaculty = async (req, res) => {
    try {
      let applications = await Application.find({ to: req.authorityFaculty._id });
  
      // Fetch 'from' and 'to' details manually
      applications = await Promise.all(
        applications.map(async (app) => {
          // Fetch `from` details
          const fromEntity = await Student.findOne({ _id: app.from }).select("name email");
  
          // Fetch `to` details
          const toEntities = await Promise.all(
            app.to.map(async (toId) => {
              const faculty = await FacultyAuthority.findOne({ _id: toId }).select("name email");
              if (faculty) return faculty.toObject();
  
              const studentAuth = await StudentAuthority.findOne({ _id: toId }).select("name email");
              return studentAuth ? studentAuth.toObject() : null;
            })
          );
  
          return {
            ...app.toObject(),
            from: fromEntity ? fromEntity.toObject() : null, // Convert `from` to object
            to: toEntities.filter(Boolean), // Remove null values
          };
        })
      );
  
      res.status(200).json({ applications });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
