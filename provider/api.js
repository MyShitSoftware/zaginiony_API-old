const querier = require('../modules/querier');
const mysql = require('../core/mysql');
const bcrypt = require('bcrypt');
const srv = [];
const saltRounds = 10;
const redis = require("redis");
const client = redis.createClient();

client.on("error", function(error) {
  logger.error('REDIS', error);
});

connect_to_servers();

module.exports = {
  async get_status({ data: id }) {
    const servers_id = id;
    const status = [];
    const status_promise = [];

    switch(servers_id) {
      case '1':
        srv.forEach(async elem => {
          if( elem.type === 1) {
            status_promise.push( new Promise(async (resolve) => {
              const query = await elem.querier.showInfo();
              resolve(query)
              status.push(query)
            }) );
          }
        });
        await Promise.all(status_promise);
        return { success: true, response: status };
      case '2':
        srv.forEach(async elem => {
          if( elem.type === 2) {
            status_promise.push( new Promise(async (resolve) => {
              const query = await elem.querier.showInfo();
              resolve(query)
              status.push(query)
            }) );
          }
        });

        await Promise.all(status_promise);
        return { success: true, response: status };
      default:
        return { success: false, error: 'No servers selected' };
    }
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
            console.log('no')
            resolve({ success: false, error: 'Wrong password!' });
          }
        });
      });
    }
    else {
      return { success: false, error: 'User not found!', err: user.err };
    }
  },

  async gen_pass({ data: { password } }) {
    return new Promise(async (resolve) => {
      bcrypt.hash(password, saltRounds, function(err, hash) {
        resolve({ success: true, hash });
      });
    });
  }
}

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function connect_to_servers() {
  const config = await mysql.query('SELECT * FROM servers');
  config.result.forEach((config_elem) => {
    const tool = new querier(config_elem.server_ip, config_elem.query_port, config_elem.rcon_port, config_elem.rcon_password);
    srv.push({
      type: config_elem.type,
      querier: tool
    });
  });
}