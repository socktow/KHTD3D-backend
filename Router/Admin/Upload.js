const express = require("express");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const SftpClient = require("ssh2-sftp-client");
const router = express.Router();

const sftp = new SftpClient();
const { SFTP_HOST, SFTP_USER, SFTP_PASSWORD, SFTP_PORT } = process.env;

const storage = multer.memoryStorage();
const upload = multer({ storage });

const generateFileName = (originalName) => `image_${Date.now()}.webp`;

const sftpConnect = () => sftp.connect({
  host: SFTP_HOST,
  username: SFTP_USER,
  password: SFTP_PASSWORD,
  port: SFTP_PORT,
});

router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

  try {
    const originalExt = path.extname(req.file.originalname).toLowerCase();
    if (originalExt === ".pdf") {
      return res.status(400).json({ success: false, message: "PDF files are not allowed" });
    }

    const newFileName = generateFileName(req.file.originalname);
    const remoteFilePath = `/home/sqrtbrk/public_html/cdn.kiemhieptinhduyen.com/images/${newFileName}`;

    const webpBuffer = await sharp(req.file.buffer).webp().toBuffer();

    await sftpConnect();
    await sftp.put(webpBuffer, remoteFilePath);

    res.json({
      success: true,
      image_url: `https://cdn.kiemhieptinhduyen.com/images/${newFileName}`,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  } finally {
    sftp.end();
  }
});

router.get("/images", async (req, res) => {
  const remoteDir = "/home/gmbbesh/public_html/cdn.kiemhieptinhduyen.com/images/";
  try {
    await sftpConnect();
    const files = await sftp.list(remoteDir);
    const images = files
      .filter(file => [".webp", ".jpg", ".jpeg", ".png", ".gif"].includes(path.extname(file.name).toLowerCase()))
      .map(file => `https://cdn.kiemhieptinhduyen.com/images/${file.name}`);

    res.json({ success: true, images, message: "Images fetched successfully" });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, message: "Error fetching images" });
  } finally {
    sftp.end();
  }
});

module.exports = router;
