const mongoose = require("mongoose");

// Mô hình PasswordResetToken
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

// Hàm xóa token đã hết hạn
const deleteExpiredTokens = async () => {
  try {
    const currentTime = new Date();
    const result = await PasswordResetToken.deleteMany({
      expiration: { $lt: currentTime }, // Chỉ định điều kiện xóa
    });
    console.log(`Deleted ${result.deletedCount} expired tokens.`);
  } catch (error) {
    console.error("Error deleting expired tokens:", error);
  }
};

// Xuất mô hình và hàm
module.exports = { PasswordResetToken, deleteExpiredTokens };
