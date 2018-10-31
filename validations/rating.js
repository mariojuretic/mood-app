const validator = require("validator");

const validateRatingInput = data => {
  const errors = {};

  const value = typeof data.value === "string" ? data.value.trim() : "";

  if (!validator.isInt(value, { min: 1, max: 5 })) {
    errors.value = "Value must be a number between 1 and 5";
  }

  if (validator.isEmpty(value)) {
    errors.value = "Value is required";
  }

  return errors;
};

module.exports = { validateRatingInput };
