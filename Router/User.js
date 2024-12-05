const express = require("express");
const to = require("await-to-js").default;
const User = require("../Schema/UsersSchema");
const router = express.Router();
const bcrypt = require("bcrypt");
const fetchUser = require("../Settings/FetchUser");

router.get("/profile", fetchUser, async (req, res) => {
  const [errUser, user] = await to(User.findById(req.user.id));
  if (errUser || !user) {
    console.error(
      "Error retrieving user profile:",
      errUser || "User not found"
    );
    return res.status(404).json({ message: "User not found" });
  }
  const {
    password,
    __v,
    Date,
    date,
    Permission,
    TokenVersion,
    _id,
    cartData,
    CartData,
    ...userWithoutSensitiveData
  } = user.toObject();
  res.json({ user: userWithoutSensitiveData });
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
      const existingEmail = await User.findOne({
        email,
        _id: { $ne: user._id },
      });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updates.email = email;
    }
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "New password must be at least 6 characters long" });
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
    const {
      password,
      __v,
      date,
      Permission,
      tokenVersion,
      _id,
      ...userWithoutSensitiveData
    } = updatedUser.toObject();

    res.json({
      message: "Profile updated successfully",
      user: userWithoutSensitiveData,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
