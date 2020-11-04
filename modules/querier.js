const Gamedig = require('gamedig');
const Rcon = require('../core/node-rcon');
const logger = require('../core/logger');

class query {
  #info; #conn; #auth = 0;

  constructor(address, query_port, rcon_port, rcon_pass) {
    this.connectToRcon(address, rcon_port, rcon_pass);
    this.#info = Gamedig.query({
      type: 'arkse',
      host: address,
      port: query_port
    }).catch((error) => {
      this.#info = 0;
      logger.log('RCON', "Unable to connect!");
    });
  }

  async showInfo() {
    let result = {};
    let players_formatted = [];

    const info = await this.#info;
    if(info) {
      if (this.#auth) {
        this.#conn.send('listplayers');

        let players = await new Promise((resolve, reject) => {
          this.#conn.on('response', (str) => {
            resolve(str);
          });
        });
        result.name = info.name;

        players = players.split('\n');
        players.forEach((el) => {
          if(el != '' && el != " ") {
            el = el.replace(/[0-9]. / , '');
            el = el.split(', ');
            players_formatted.push(el);
          }
        });
        result.numplayers = players_formatted[0] == "No Players Connected " ? 0 : players_formatted.length;
        result.players = players_formatted;
      }
      else {
        result.numplayers = info.raw.numplayers;
        result.players = info.players;
      }

      result.status = 1;
      result.name = info.name;
      result.maxplayers = info.maxplayers;
      result.ping = info.ping;
      result.connect = info.connect;

    }
    else {
      result.status = 0;
    }
    return result;
  }

  disconnect() {
    this.#conn.disconnect();
  }

  connectToRcon(address, rcon_port, rcon_pass) {
    this.#conn = new Rcon(address, rcon_port, rcon_pass);
    this.#conn.connect();

    this.#conn.on('connect', () => {
      logger.log('RCON', 'Connected, trying to authorize!');
    }).on('auth', () => {
      logger.log('RCON', "Authed!");
      this.#auth = 1;
    }).on('end', function() {
      logger.log('RCON', "Socket closed!");
    }).on('error', (err) => {
      this.#conn.disconnect();
    });
  }
}

module.exports = query;