const to = require('await-to-js').default;
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Schema/UsersSchema");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const lowercaseUsername = username.toLowerCase();
    let existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        errors: "Email đã được sử dụng.",
      });
    }
    let existingUsername = await User.findOne({ 
      username: { $regex: new RegExp(`^${lowercaseUsername}$`, 'i') }
    });
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        errors: "An account with this email already exists.",
      });
    }
    if (existingUsername) {
      return res.status(400).json({
        errors: "Username đã được sử dụng",
      });
    }
    if (/\s/.test(username)) {
      return res.status(400).json({
        errors: "Username không hợp lệ.",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        errors: "Mật khẩu phải có hơn 6 ký tự.",
      });
    }
    if (!email){
      return res.status(400).json({
        errors: "Chưa điền email",
      });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({
      username: lowercaseUsername,
      email,
      password: hashedPassword,
      gameId: null,
      Cash: 50000,
      CashFree: 500000,
      Permission: false,
    });
    await newUser.save();
    const tokenData = {
      user: {
        id: newUser.id,
      },
    };
    const token = jwt.sign(tokenData, "secret_ecom");
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra yêu cầu có đầy đủ username và password không
  if (!username || !password) {
    return res.status(400).json({ success: false, errors: "Missing username or password" });
  }

  // Tìm user trong database
  const [errUser, user] = await to(User.findOne({ username }));
  if (errUser) {
    console.error("Error finding user:", errUser);
    return res.status(500).json({ success: false, errors: "Server error" });
  }

  if (!user) {
    return res.status(400).json({ success: false, errors: "Tài khoản không tồn tại" });
  }

  // So sánh mật khẩu
  const [errMatch, passwordMatch] = await to(bcrypt.compare(password, user.password));
  if (errMatch) {
    console.error("Error comparing passwords:", errMatch);
    return res.status(500).json({ success: false, errors: "Server error" });
  }

  if (!passwordMatch) {
    return res.status(400).json({ success: false, errors: "Sai mật khẩu" });
  }

  // Tăng `tokenVersion` của user
  const [errUpdate, updatedUser] = await to(
    User.findByIdAndUpdate(user._id, { $inc: { TokenVersion: 1 } }, { new: true })
  );
  if (errUpdate) {
    console.error("Error updating user:", errUpdate);
    return res.status(500).json({ success: false, errors: "Server error" });
  }

  // Tạo token
  const data = {
    user: {
      id: updatedUser.id,
      version: updatedUser.TokenVersion,
    },
  };
  const authToken = jwt.sign(data, "secret_ecom");

  // Trả về token
  return res.json({ success: true, authToken });
});

module.exports = router;
