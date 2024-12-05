const jwt = require("jsonwebtoken");
const User = require("../Schema/UsersSchema");

const fetchUser = async (req, res, next) => {
  const token = req.header("token");
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    const user = await User.findById(data.user.id);
    if (!user) {
      return res.status(401).send("User not found.");
    }
    if (user.TokenVersion !== data.user.version) {
      return res.status(401).send("Token has been invalidated.");
    }
    req.user = data.user;
    req.isAdmin = user.Permission;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send("Invalid token.");
  }
};

module.exports = fetchUser;
