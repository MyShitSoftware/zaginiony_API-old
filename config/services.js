const api = require('../provider/api');
const acp = require('../provider/acp');

const routing = {
  'api': api,
  'admin': acp
}

module.exports = routing;