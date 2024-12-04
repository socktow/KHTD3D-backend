require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const setupMiddleware = require("./config/middleware");
const setupCronJobs = require("./tasks/cron");
const authRoutes = require("./Router/Auth");
const userRouter = require("./Router/User");
const resetpasswordRouters = require("./Router/User/ForgetPassword");

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// Kết nối MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Cài đặt middleware
setupMiddleware(app);

// Routes
app.use("/api", authRoutes);
app.use("/api", userRouter);
app.use("/api", resetpasswordRouters);

// Cron jobs
setupCronJobs();

// Khởi chạy server
app.listen(PORT, (error) => {
  if (error) {
    console.error('Error starting server:', error);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
