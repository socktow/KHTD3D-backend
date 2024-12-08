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

router.post("/create-article", async (req, res) => {
  try {
    const { title, thumbnail, contentType, content, redirect, redirectLink } =
      req.body;
    if (!title || !thumbnail || !contentType || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (
      !["tin-tuc", "su-kien", "tinh-nang", "huong-dan"].includes(contentType)
    ) {
      return res.status(400).json({ message: "Invalid contentType" });
    }

    const newArticle = new Article({
      title,
      thumbnail,
      contentType,
      content,
      redirect,
      redirectLink,
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error creating article:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
