const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2; 
const router = express.Router();

// Cấu hình Cloudinary
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint để tải ảnh lên Cloudinary
router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  try {
    const result = await cloudinary.uploader.upload_stream(
      {
        public_id: `image_${Date.now()}`,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: "Error uploading image to Cloudinary",
            error: error.message,
          });
        }

        res.json({
          success: true,
          image_url: result.secure_url,
          message: "File uploaded successfully",
        });
      }
    );
    result.end(req.file.buffer);
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Endpoint để lấy tất cả các ảnh đã tải lên Cloudinary
router.get("/images", async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload", 
      resource_type: "image", 
      max_results: 100, 
    });

    res.json({
      success: true,
      images: result.resources,
    });
  } catch (error) {
    console.error("Error fetching images from Cloudinary:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching images from Cloudinary",
      error: error.message,
    });
  }
});

module.exports = router;
