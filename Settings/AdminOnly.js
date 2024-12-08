const AdminOnly = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

module.exports = AdminOnly;
