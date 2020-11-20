const api = {
  get_user_details: {
    provider: 'get_user_details',
    method: 'GET',
    auth: true,
  },
  management_sales_report: {
    provider: 'management_sales_report',
    method: 'GET',
    auth: true,
  },
  management_server_list: {
    provider: 'management_server_list',
    method: 'GET',
    auth: true,
  },
  management_sales_report_update: {
    provider: 'management_sales_report_update',
    method: 'POST',
    auth: true,
    validator: {
      id: {
        type: 'number',
        require: true
      },
      payment_proceed: {
        type: 'number',
        require: true
      },
      proceed_srv: {
        type: 'number',
        require: true
      },
      proceed_dsc: {
        type: 'number',
        require: true
      },
    },
  },
};

module.exports = api;