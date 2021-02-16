const api = require('../endpoint/api');
const acp = require('../endpoint/acp');
const acp_stats = require('../endpoint/acp/stats');

const routing = {
  'api': api,
  'admin': acp,
  'admin-stats': acp_stats
}

module.exports = routing;
