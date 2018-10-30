const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  createdAt: {
    default: Date.now,
    expires: 86400,
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
