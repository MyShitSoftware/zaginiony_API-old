const api = {
  get_status: {
    provider: 'get_status',
    method: 'GET',
    auth: false
  },
  get_shop_items: {
    provider: 'get_shop_items',
    method: 'GET',
    auth: false
  },
  login: {
    provider: 'login',
    method: 'POST',
    auth: false,
    validator: {
      login: {
        type: 'string',
        require: true
      },
      password: {
        type: 'password',
        require: true
      }
    }
  },
  gen_pass: {
    provider: 'gen_pass',
    method: 'POST',
    auth: false,
    validator: {
      password: {
        type: 'password',
        require: true
      }
    }
  },
  create_payment: {
    provider: 'create_payment',
    method: 'GET',
    auth: false
  }
};

module.exports = api;