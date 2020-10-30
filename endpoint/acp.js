const api = {
  get_user_details: {
    provider: 'get_user_details',
    method: 'GET',
    auth: true
  },
  management_sales_report: {
    provider: 'management_sales_report',
    method: 'GET',
    auth: false
  },
  management_server_list: {
    provider: 'management_server_list',
    method: 'GET',
    auth: false
  }
};

module.exports = api;