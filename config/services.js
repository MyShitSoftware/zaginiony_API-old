const api = require('../provider/api');
const acp = require('../provider/acp');
const acp_stats = require('../provider/acp/stats');

const routing = {
  'api': api,
  'admin': acp,
  'admin-stats': acp_stats
}

module.exports = routing;