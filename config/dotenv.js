/* eslint-env node */

'use strict';

const path = require('path');

module.exports = function (/* env */) {
  return {
    clientAllowedKeys: [],
    fastbootAllowedKeys: [],
    failOnMissingKey: false,
    path: path.join(path.dirname(__dirname), '.env'),
    OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY,
    IEX_TOKEN: process.env.IEX_TOKEN,
  };
};
