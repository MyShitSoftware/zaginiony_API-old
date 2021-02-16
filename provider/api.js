const mysql = require('../core/mysql');
const p24_api = require('../core/p24-api');
const logger = require('../core/logger');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const redis = require("redis");
const client = redis.createClient();

client.on("error", function(error) {
  logger.error('REDIS', error);
});

module.exports = {
  async get_status({ data: id }) {
    const server_status = await new Promise((resolve) => {
      client.get('server_status', (err, data) => {
        if (err) resolve(null);
        resolve(JSON.parse(data));
      });
    });

    if(!id) {
      return { success: false, error: 'No servers selected' };
    }
    if(server_status[id]) {
      return { success: true, response: server_status[id] };
    }
    return { success: false, error: 'Server not found' };
  },

  async get_shop_items() {
    const response = await mysql.query('SELECT * FROM shop_items');
    return { success:true, response: response.result };
  },

  async login({ data: { login, password }, session, req, res }) {
    const user = await mysql.query('SELECT * FROM users WHERE user = $[login] LIMIT 1', { login });
    if (user.success) {
      return new Promise(async (resolve) => {
        bcrypt.compare(password, user.result[0].pass, function(err, result) {
          if(result) {
            let user_session = makeid(64);
            client.set(user_session, JSON.stringify({ id: user.result[0].id, token: user_session, user: user.result[0].user, email: user.result[0].email, avatar: user.result[0].avatar, permission: user.result[0].permission, steam_id: user.result[0].steam_id }));
            res.setHeader('x-auth-token', user_session);
            resolve({ success: true, message: 'Login success', token: user_session });
          }
          else {
            resolve({ success: false, error: 'Wrong password!' });
          }
        });
      });
    }
    else {
      return { success: false, error: 'User not found!', err: user.err };
    }
  },

  async gen_pass({ data }) {
    return new Promise(async (resolve) => {
      bcrypt.hash(data, saltRounds, function(err, hash) {
        resolve({ success: true, hash });
      });
    });
  },

  async create_payment({ data: { buyItemName, shopItemPlayerNick, shopItemPlayerDsc, shopItemMonths, ShopItemServer, buyItemId, shopItemPlayerEmail, shopItemPlayerSum } }) {
    const p24 = new p24_api(false);
    const id = await mysql.query(`INSERT INTO orders
    (date, player_server_name, player_discord_name, buy_item, buy_item_time, pay_price, payment_proceed, proceed_srv, proceed_dsc, buy_srv_type, email)
    VALUES (NOW(), $[player_server_name], $[player_discord_name], $[buy_item], $[buy_item_time], $[pay_price], 0, 0, 0, $[ShopItemServer], $[email])`,
    { player_server_name: shopItemPlayerNick, player_discord_name: shopItemPlayerDsc, buy_item: buyItemId, buy_item_time: shopItemMonths, pay_price: shopItemPlayerSum, ShopItemServer, email: shopItemPlayerEmail });

    if(id) {
      return await p24.createTransaction(`Zamówienie: ${id.id}`, Number(shopItemPlayerSum)*100, buyItemName, shopItemPlayerEmail);
    }
    else {
      return { success: false }
    }
  },
  async confirm_transaction({ data: { merchantId, posId, sessionId, amount, originAmount, currency, orderId, methodId, statement, sign } }) {
    const p24 = new p24_api(false);
    const confirm = await p24.confirmTransaction(sessionId, amount, currency, orderId);
    const sessionIdNew = sessionId.replace('Zamówienie: ', '');
    if ( confirm.success ) {
      mysql.query('UPDATE orders SET payment_proceed = 1 WHERE id = $[sessionIdNew]', { sessionIdNew });
      return { success: true };
    }
    return { success: false };
  }
}

function makeid(length, type = 0) {
  let result           = '';
  const characters = type === 0 ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' : '0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}