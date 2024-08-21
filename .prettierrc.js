const brownPrettierConfig = require('@brown-ccv/prettier-config');

/** @type {import("prettier").Config} */
module.exports = {
  // Base config
  ...brownPrettierConfig,
  // Custom settings
  singleQuote: false,
  jsxSingleQuote: false,
};
