const mongoose = require("mongoose");

const giftcodeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  items: {
    type: [Number],
    default: []
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Giftcode", giftcodeSchema);
