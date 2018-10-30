const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  username: {
    required: true,
    type: String
  },
  verified: {
    default: false,
    type: Boolean
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
