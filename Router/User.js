const express = require("express");
const User = require("../Schema/UsersSchema");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const fetchUser = async (req, res, next) => {
  const token = req.header("token");
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    const user = await User.findById(data.user.id);
    if (user.tokenVersion !== data.user.version) {
      return res.status(401).send("Token has been invalidated.");
    }
    req.user = data.user;
    req.isAdmin = user.Permission;
    next();
  } catch (error) {
    res.status(401).send("Invalid token.");
  }
};

router.get("/profile", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, __v, date, Permission, tokenVersion, _id, ...userWithoutSensitiveData } = user.toObject();
    res.json({ user: userWithoutSensitiveData });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.patch("/profile", fetchUser, async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {};
    if (email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updates.email = email;
    }
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }
      const saltRounds = 10;
      updates.password = await bcrypt.hash(newPassword, saltRounds);
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid updates provided" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    );
    const { password, __v, date, Permission, tokenVersion, _id, ...userWithoutSensitiveData } = updatedUser.toObject();
    
    res.json({ 
      message: "Profile updated successfully",
      user: userWithoutSensitiveData 
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.post("/check-gameid", fetchUser, async (req, res) => {
  try {
    const { gameId } = req.body;
    
    if (!gameId) {
      return res.status(400).json({ 
        success: false, 
        message: "GameID không được để trống" 
      });
    }

    const existingUser = await User.findOne({ GameId: gameId });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "GameID này đã được liên kết với tài khoản khác"
      });
    }

    res.json({ 
      success: true, 
      message: "GameID hợp lệ và chưa được liên kết",
      canLink: true
    });
  } catch (error) {
    console.error("Error checking GameID:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

module.exports = router;
