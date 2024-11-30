const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Schema/UsersSchema");
const router = express.Router();

// Đăng ký người dùng
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const lowercaseUsername = username.toLowerCase();
    let existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        errors: "Email đã được sử dụng.",
      });
    }
    let existingUsername = await User.findOne({ 
      username: { $regex: new RegExp(`^${lowercaseUsername}$`, 'i') }
    });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        errors: "Username đã được sử dụng",
      });
    }
    if (/\s/.test(username)) {
      return res.status(400).json({
        success: false,
        errors: "Username không hợp lệ.",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        errors: "Mật khẩu phải có hơn 6 ký tự.",
      });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      username: lowercaseUsername,
      email,
      password: hashedPassword,
      Cash: 0,
      CashFree: 0,
      Permission: false,
    });

    await newUser.save();
    const tokenData = {
      user: {
        id: newUser.id,
      },
    };
    const token = jwt.sign(tokenData, process.env.JWT_TOKEN, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      message: "User đăng ký thành công",
      token,
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const lowercaseUsername = username.toLowerCase();
    const user = await User.findOne({ username: { $regex: new RegExp(`^${lowercaseUsername}$`, 'i') } });
    if (!user) {
      return res.status(400).json({
        success: false,
        errors: "Sai username hoặc password.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        errors: "Sai username hoặc password.",
      });
    }
    const tokenData = {
      user: {
        id: user.id,
        isAdmin: user.Permission,
      },
    };
    const token = jwt.sign(tokenData, process.env.JWT_TOKEN, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "Login successful",
      token,
      username: user.username,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

module.exports = router;
