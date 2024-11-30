require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Environment Variables
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Used Router 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const authRoutes = require("./Router/Auth");
const userRouter = require("./Router/User")
app.use("/api", authRoutes);
app.use("/api", userRouter);
app.get("/", (req, res) => {
  res.send("Welcome to the backend of KHTD3D!");
});

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'upload/images');
    // Ensure upload directory exists
    require('fs').mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).any();

app.post("/upload", (req, res) => {
  upload(req, res, function(err) {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: "Error uploading file: " + err.message 
      });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    try {
      const fileUrls = req.files.map((file) => ({
        fieldName: file.fieldname,
        imageUrl: `${process.env.BASE_URL || `http://localhost:${PORT}`}/images/${file.filename}`,
      }));

      res.json({
        success: true,
        files: fileUrls,
        message: "Files uploaded successfully",
      });
    } catch (error) {
      console.error('Error processing upload:', error);
      res.status(500).json({
        success: false,
        message: "Internal server error while processing upload"
      });
    }
  });
});

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// Start server with error handling
app.listen(PORT, (error) => { 
  if (error) {
    console.error('Error starting server:', error);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
