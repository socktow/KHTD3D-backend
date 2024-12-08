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

module.exports = router;
