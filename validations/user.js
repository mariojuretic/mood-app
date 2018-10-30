const validator = require("validator");

const validateRegisterInput = data => {
  const errors = {};

  const username =
    typeof data.username === "string" ? data.username.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const password =
    typeof data.password === "string" ? data.password.trim() : "";

  if (validator.isEmpty(username)) {
    errors.username = "Username is required";
  }

  if (!validator.isEmail(email)) {
    errors.email = "Email is invalid";
  }

  if (validator.isEmpty(email)) {
    errors.email = "Email is required";
  }

  if (!validator.isLength(password, { min: 8 })) {
    errors.password = "Password must be at least 8 characters";
  }

  if (validator.isEmpty(password)) {
    errors.password = "Password is required";
  }

  return errors;
};

module.exports = { validateRegisterInput };