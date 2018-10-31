const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  createdAt: {
    default: Date.now,
    type: Date
  },
  user_id: {
    ref: "User",
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  value: {
    required: true,
    type: Number
  }
});

const Rating = mongoose.model("Rating", RatingSchema);

module.exports = Rating;
