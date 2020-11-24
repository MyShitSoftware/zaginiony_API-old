const mysql = require('../../core/mysql');
const logger = require('../../core/logger');
const moment = require('moment');

module.exports = {
  async get() {
    const date = moment().format("YYYY-MM-DD");
    const result = [];
    const hours24_result = await mysql.query(`
    SELECT
      stats.server_id,
      servers.server_name,
      CONCAT('[',
        (
          SELECT group_concat(
            JSON_OBJECT(
              'time', TIME(stats2.date),
              'online_players', stats2.online_players
            )
          )
          FROM stats stats2
          WHERE stats.server_id = stats2.server_id
          AND DATE(stats2.date) = $[date]
        )
      ,']') as value
    FROM stats
    LEFT JOIN servers ON stats.server_id = servers.id
    WHERE DATE(date) = $[date]
    GROUP BY stats.server_id
    `, { date });

    hours24_result.result.map((data) => {
      const parsed_value = JSON.parse(data.value);
      const sum_array = {};
      const time_array = [];
      const average = {};
      parsed_value.forEach((data) => {
        const time = moment(data.time, "HH:mm:ss").format("HH");
        if (time_array.includes(time)) sum_array[time].push(data.online_players);
        else {
          time_array.push(time);
          sum_array[time] = [data.online_players];
        }
      });
      for (const [key, data] of Object.entries(sum_array)) {
        average[key] = Math.floor(data.reduce( ( p, c ) => p + c, 0 ) / data.length);
      }

      const result_data = { server_id: data.server_id, server_name: data.server_name,  value: average }

      result.push(result_data);
    });

    result.forEach((data) => {
      for(let i=0; i<24; i++) {
        if(!data.value[i]) data.value[i] = 0;
      }
    });

    const chartdata = {};
    chartdata.labels = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
    chartdata.datasets = [];

    result.map((data) => {
      const values = Object.values(data.value)
      chartdata.datasets.push({ label: data.server_name, data: values });
    });

    return { success:true, response: chartdata }
  }
}