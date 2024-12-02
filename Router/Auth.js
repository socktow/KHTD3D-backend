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
  try {
    const { username, password } = req.body; // Giải cấu trúc để lấy username và password
    if (!username || !password) {
      return res.status(400).json({ success: false, errors: "Missing username or password" });
    }

    let user = await User.findOne({ username }); // Chỉ tìm kiếm theo username
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        user = await User.findByIdAndUpdate(
          user._id,
          { $inc: { tokenVersion: 1 } },
          { new: true }
        );
        const data = {
          user: {
            id: user.id,
            version: user.tokenVersion,
          },
        };
        const authToken = jwt.sign(data, "secret_ecom");
        return res.json({ success: true, authToken });
      } else {
        return res.status(400).json({ success: false, errors: "Incorrect password" });
      }
    } else {
      return res.status(400).json({ success: false, errors: "Invalid username" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

module.exports = router;
