const mongoose = require("mongoose");

const giftcodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    items: {
      type: [{ itemId: Number, quantity: Number }],
      default: [],
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    usage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Giftcode", giftcodeSchema);
