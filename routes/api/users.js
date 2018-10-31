const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const Token = require("../../models/token");
const User = require("../../models/user");
const {
  validateLoginInput,
  validateRegisterInput,
  validateResendInput,
  validateVerificationInput
} = require("../../validations/user");

// @route   POST /api/users/login
// @desc    Log in existing user
// @access  Public
router.post("/login", (req, res) => {
  const errors = validateLoginInput(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).send(errors);
  }

  const email = req.body.email.toLowerCase();

  User.findOne({ email })
    .then(user => {
      if (!user) {
        errors.email = "User does not exist";
        return res.status(400).send(errors);
      }

      bcrypt.compare(req.body.password, user.password, (err, match) => {
        if (!match) {
          errors.password = "Password is incorrect";
          return res.status(400).send(errors);
        }

        if (!user.verified) {
          errors.verification = "Account is not verified";
          return res.status(400).send(errors);
        }

        const token = jwt.sign(
          { _id: user._id, email: user.email },
          process.env.JWT_SECRET
        );

        res.send({ token });
      });
    })
    .catch(err => res.status(500).send());
});

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

                    res.send({
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

// @route   POST /api/users/verification
// @desc    Confirm email address
// @access  Public
router.post("/verification", (req, res) => {
  const errors = validateVerificationInput(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).send(errors);
  }

  Token.findOne({ token: req.body.token })
    .then(token => {
      if (!token) {
        errors.token = "Token is invalid or has expired";
        return res.status(400).send(errors);
      }

      User.findOne({ _id: token.user_id })
        .then(user => {
          if (!user) {
            errors.user = "User does not exist";
            return res.status(400).send(errors);
          }

          if (user.verified) {
            errors.verification = "This account has already been verified";
            return res.status(400).send(errors);
          }

          user.verified = true;

          user
            .save()
            .then(user =>
              res.send({
                success: "You have successfully verified your account"
              })
            )
            .catch(err => res.status(500).send());
        })
        .catch(err => res.status(500).send());
    })
    .catch(err => res.status(500).send());
});

// @route   POST /api/users/verification/resend
// @desc    Resend confirmation email
// @access  Public
router.post("/verification/resend", (req, res) => {
  const errors = validateResendInput(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).send(errors);
  }

  const email = req.body.email.toLowerCase();

  User.findOne({ email })
    .then(user => {
      if (!user) {
        errors.email = "User does not exist";
        return res.status(400).send(errors);
      }

      if (user.verified) {
        errors.verification = "This account has already been verified";
        return res.status(400).send(errors);
      }

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

            res.send({
              success: `Verification email has been sent to ${user.email}`
            });
          });
        })
        .catch(err => res.status(500).send());
    })
    .catch(err => res.status(500).send());
});

module.exports = router;
