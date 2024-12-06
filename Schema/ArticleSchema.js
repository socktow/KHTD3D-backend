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
    type: Number,
    required: true,
    enum: [1, 2, 3, 4], 
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
          // Chỉ kiểm tra định dạng URL nếu redirect là true
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
