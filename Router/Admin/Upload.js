const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const PORT = 4000;

// // Tạo thư mục nếu chưa tồn tại
// const uploadDir = "./upload/images";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Cấu hình lưu trữ của multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// const upload = multer({ storage: storage });

// // Endpoint upload ảnh
// router.post("/upload", upload.single("image"), (req, res) => {
//   if (!req.file) {
//     return res
//       .status(400)
//       .json({ success: false, message: "No file uploaded" });
//   }
//   res.json({
//     success: true,
//     image_url: `http://localhost:${PORT}/images/${req.file.filename}`,
//     message: "File uploaded successfully",
//   });
// });

module.exports = router;
