const express = require("express");
const router = express.Router();

const authenticate = require("../../middleware/authenticate");
const Rating = require("../../models/rating");
const { validateRatingInput } = require("../../validations/rating");

// @route   POST /api/ratings
// @desc    Submit new rating
// @access  Private
router.post("/", authenticate, (req, res) => {
  const errors = validateRatingInput(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).send(errors);
  }

  const value = Number(req.body.value);

  const newRating = new Rating({
    user_id: req.user._id,
    value
  });

  newRating
    .save()
    .then(rating => res.send(rating))
    .catch(err => res.status(500).send());
});

// @route   GET /api/ratings
// @desc    Fetch all ratings
// @access  Private
router.get("/", authenticate, (req, res) => {
  const errors = {};

  Rating.find({ user_id: req.user._id })
    .sort({ createdAt: -1 })
    .then(ratings => res.send(ratings))
    .catch(err => res.status(500).send());
});

module.exports = router;
