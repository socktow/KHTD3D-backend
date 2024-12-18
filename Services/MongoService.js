const mongoose = require("mongoose");

const connectToMongoDB = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB successfully");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectToMongoDB;
