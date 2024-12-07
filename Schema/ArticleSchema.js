const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
    enum: ["tin-tuc", "su-kien", "tinh-nang", "huong-dan"],
  },
  redirect: {
    type: Boolean,
    default: false,
  },
  redirectLink: {
    type: String,
    required: function () {
      return this.redirect; 
    },
    validate: {
      validator: function (value) {
        return this.redirect ? /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(value) : true;
      },
      message: "Invalid URL format.",
    },
  },
  content: {
    type: String,
    required: true,
  },
  publishDate: {
    type: Date,
    default: Date.now, 
  },
});

module.exports = mongoose.model("Article", ArticleSchema);
