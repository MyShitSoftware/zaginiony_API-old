const mysql = require('../../core/mysql');
const logger = require('../../core/logger');
const moment = require('moment');

module.exports = {
  async get24() {
    const date = moment().format("YYYY-MM-DD");
    const hour = moment().format("H");
    const result = {};
    const hours24 = await mysql.query(`
    SELECT
      s.id,
      s.server_name,
      CONCAT('[', group_concat(r.result), ']') as value
    FROM servers s
    LEFT JOIN (
      SELECT
        server_id,
        JSON_OBJECT(
          'time', HOUR(s3.date),
          'online_players', FLOOR(avg(s3.online_players))
        ) result
      FROM stats s3
      WHERE DATE(s3.date) = $[date]
      GROUP BY server_id, HOUR(s3.date)
    ) r ON s.id = r.server_id
    GROUP BY s.id
    `, { date });

    result.labels = [];
    result.datasets = [];

    for(let i=0; i<=hour; i++) {
      result.labels.push(i);
    }

    hours24.result.map((data) => {
      const old_values = JSON.parse(data.value);
      const values = {};
      Object.keys(old_values).map((key) => {
        values[old_values[key].time] = old_values[key].online_players;
      });

      for(let i=0; i<hour; i++) {
        if(!values[i]) values[i] = 0;
      }
      result.datasets.push({ label: data.server_name, data: Object.values(values) });
    })

    return { success:true, response: result }
  },

  async get7d() {
    const date = moment().subtract(7, 'd').format("YYYY-MM-DD");
    const day = moment().format("DD");
    const result = {};
    const hours24 = await mysql.query(`
    SELECT
      s.id,
      s.server_name,
      CONCAT('[', group_concat(r.result), ']') as value
    FROM servers s
    LEFT JOIN (
      SELECT
        server_id,
        JSON_OBJECT(
          'date', DATE(s3.date),
          'online_players', FLOOR(avg(s3.online_players))
        ) result
      FROM stats s3
      WHERE DATE(s3.date) >= $[date]
      GROUP BY server_id, DATE(s3.date)
    ) r ON s.id = r.server_id
    GROUP BY s.id
    `, { date });

    result.labels = [];
    result.datasets = [];

    for(let i=day-6; i<=day; i++) {
      result.labels.push(i);
    }

    hours24.result.map((data) => {
      const old_values = JSON.parse(data.value);
      const values = {};
      Object.keys(old_values).map((key) => {
        values[moment(old_values[key].date).format("DD")] = old_values[key].online_players;
      });

      for(let i=day-6; i<=day; i++) {
        if(!values[i]) values[i] = 0;
      }
      result.datasets.push({ label: data.server_name, data: Object.values(values) });
    })

    return { success:true, response: result }
  },

  async get1m() {
    const date = moment().format("YYYY-MM-DD");
    const day = moment().format("DD");
    const result = {};
    const hours24 = await mysql.query(`
    SELECT
      s.id,
      s.server_name,
      CONCAT('[', group_concat(r.result), ']') as value
    FROM servers s
    LEFT JOIN (
      SELECT
        server_id,
        JSON_OBJECT(
          'date', DATE(s3.date),
          'online_players', FLOOR(avg(s3.online_players))
        ) result
      FROM stats s3
      WHERE month(s3.date) = month($[date])
        AND year(s3.date) = year($[date])
      GROUP BY server_id, DATE(s3.date)
    ) r ON s.id = r.server_id
    GROUP BY s.id
    `, { date });
    console.log(hours24)

    result.labels = [];
    result.datasets = [];

    for(let i=1; i<=day; i++) {
      result.labels.push(i);
    }

    hours24.result.map((data) => {
      const old_values = JSON.parse(data.value);
      const values = {};
      Object.keys(old_values).map((key) => {
        values[moment(old_values[key].date).format("D")] = old_values[key].online_players;
      });

      for(let i=1; i<=day; i++) {
        if(!values[i]) values[i] = 0;
      }
      result.datasets.push({ label: data.server_name, data: Object.values(values) });
    })

    return { success:true, response: result }
  }
}