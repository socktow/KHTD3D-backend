const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  Cash: {
    type: Number,
    default: 0, // Mặc định là 0
  },
  CashFree: {
    type: Number,
    default: 0, // Mặc định là 0
  },
  cartData: {
    type: [CartItemSchema],
    default: [],
  },
  Permission: {
    type: Boolean,
    default: false,
    immutable: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
