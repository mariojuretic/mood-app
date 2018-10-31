const jwt = require("jsonwebtoken");

const User = require("../models/user");

const authenticate = (req, res, next) => {
  const token = req.header("x-auth");
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).send();
  }

  User.findOne({ _id: decoded._id })
    .then(user => {
      if (!user) {
        return res.status(401).send();
      }

      req.user = user;
      next();
    })
    .catch(err => res.status(500).send());
};

module.exports = authenticate;
