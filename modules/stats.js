const querier = require('./querier');
const logger = require('../core/logger');
const mysql = require('../core/mysql');
const redis = require("redis");
const client = redis.createClient();
const cron = require('node-cron');

let config;

cron.schedule('*/15 * * * *', () => {
  logger.log('CRON', 'Running stats scripts');
  gen_stats();
})

gen_stats();

async function gen_stats () {
  if (!config) config = await init();
  const server_status = {};
  const players_database = (await mysql.query(`SELECT * FROM players`)).result;

  await new Promise((resolve) => {
    const resolve_number = config.result.length;
    let item = 1;
    config.result.forEach(async (config_elem) => {
      const tool = new querier(config_elem.server_ip, config_elem.query_port, config_elem.rcon_port, config_elem.rcon_password);
      await tool.connect();

      const server_info = await tool.showInfo();
      server_info.id = config_elem.id;
      if (!server_info.status) {
        server_info.ping = null;
        server_info.maxplayers = null;
        server_info.numplayers = null;
        server_info.players = [];
        server_info.name = config_elem.server_name ? config_elem.server_name : 'Brak nazwy serwera w pamięci';
      }

      if (!server_status[config_elem.type]) {
        server_status[config_elem.type] = {};
      }
      server_status[config_elem.type][server_info.id] = server_info;

      if (config_elem.server_name !== server_info.name) {
        mysql.query(`
        UPDATE servers
        SET server_name = $[server_name]
        WHERE id = $[id]
        `, { server_name: server_info.name, id: config_elem.id });
      }

      if (server_info.players && server_info.players.length) {
        server_info.players.forEach((player) => {
          if(player[1]) {
            if(!players_database.length) {
              mysql.query(`
              INSERT INTO players
              (
                nick,
                steam_id,
                first_login,
                last_login,
                last_server_id,
                last_server_type
              )
              VALUES
              (
                $[nick],
                $[steam_id],
                NOW(),
                NOW(),
                $[server_id],
                $[server_type]
              )
              `, { nick: player[0], steam_id: player[1], server_id: server_info.id, server_type: config_elem.type });
            } else {
              const player_found = players_database.find(player_database => Number(player_database.steam_id) === Number(player[1]));
              if (player_found) {
                mysql.query(`
                UPDATE players
                SET
                  last_login = NOW(),
                  last_server_id = $[server_id],
                  last_server_type = $[server_type]
                WHERE steam_id = $[steam_id]
                `, { steam_id: player[1], server_id: server_info.id, server_type: config_elem.type });
              } else {
                mysql.query(`
                INSERT INTO players
                (
                  nick,
                  steam_id,
                  first_login,
                  last_login,
                  last_server_id,
                  last_server_type
                )
                VALUES
                (
                  $[nick],
                  $[steam_id],
                  NOW(),
                  NOW(),
                  $[server_id],
                  $[server_type]
                )
                `, { nick: player[0], steam_id: player[1], server_id: server_info.id, server_type: config_elem.type });
              }
            }
          }
        });
      }

      mysql.query(`
      INSERT INTO stats
      (
        \`date\`,
        server_id,
        online_players,
        max_players,
        ping,
        server_status
      )
      VALUES
      (
        NOW(),
        $[server_id],
        $[online_players],
        $[max_players],
        $[ping],
        $[server_status]
      )
      `, { server_id: server_info.id, online_players: server_info.numplayers, max_players: server_info.maxplayers, ping: server_info.ping, server_status: server_info.status });
      tool.disconnect();

      if(item === resolve_number) resolve(true);
      item++;
    });
  });

  client.set('server_status', JSON.stringify(server_status))
}

async function init () {
 return await mysql.query('SELECT * FROM servers');
}