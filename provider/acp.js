const mysql = require('../core/mysql');
const querier = require('../modules/querier');

module.exports = {
  async get_user_details({ session }) {
    return { success:true, result: session }
  },

  async management_sales_report({ data }) {
    if (data) {
      const response = await mysql.query(`
      SELECT
        o.id,
        DATE_FORMAT(o.date, '%Y/%m/%d %H:%i:%s') as date,
        o.player_server_name,
        o.player_discord_name,
        si.title as buy_item,
        o.buy_item_time,
        o.pay_price,
        o.payment_proceed,
        o.proceed_srv,
        o.proceed_dsc,
        o.buy_srv_type
      FROM orders o
      LEFT JOIN shop_items si on o.buy_item=si.id
      WHERE o.id = $[id]
      `, { id: data });
      if( response.success ) {
        return { success: true, response: response.result[0] };
      }
      return { success: false };
    }
    const response = await mysql.query(`
    SELECT
      o.id,
      DATE_FORMAT(o.date, '%Y/%m/%d %H:%i:%s') as date,
      o.player_server_name,
      o.player_discord_name,
      si.title as buy_item,
      o.buy_item_time,
      o.pay_price,
      o.payment_proceed,
      o.proceed_srv,
      o.proceed_dsc,
      o.buy_srv_type
    FROM orders o
    LEFT JOIN shop_items si on o.buy_item=si.id
    `);
    if (response.success) {
      return { success: true, response: response.result };
    }
    return { success: false };
  },

  async management_sales_report_update({ data: { id, payment_proceed, proceed_srv, proceed_dsc } }) {
    const response = await mysql.query(`
    UPDATE orders SET
      payment_proceed = $[payment_proceed],
      proceed_srv = $[proceed_srv],
      proceed_dsc = $[proceed_dsc]
    WHERE id = $[id]
    `, { id, payment_proceed, proceed_srv, proceed_dsc });
    if (response.success) {
      return { success: true };
    }
    return { success: false };
  },

  async management_server_list() {
    const result = [];
    const promises = [];
    const status = await mysql.query('SELECT id, server_ip as ip, query_port, rcon_port, type as category, rcon_password FROM servers');
    status.result.forEach((server) => {
      const tool = new querier(server.ip, server.query_port, server.rcon_port, server.rcon_password);
      tool.connect();
      promises.push(
        new Promise(async (resolve) => {
          const query = await tool.showInfo();
          if(query.status) {
            result.push({ id: server.id, ip: server.ip, query_port: server.query_port, rcon_port: server.rcon_port, category: server.category, name: query.name, status: 1 });
            resolve(query);
          }
          else {
            result.push({ id: server.id, ip: server.ip, query_port: server.query_port, rcon_port: server.rcon_port, category: server.category, name: 'OFFLINE', status: 0 });
            resolve(query);
          }
          tool.disconnect();
        })
      );
    });
    await Promise.all(promises);
    return { success:true, response: result };
  }
}