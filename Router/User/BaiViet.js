const express = require("express");
const Article = require("../../Schema/ArticleSchema");
const router = express.Router();

router.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Thêm endpoint để lấy bài viết theo ID
router.get("/articles/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }
    res.status(200).json(article);
  } catch (error) {
    console.error("Error fetching article by ID:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
