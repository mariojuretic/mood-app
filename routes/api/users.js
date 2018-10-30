const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const Token = require("../../models/token");
const User = require("../../models/user");
const { validateRegisterInput } = require("../../validations/user");

// @route   POST /api/users/register
// @desc    Register new user
// @access  Public
router.post("/register", (req, res) => {
  const errors = validateRegisterInput(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).send(errors);
  }

  const email = req.body.email.toLowerCase();

  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.email = "Email is already in use";
        return res.status(400).send(errors);
      }

      const newUser = new User({
        email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;

          newUser
            .save()
            .then(user => {
              const newToken = new Token({
                token: crypto.randomBytes(16).toString("hex"),
                user_id: user._id
              });

              newToken
                .save()
                .then(token => {
                  const transporter = nodemailer.createTransport({
                    service: "Sendgrid",
                    auth: {
                      pass: process.env.SENDGRID_PASS,
                      user: process.env.SENDGRID_USER
                    }
                  });

                  const mailOptions = {
                    from: "noreply@mariojuretic.com",
                    subject: "Account Verification Token",
                    text: token.token,
                    to: user.email
                  };

                  transporter.sendMail(mailOptions, err => {
                    if (err) {
                      return res.status(500).send();
                    }

                    return res.send({
                      success: `Verification email has been sent to ${
                        user.email
                      }`
                    });
                  });
                })
                .catch(err => res.status(500).send());
            })
            .catch(err => res.status(500).send());
        });
      });
    })
    .catch(err => res.status(500).send());
});

module.exports = router;
