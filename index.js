require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const setupMiddleware = require("./Settings/SetupMiddlleware");
const setupCronJobs = require("./Settings/Cron");
const userRoutes = require("./Routes/userRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// Kết nối MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
// Cài đặt middleware
setupMiddleware(app);

// Use routes
userRoutes.forEach(({ path, router }) => {
  app.use(path, router);
});

adminRoutes.forEach(({ path, router }) => {
  app.use(path, router);
});

// PUBLIC IMAGE 
// app.use(express.static(path.join(__dirname, 'public')));
// LOCAL IMAGE 
app.use("/images", express.static("upload/images"));
// Cron jobs
setupCronJobs();

// Khởi chạy server
app.listen(PORT, (error) => {
  if (error) {
    console.error("Error starting server:", error);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
