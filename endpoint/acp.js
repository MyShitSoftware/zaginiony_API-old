const api = {
  get_user_details: {
    provider: 'get_user_details',
    method: 'POST',
    auth: true
  },
  management_server_list: {
    provider: 'management_server_list',
    method: 'GET',
    auth: false
  }
};

module.exports = api;