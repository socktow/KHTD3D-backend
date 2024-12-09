require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const setupMiddleware = require("./Settings/SetupMiddlleware");
const setupCronJobs = require("./Settings/Cron");
const userRoutes = require("./Routes/userRoutes");
const applyAdminMiddleware = require("./Routes/adminRoutes");
const cors = require("cors");
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

applyAdminMiddleware(app);

const allowedOrigins = [
  "http://localhost:3000",
  "https://kiemhieptinhduyen.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "token"]
}));

setupCronJobs();
// Khởi chạy server
app.listen(PORT, (error) => {
  if (error) {
    console.error("Error starting server:", error);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
