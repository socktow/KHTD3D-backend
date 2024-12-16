const express = require("express");
const connectToMongoDB = require("./Services/MongoService");
const setupMiddleware = require("./Settings/SetupMiddlleware");
const userRoutes = require("./Routes/userRoutes");
const gameRoutes = require("./Routes/gameRoutes");
const applyAdminMiddleware = require("./Routes/adminRoutes");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
setupMiddleware(app);
connectToMongoDB(MONGO_URI);
userRoutes.forEach(({ path, router }) => {
  app.use(path, router);
});
gameRoutes.forEach(({ path, router }) => {
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

app.listen(PORT, (error) => {
  if (error) {
    console.error("Error starting server:", error);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
