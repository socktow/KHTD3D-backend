const mongoose = require("mongoose");
const GameidSchema = new mongoose.Schema({
  Account: {
    type: String,
    required: true, 
  },
  GameID: {
    type: String,
    required: true, 
    unique: true,
  },
  Character: {
    type: String,
    required: true,
  },
});

// Create and export the model
module.exports = mongoose.model("Gameid", GameidSchema);
