const mongoose = require("mongoose");

const userGiftCodeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: String,
    required: true
  },
  giftcode: {
    type: String,
    required: true
  },
  serverId: {
    type: String, 
    required: true
  },
  status: {
    type: Number,
    enum: [0, 1],
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("UserGiftCode", userGiftCodeSchema);
