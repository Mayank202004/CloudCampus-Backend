import express from "express";
import cors from "cors";
import studentRoutes from "./routes/student.routes.js";
import leaveRoutes from "./routes/leavenotification.routes.js";
import facultyRoutes from "./routes/faculty.routes.js";
import facilityBookings from "./routes/facilitybooking.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import electionRoutes from "./routes/election.routes.js";
import cheatingRoutes from "./routes/cheating.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import studentAuthorityRoutes from "./routes/studentauthorities.routes.js"
import facultyAuthorityRoutes from "./routes/facultyauthorities.routes.js"

import connectDB from "./config/db.js";
import { upload } from "./middlewares/multer.js";
import { deleteImage, imageUpload } from "./controllers/upload.js";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

import { sendEmail } from "./config/sendemail.js";
import { sendWhatsappMessage } from "./config/sendwhatsapp.js";
import { generateOTP } from "./config/generateOTP.js";
dotenv.config()


const app = express();
const PORT = process.env.PORT || 5000;


// app.use(cors());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith("http://192.168.")) {
      callback(null, true);  // Allow requests from local network
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(cookieParser())
app.use(express.json());

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true })); 

connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/api/image-upload", upload.single("photo"), imageUpload);

app.post('/api/send-email', (req, res) => {
  try {
    const { to, subject, message } = req.body;
    sendEmail(to, subject, message)
    res.status(200).send({ message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
});

app.post('/api/send-otp', (req, res) => {
  try {
    const { to } = req.body;

    if(!to.endsWith("@sggs.ac.in")) res.status(403).send({message: "Invalid Email for user"})

    let otp = generateOTP();
    let subject = "Registration for cloud campus"
    let message = `<p>You have attempted to register at CloudCampus</p> \n\n Your OTP is  <h1>${otp}</h1>\n\n\n\n If not you then ignore.`
    sendEmail(to, subject, message)
    res.status(200).send({ message: "Email sent successfully!", otp });
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
});

app.post('/api/send-whatsapp', sendWhatsappMessage);

app.delete('/api/delete', deleteImage);

app.use("/api/students", studentRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/facility", facilityBookings);
app.use("/api/complaints", complaintRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/cheatings", cheatingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/student-authorities", studentAuthorityRoutes);
app.use("/api/faculty-authorities", facultyAuthorityRoutes);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
