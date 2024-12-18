const mongoose = require("mongoose");
const Counter = require("./CounterSchema");

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
  gameid:{
    type: Number,
    default: null,
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
  MocNap: {
    type: Number,
    default: 0
  },
  Permission: {
    type: Boolean,
    default: false,
    immutable: true,
  },
  TokenVersion: {
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
