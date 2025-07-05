const { override, addDecoratorsLegacy } = require("customize-cra");

module.exports = override(addDecoratorsLegacy());

/*
const rewireMobX = require('react-app-rewire-mobx');

// config-overrides.js
module.exports = function override(config, env) {
  config = rewireMobX(config, env);
  return config;
}
*/
