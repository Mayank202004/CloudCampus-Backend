import { generateLetterHTML } from "../config/letterTemplate.js";
import Application from "../models/application.models.js";
import Faculty from "../models/faculty.models.js";
import FacultyAuthority from "../models/facultyauthorities.models.js";
import Student from "../models/student.models.js";
import StudentAuthority from "../models/studentauthorities.models.js";
import Notification from "../models/notification.models.js";

// @desc Create a new application
// @route POST /applications
// @access Protected (Students only)
export const createApplication = async (req, res) => {
  try {
    const { title, to, body, file, receipantAuthorityType, priority, label} = req.body;
    const from = req.student._id;

    if (!title || !to || !body || !label) {
      return res.status(400).json({ message: "Title,label, to and body are required" });
    }
    let toData = [];
    for (let id of to) {
      toData.push({ authority: id, status: "pending" })
    }
    const currentRecipient=toData[0].authority;

    const newApplication = new Application({
      from,
      title,
      to: toData,
      body,
      label,
      file: file ?? "",
      priority: priority ?? "high",
      isApproved: false,
      currentRecipient
    });
    await newApplication.save();

    // Create notifications for each recipient
    const notification = new Notification({
      title: "New Application Received",
      description: `You have received a new application: "${title}".`,
      notifiedTo: to[0].authority, // Only the first authority receives the notification
      from: from, // Student who applied
      fromModel: receipantAuthorityType ?? "FacultyAuthority", // Default to FacultyAuthority if not mentioned
    });
    
    await notification.save();
    

    res.status(200).json({ message: "Application created successfully", application: newApplication });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// @Desc Update (Reapply) an existing application
// @Route /applications/reapply (Patch request)
// @Access Protected (Students only)
export const reapplyApplication = async (req, res) => {
  try {
    const { applicationId, title, body, file } = req.body;

    if (!applicationId || !title || !body) {
      return res.status(400).json({ message: "Application ID, title, and body are required" });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update only allowed fields
    application.title = title;
    application.body = body;
    application.reason = "";
    application.file = file ?? application.file;
    application.isApproved = false;
    application.currentRecipient = application.to[0].authority;
    
    // Reset recipient statuses
    application.to.forEach((recipient) => {
      recipient.status = "pending";
    });

    await application.save();

    // Extract recipient emails
    const recipientEmails = application.to.map((recipient) => recipient.authority); // Extracting only email

    // Send notifications again to first authority
    const notification = new Notification({
      title: "New Application Received",
      description: `You have received a new application: "${title}".`,
      notifiedTo: to[0].authority, // Only the first authority receives the notification
      from: from, // Student who applied
      fromModel: receipantAuthorityType ?? "FacultyAuthority", // Default to FacultyAuthority if not mentioned
    });
    await notification.save();
    

    res.status(200).json({ message: "Application re-applied successfully", application });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// @desc get all applications
// @route GET /applications
// @access Protected (students/Faculties/Authorities)
export const getAllApplications = async (req, res) => {
  try {
    // Fetch all applications
    let applications = await Application.find().lean();

    // Populate 'from' and 'to' fields
    applications = await Promise.all(
      applications.map(async (app) => {
        // Fetch 'from' details
        const student = await Student.findById(app.from)
          .select("name email department registrationNo")
          .lean();

        // Fetch 'to' details
        const toEntities = await Promise.all(
          app.to.map(async (entry) => {
            const email = entry.authority;

            // Check if authority is FacultyAuthority
            const facultyAuthority = await FacultyAuthority.findOne({ email }).populate("faculty").lean();
            if (facultyAuthority && facultyAuthority.faculty) {
              return {
                authority: email,
                status: entry.status,
                _id: entry._id,
                name: facultyAuthority.faculty.name || "Unknown",
                registrationNo: facultyAuthority.faculty.registrationNo || "N/A",
                role: "Faculty Authority",
              };
            }

            // Check if authority is StudentAuthority
            const studentAuthority = await StudentAuthority.findOne({ email }).populate("student").lean();
            if (studentAuthority && studentAuthority.student) {
              return {
                authority: email,
                status: entry.status,
                _id: entry._id,
                name: studentAuthority.student.name || "Unknown",
                registrationNo: studentAuthority.student.registrationNo || "N/A",
                role: "Student Authority",
              };
            }

            // If no match, return minimal object
            return {
              authority: email,
              status: entry.status,
              _id: entry._id,
            };
          })
        );

        return {
          ...app,
          from: student ? student : null,
          to: toEntities.filter(Boolean),
        };
      })
    );

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};


export const getAllApplicationSenders = async (req, res) => {
  try {
    const faculties = await Faculty.find().select("name email");
    res.status(200).json({ faculties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all applications for a student
// @route GET /applications/my-applications
// @access Protected (Students only)
export const getStudentApplications = async (req, res) => {
  try {
    let applications = await Application.find({ from: req.student._id }).lean();

    // Fetch 'from' and 'to' details manually
    applications = await Promise.all(
      applications.map(async (app) => {
        const student = await Student.findById(app.from).select("name email").lean();

        const toEntities = await Promise.all(
          app.to.map(async (entry) => {
            const email = entry.authority; 
            
            const facultyAuthority = await FacultyAuthority.findOne({ email }).populate("faculty").lean();
            if (facultyAuthority && facultyAuthority.faculty) {
              return {
                authority: entry.authority,
                status: entry.status,
                _id: entry._id, 
                name: facultyAuthority.faculty.name || "Unknown",
                registrationNo: facultyAuthority.faculty.registrationNo || "N/A", 
                role: "Faculty Authority"
              };
            }

            const studentAuthority = await StudentAuthority.findOne({ email }).populate("student").lean();
            if (studentAuthority && studentAuthority.student) {
              return {
                authority: entry.authority,
                status: entry.status,
                _id: entry._id, 
                name: studentAuthority.student.name || "Unknown", 
                registrationNo: studentAuthority.student.registrationNo || "N/A", 
                role: "Student Authority"
              };
            }
            // Return the original object if no match is found
            return {
              authority: entry.authority,
              status: entry.status,
              _id: entry._id
            };
          })
        );
        return {
          ...app, 
          from: student ? student : null,
          to: toEntities,
        };
      })
    );

    res.status(200).json(applications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};



export const getApplicationsForApproval = async (req, res) => {
  try {
    const authorityEmail = req.authority?.email || req.facultyAuthority?.email || req.studentAuthority?.email;

    // Fetch only applications which are pending and current level of acceptance is with the current authority
    let applications = await Application.find({
      isApproved: false,
      currentRecipient: authorityEmail,
    }).lean();

    applications = await Promise.all(
      applications.map(async (app) => {
        const student = await Student.findById(app.from).select("name email").lean();

        // No need to filter again, just process `app.to`
        const toEntities = await Promise.all(
          app.to.map(async (entry) => {
            const email = entry.authority;

            // Check faculty authority
            const facultyAuthority = await FacultyAuthority.findOne({ email }).populate("faculty").lean();
            if (facultyAuthority?.faculty) {
              return {
                authority: email,
                status: entry.status,
                _id: entry._id,
                name: facultyAuthority.faculty.name || "Unknown",
                registrationNo: facultyAuthority.faculty.registrationNo || "N/A",
                role: "Faculty Authority"
              };
            }

            // Check student authority
            const studentAuthority = await StudentAuthority.findOne({ email }).populate("student").lean();
            if (studentAuthority?.student) {
              return {
                authority: email,
                status: entry.status,
                _id: entry._id,
                name: studentAuthority.student.name || "Unknown",
                registrationNo: studentAuthority.student.registrationNo || "N/A",
                role: "Student Authority"
              };
            }

            // Default fallback if no authority found
            return {
              authority: email,
              status: entry.status,
              _id: entry._id
            };
          })
        );

        return {
          ...app,
          from: student || null,
          to: toEntities
        };
      })
    );

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAuthorityApplications = async (req, res) => {
  try {
    const authorityEmail = req.authority.email;

    // Fetch all applications which are approved/pending/sent back ...
    let applications = await Application.find({
      to: { $elemMatch: { authority: authorityEmail } }
    }).lean();

    applications = await Promise.all(
      applications.map(async (app) => {
        const student = await Student.findById(app.from).select("name email").lean();

        // No need to filter again, just process `app.to`
        const toEntities = await Promise.all(
          app.to.map(async (entry) => {
            const email = entry.authority;

            // Check faculty authority
            const facultyAuthority = await FacultyAuthority.findOne({ email }).populate("faculty").lean();
            if (facultyAuthority?.faculty) {
              return {
                authority: email,
                status: entry.status,
                _id: entry._id,
                name: facultyAuthority.faculty.name || "Unknown",
                registrationNo: facultyAuthority.faculty.registrationNo || "N/A",
                role: "Faculty Authority"
              };
            }

            // Check student authority
            const studentAuthority = await StudentAuthority.findOne({ email }).populate("student").lean();
            if (studentAuthority?.student) {
              return {
                authority: email,
                status: entry.status,
                _id: entry._id,
                name: studentAuthority.student.name || "Unknown",
                registrationNo: studentAuthority.student.registrationNo || "N/A",
                role: "Student Authority"
              };
            }

            // Default fallback if no authority found
            return {
              authority: email,
              status: entry.status,
              _id: entry._id
            };
          })
        );

        return {
          ...app,
          from: student || null,
          to: toEntities
        };
      })
    );

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc Approve an application
// @route PATCH /applications/approve/:applicationId
// @access Protected (Faculty Authorities only)
export const approveApplication = async (req, res) => {
  try {
    const authorityEmail = req.faculty?.email || req.facultyAuthority?.email || req.studentAuthority?.email; 

    if(!authorityEmail)
      return res.status(403).json({ message: "Unauthorized: You cannot approve this application" });

    let application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if already approved
    if (application.isApproved) {
      return res.status(400).json({ message: "Application is already fully approved." });
    }

    // Check if the current recipient matches the faculty email
    if (application.currentRecipient !== authorityEmail) {
      return res.status(403).json({ message: "Unauthorized: You cannot approve this application" });
    }

    let updated = false;
    let currentIndex = -1;

    for (let i = 0; i < application.to.length; i++) {
      if (application.to[i].authority === authorityEmail) {
        application.to[i].status = "approved";
        updated = true;
        currentIndex = i;
        break;
      }
    }

    if (!updated) {
      return res.status(403).json({ message: "Unauthorized: You cannot approve this application" });
    }

    let notifications = [];

    // Check if all `to` authorities have approved
    if (currentIndex === application.to.length - 1) {
      application.isApproved = true;
      application.currentRecipient = ""; // No more recipients

      // Notify the student about full approval
      notifications.push({
        title: "Application Fully Approved",
        description: `Your application titled "${application.title}" has been fully approved.`,
        notifiedTo: application.from, 
        from: authorityEmail, // The last approving authority
      });

    } else {
      // Set currentRecipient to the next approver
      application.currentRecipient = application.to[currentIndex + 1].authority;

      // Notify the next authority for approval
      notifications.push({
        title: "New Application Received",
        description: `You have received a new application: "${application.title}". Please review it.`,
        notifiedTo: application.to[currentIndex + 1].authority,
        from: application.from, // Student who applied
      });

      // Notify the student that one more approval is done
      notifications.push({
        title: "Application Partially Approved",
        description: `Your application titled "${application.title}" has been approved by ${req.authority.name}. Awaiting further approvals.`,
        notifiedTo: application.from, 
        from: authorityEmail, 
      });
    }

    application.reason = ""; // Reset rejection reason

    // Perform all database operations in parallel
    await Promise.all([
      application.save({ validateBeforeSave: false }),
      Notification.insertMany(notifications),
    ]);

    const populatedApplication = await populateApplicationAuthorities(application);

    res.status(200).json({ message: "Application approved successfully", application:populatedApplication });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc Used to reject application
// @route PATCH /applications/reject/:applicationId
// @access Protected (Faculty/Authority only)
export const rejectApplication = async (req, res) => {
  try {
    const { reason } = req.body;
    const authorityEmail = req.faculty?.email || req.facultyAuthority?.email || req.studentAuthority?.email; 

    if(!authorityEmail)
      return res.status(403).json({ message: "Unauthorized: You cannot approve this application" });

    if(!reason) {
      return res.status(400).json({ message: "Reason is required for rejecting" });
    }

    let application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the current recipient matches the faculty email
    if (application.currentRecipient !== authorityEmail) {
      return res.status(403).json({ message: "Unauthorized: You cannot approve this application" });
    }

    // Check if already approved
    if (application.isApproved) {
      return res.status(400).json({ message: "Application is already fully approved." });
    }

    let currentIndex = application.to.findIndex(recipient => recipient.authority === authorityEmail);

    // Check if the faculty is an approver
    if (currentIndex === -1) {
      return res.status(403).json({ message: "Unauthorized: You cannot reject this application" });
    }

    // Check if already rejected
    if (application.to[currentIndex].status === "rejected") {
      return res.status(400).json({ message: "Application has already been rejected by you." });
    }

    // Mark as rejected
    application.to[currentIndex].status = "rejected";
    application.reason = reason;

    // Send notification to student
    await Notification.create({
      title: "Application Rejected",
      description: `Your application titled "${application.title}" has been rejected by ${req.facultyAuthority?.position || req.faculty.name || req.studentAuthority.position} due to: ${reason}`,
      notifiedTo: application.from, 
      from: authorityEmail, 
    });

    await application.save();

    res.status(200).json({ message: "Application rejected successfully", application });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Send application back to applicant
// @route PATCH /applications/send-back/:applicationId
// @access Protected (Faculty/Authority only)
export const sendBackToApplicant = async (req, res) => {
  try {
    const { reason } = req.body;
    console.log(req.authority);
    const facultyEmail = req.authority.email;

    if (!reason) {
      return res.status(400).json({ message: "Reason is required for sending back the application" });
    }

    let application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the current recipient matches the faculty email
    if (application.currentRecipient !== facultyEmail) {
      return res.status(403).json({ message: "Unauthorized: You cannot approve this application" });
    }

    // Check if already approved or rejected
    if (application.isApproved) {
      return res.status(400).json({ message: "Application is already fully approved." });
    }
    
    if (application.to.some(recipient => recipient.status === "rejected")) {
      return res.status(400).json({ message: "Application has already been rejected by an authority. It cannot be sent back." });
    }

    let currentIndex = application.to.findIndex(recipient => recipient.authority === facultyEmail);

    // Check if the faculty is an approver
    if (currentIndex === -1) {
      return res.status(403).json({ message: "Unauthorized: You cannot send back this application" });
    }

    // Check if already sent back
    if (application.to[currentIndex].status === "sent back to applicant") {
      return res.status(400).json({ message: "Application has already been sent back by you." });
    }

    // Mark as sent back
    application.to[currentIndex].status = "sent back to applicant";
    application.reason = reason;

    // Send notification to student
    await Notification.create({
      title: "Application Sent Back",
      description: `Your application titled "${application.title}" has been sent back by ${req.authority.name} due to: ${reason}`,
      notifiedTo: application.from,
      from: facultyEmail,
    });

    await application.save({ validateBeforeSave: false }),

    res.status(200).json({ message: "Application sent back successfully", application });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const generateApplication = async (req, res) => {
  try {
    let application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    let facultyId = req.authorityFaculty._id;
    let updated = false;

    application.to.forEach((toObj) => {
      if (toObj.authority.toString() === facultyId.toString()) {
        toObj.status = "rejected";
        updated = true;
      }
    });

    if (!updated) {
      return res.status(403).json({ message: "Unauthorized: You cannot reject this application" });
    }

    await application.save({ validateBeforeSave: false }),

    res.status(200).json({ message: "Application rejected successfully", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const getApplicationPrint = async (req, res) => {
  try {
    const app = await Application.findById(req.params.applicationId);
    if (!app) {
      return res.status(404).send("Application not found");
    }

    if (app.to.some(receipent => receipent.status !== "approved")) {
      return res.status(403).send({ message: "Applications not approved yet" });
    }

    // Fetch `from` details
    const fromEntity = await Student.findById(app.from).select("name email registrationNo");

    // Fetch `to` details properly
    const toEntities = await Promise.all(
      app.to.map(async (toId) => {
        let recipient = null;

        // Check if authority is an email or an ObjectId
        if (toId.authority.includes("@")) {
          recipient = await FacultyAuthority.findOne({ email: toId.authority }).populate("faculty");
          if (!recipient) {
            recipient = await StudentAuthority.findOne({ email: toId.authority }).populate("student");
          }
        } else {
          recipient = await FacultyAuthority.findById(toId.authority).populate("faculty");
          if (!recipient) {
            recipient = await StudentAuthority.findById(toId.authority).populate("student");
          }
        }

        return recipient ? { ...recipient.toObject(), status: toId.status } : null;
      })
    );

    const applicationData = {
      ...app.toObject(),
      from: fromEntity ? fromEntity.toObject() : null,
      to: toEntities.filter(Boolean), // Remove any null values
    };

    // Generate HTML content
    // console.log(applicationData);
    const htmlContent = generateLetterHTML(applicationData);
    res.send(htmlContent);
  } catch (error) {
    console.error("Printing application:", error);
    res.status(500).send("Internal Server Error");
  }
};




// = = = = = = = = = Helpers  = = = = = = = = = =

/**
 * @desc Populate application authorities
 * @param {Application} app - The application to be populated
 * @returns - The populated application
 */
export const populateApplicationAuthorities = async (app) => {
  // Populate 'from' student
  const student = await Student.findById(app.from).select("name email registrationNo").lean();
  // Populate 'to' authorities
  const toEntities = await Promise.all(
    app.to.map(async (entry) => {
      const email = entry.authority;
      // Check faculty authority
      const facultyAuth = await FacultyAuthority.findOne({ email }).populate("faculty").lean();
      if (facultyAuth?.faculty) {
        return {
          authority: email,
          status: entry.status,
          _id: entry._id,
          name: facultyAuth.faculty.name || "Unknown",
          registrationNo: facultyAuth.faculty.registrationNo || "N/A",
          role: "Faculty Authority",
        };
      }
      // Check student authority
      const studentAuth = await StudentAuthority.findOne({ email }).populate("student").lean();
      if (studentAuth?.student) {
        return {
          authority: email,
          status: entry.status,
          _id: entry._id,
          name: studentAuth.student.name || "Unknown",
          registrationNo: studentAuth.student.registrationNo || "N/A",
          role: "Student Authority",
        };
      }
      return { authority: email, status: entry.status, _id: entry._id };
    })
  );
  const appObj = app.toObject ? app.toObject() : app;

  return {
    ...appObj,
    from: student || null,
    to: toEntities,
  };
};
