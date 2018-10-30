const validator = require("validator");

const validateLoginInput = data => {
  const errors = {};

  const email = typeof data.email === "string" ? data.email.trim() : "";
  const password =
    typeof data.password === "string" ? data.password.trim() : "";

  if (!validator.isEmail(email)) {
    errors.email = "Email is invalid";
  }

  if (validator.isEmpty(email)) {
    errors.email = "Email is required";
  }

  if (validator.isEmpty(password)) {
    errors.password = "Password is required";
  }

  return errors;
};

const validateRegisterInput = data => {
  const errors = {};

  const email = typeof data.email === "string" ? data.email.trim() : "";
  const password =
    typeof data.password === "string" ? data.password.trim() : "";

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

const validateVerificationInput = data => {
  const errors = {};

  const token = typeof data.token === "string" ? data.token.trim() : "";

  if (validator.isEmpty(token)) {
    errors.token = "Verification token is required";
  }

  return errors;
};

module.exports = {
  validateLoginInput,
  validateRegisterInput,
  validateVerificationInput
};
