const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const SftpClient = require("ssh2-sftp-client");
const router = express.Router();
const sftp = new SftpClient();
const SFTP_HOST = process.env.SFTP_HOST;
const SFTP_USER = process.env.SFTP_USER;
const SFTP_PASSWORD = process.env.SFTP_PASSWORD;
const SFTP_PORT = process.env.SFTP_PORT;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const extension = path.extname(originalName);
  return `image_${timestamp}${extension}`;
};
router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  try {
    await sftp.connect({
      host: SFTP_HOST,
      username: SFTP_USER,
      password: SFTP_PASSWORD,
      port: SFTP_PORT,
    });
    const newFileName = generateFileName(req.file.originalname);
    const remoteFilePath = `/home/gmbbesh/public_html/cdn.kiemhieptinhduyen.com/images/${newFileName}`;
    await sftp.put(req.file.buffer, remoteFilePath);

    res.json({
      success: true,
      image_url: `https://cdn.kiemhieptinhduyen.com/images/${newFileName}`,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading file via SFTP:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  } finally {
    sftp.end();
  }
});

router.get("/images", async (req, res) => {
  const remoteDirPath = "/home/gmbbesh/public_html/cdn.kiemhieptinhduyen.com/images/";
  try {
    await sftp.connect({
      host: SFTP_HOST,
      username: SFTP_USER,
      password: SFTP_PASSWORD,
      port: SFTP_PORT,
    });
    const fileList = await sftp.list(remoteDirPath);
    const imageFiles = fileList.filter(file => {
      const ext = path.extname(file.name).toLowerCase();
      return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif' || ext === '.webp';
    });
    const imageUrls = imageFiles.map(file => {
      return `https://cdn.kiemhieptinhduyen.com/images/${file.name}`;
    });
    res.json({
      success: true,
      images: imageUrls,
      message: "Image list fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching file list from SFTP:", error);
    res.status(500).json({ success: false, message: "Error fetching file list", error: error.message });
  } finally {
    sftp.end();
  }
});

module.exports = router;