const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  createdAt: {
    default: Date.now,
    expires: 60, // Change to 86400 (24 hours)
    type: Date
  },
  token: {
    required: true,
    type: String
  },
  user_id: {
    ref: "User",
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

const Token = mongoose.model("Token", TokenSchema);

module.exports = Token;
