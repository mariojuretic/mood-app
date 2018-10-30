const express = require("express");
const router = express.Router();

const { validateRegisterInput } = require("../../validations/user");

// @route   POST /api/users/register
// @desc    Register new user
// @access  Public
router.post("/register", (req, res) => {
  const errors = validateRegisterInput(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).send(errors);
  }

  res.send({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
});

module.exports = router;
