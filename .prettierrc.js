const brownPrettierConfig = require("@brown-ccv/prettier-config");

/** @type {import("prettier").Config} */
module.exports = {
  // Base config
  ...brownPrettierConfig,
  // Additional plugins
  plugins: [],
  // Custom settings
  singleQuote: false,
  jsxSingleQuote: false,
};
