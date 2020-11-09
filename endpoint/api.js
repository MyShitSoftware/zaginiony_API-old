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
    method: 'POST',
    auth: false,
    validator: {
      shopItemPlayerNick: {
        type: 'string',
        require: true
      },
      shopItemPlayerDsc: {
        type: 'string',
        require: true
      },
      shopItemMonths: {
        type: 'number',
        require: true
      },
      ShopItemServer: {
        type: 'number',
        require: true
      },
      buyItemId: {
        type: 'number',
        require: true
      },
      shopItemPlayerEmail: {
        type: 'email',
        require: true
      },
      shopItemPlayerSum: {
        type: 'number',
        require: true
      },
      buyItemName: {
        type: 'string',
        require: true
      }
    }
  },
  confirm_transaction: {
    provider: 'confirm_transaction',
    method: 'POST',
    auth: false,
    validator: {
      merchantId: {
        type: 'number',
        require: true
      },
      posId: {
        type: 'number',
        require: true
      },
      sessionId: {
        type: 'string',
        require: true
      },
      amount: {
        type: 'number',
        require: true
      },
      originAmount: {
        type: 'number',
        require: true
      },
      currency: {
        type: 'string',
        require: true
      },
      orderId: {
        type: 'number',
        require: true
      },
      methodId: {
        type: 'number',
        require: true
      },
      statement: {
        type: 'string',
        require: true
      },
      sign: {
        type: 'string',
        require: true
      }
    }
  }
};

module.exports = api;