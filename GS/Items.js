const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const filePath = path.join(__dirname, "../GS/items/item.txt");

router.get("/", async (req, res) => {
  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    const items = fileData
      .trim()
      .split("\n")
      .map((line) => {
        const [id, name] = line.split(";").map((part) => part.trim());
        return { id: parseInt(id), name };
      });
    res.json({ items });
  } catch (error) {
    console.error("Lỗi khi đọc file:", error);
    res.status(500).json({ error: "Không thể đọc dữ liệu" });
  }
});

router.get("/items/:id", async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const fileData = fs.readFileSync(filePath, "utf-8");
    const items = fileData
      .trim()
      .split("\n")
      .map((line) => {
        const [id, name] = line.split(";").map((part) => part.trim());
        return { id: parseInt(id), name };
      });
    const item = items.find((item) => item.id === itemId);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: "Không tìm thấy item" });
    }
  } catch (error) {
    console.error("Lỗi khi đọc file:", error);
    res.status(500).json({ error: "Không thể đọc dữ liệu" });
  }
});

module.exports = router;
