const express = require("express");
const Article = require("../../Schema/ArticleSchema");
const router = express.Router();

// Router GET: Lấy danh sách bài viết
router.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/create-article", async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error creating article:", error.message);
    res.status(500).json({ message: "Server error" });
  }
})
module.exports = router;
