require("dotenv").config(); // Đọc tệp .env
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
app.use("/api", authRoutes);
app.get("/checkapi", (req, res) => {
  res.send("Welcome to the backend of KHTD3D!");
});

// Cấu hình multer
const storage = multer.diskStorage({
  destination: "./upload/images", // Thay đổi thành đường dẫn tuyệt đối hoặc sử dụng dịch vụ lưu trữ đám mây
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });
app.post("/upload", upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No files uploaded" });
  }
  // Sửa URL để sử dụng biến môi trường cho domain
  const fileUrls = req.files.map((file) => ({
    fieldName: file.fieldname,
    imageUrl: `${process.env.BASE_URL || `http://localhost:${PORT}`}/images/${file.filename}`,
  }));

  res.json({
    success: true,
    files: fileUrls,
    message: "Files uploaded successfully",
  });
});

// Thêm middleware để phục vụ file tĩnh
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// Khởi động server
app.listen(PORT, (error) => { 
  if (error) {
    console.log(error);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
