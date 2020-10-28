const api = require('../endpoint/api');
const acp = require('../endpoint/acp');

const routing = {
  'api': api,
  'admin': acp
}

module.exports = routing;
