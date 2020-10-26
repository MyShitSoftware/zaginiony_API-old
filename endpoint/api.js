const api = {
  get_status: {
    provider: 'get_status',
    method: 'GET',
    validator: {
      id: {
        type: 'number',
        require: true
      }
    }
  },
  get_shop_items: {
    provider: 'get_shop_items',
    method: 'GET'
  }
};

module.exports = api;