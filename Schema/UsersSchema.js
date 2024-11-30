const mongoose = require("mongoose");
const Counter = require("./CounterSchema");

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
  userid: {
    type: Number,
    unique: true,
  },
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
    default: 0,
  },
  CashFree: {
    type: Number,
    default: 0,
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
  tokenVersion: {
    type: Number,
    default: 0
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: "userid" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.userid = counter.seq;
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
