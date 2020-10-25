const querier = require('../modules/querier');
const mysql = require('../core/mysql');
const srv = [];

connect_to_servers();

module.exports = {
  async get_status(id) {
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
    return { success:true, response };
  }
}

async function connect_to_servers() {
  const config = await mysql.query('SELECT * FROM servers');
  config.forEach((config_elem) => {
    const tool = new querier(config_elem.server_ip, config_elem.query_port, config_elem.rcon_port, config_elem.rcon_password);
    srv.push({
      type: config_elem.type,
      querier: tool
    });
  });
}