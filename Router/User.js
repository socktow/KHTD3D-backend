const express = require("express");
const User = require("../Schema/UsersSchema");
const router = express.Router();
const jwt = require("jsonwebtoken");

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

module.exports = router;
