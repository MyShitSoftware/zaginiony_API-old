const mysql = require('../core/mysql');
const moment = require('moment');

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
    const status = await mysql.query(`
    SELECT
      id,
      s.server_ip as ip,
      s.query_port,
      s.rcon_port,
      s.type as category,
      s.server_name as name,
      (
        SELECT server_status
        FROM stats
        WHERE server_id = s.id
        ORDER BY date DESC
        LIMIT 1
      ) as status
    FROM servers s
    `);
    return { success:true, response: status.result };
  },

  async get_players({ data: { online } }) {
    const last_login_time = moment().subtract(15, "minutes");
    let result;
    if(online) {
      result = await mysql.query(`
      SELECT p.id, p.nick, p.steam_id, p.first_login, p.last_login, s.server_name as last_server_name, p.last_server_type
      FROM players p
      LEFT JOIN servers s ON p.last_server_id = s.id
      WHERE last_login > $[last_time]
      `, { last_time: last_login_time.format("YYYY-MM-DD HH:mm:ss") });
    }
    else {
      result = await mysql.query(`
      SELECT p.id, p.nick, p.steam_id, p.first_login, p.last_login, s.server_name as last_server_name, p.last_server_type
      FROM players p
      LEFT JOIN servers s ON p.last_server_id = s.id
      `);
    }
    if(!result.success) {
      return { success:false, error: 'No players available' }
    }
    result.result = result.result.map((key, index) => {
      if(moment(key.last_login) > last_login_time) {
        key.online = 1;
      } else {
        key.online = 0;
      }
      key.first_login = moment(key.first_login).format("YYYY-MM-DD HH:mm:ss");
      key.last_login = moment(key.last_login).format("YYYY-MM-DD HH:mm:ss");
      return key;
    });
    return { success:true, response: result.result }
  },
}