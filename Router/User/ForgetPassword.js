const ForgotPassword = require("../../utils/ForgotPassword");
const { PasswordResetToken } = require("../../Schema/PasswordReset");
const User = require("../../Schema/UsersSchema");
const express = require("express");
const router = express.Router();

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }
    const token = "some-unique-token";
    await ForgotPassword(email, token);
    res.json({
      message:
        "Chúng tôi đã gửi đường dẫn khôi phục vào email của bạn.",
    });
  } catch (error) {
    console.error("Error in forgot-password endpoint:", error);
    res.status(500).json({ success: false, error: "Lỗi hệ thống" });
  }
});

router.post("/verify-code", async (req, res) => {
  const { email, verificationCode } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }
    const resetToken = await PasswordResetToken.findOne({
      userid: user.userid,
      token: verificationCode,
    });
    if (!resetToken) {
      return res.status(400).json({ message: "Mã xác minh không đúng" });
    }
    const currentTime = new Date();
    if (resetToken.expiration < currentTime) {
      return res.status(400).json({ message: "Mã xác minh đã hết hạn" });
    }
    res.json({
      message: "Mã xác minh hợp lệ. Vui lòng thay đổi mật khẩu.",
      userid: user.userid,
    });
  } catch (error) {
    console.error("Error in verify-code endpoint:", error);
    res.status(500).json({ success: false, error: "Lỗi hệ thống" });
  }
});

module.exports = router;
