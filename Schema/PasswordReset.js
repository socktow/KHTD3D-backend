const mongoose = require("mongoose");

const PasswordResetTokenSchema = new mongoose.Schema({
  userid: {
    type: Number,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
  },
});

const PasswordResetToken = mongoose.model("PasswordResetToken", PasswordResetTokenSchema);

const deleteExpiredTokens = async () => {
  const currentTime = new Date();
  await PasswordResetToken.deleteMany({
    expiration: { $lt: currentTime }
  });
};

module.exports = {PasswordResetToken, deleteExpiredTokens};

