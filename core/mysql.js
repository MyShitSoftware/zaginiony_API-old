const mysql = require('mysql');
const logger = require('../core/logger');
const { config } = require('../config/mysql.conf')

var conn = mysql.createConnection(config);

conn.connect(function(err) {
  if (err) {
    logger.error('MySQL', 'Error connecting');
    return;
  }

  logger.log('MySQL', 'Connected');
});

module.exports = {
  async query(query, data) {
    if(data) {
      query = await new Promise((resolve, reject) => {
        Object.keys(data).forEach((key) => {
          resolve(query.replace(`$[${key}]`, `'${data[key]}'`));
        })
      });
      logger.debug('MySQL', query);
      const result = await new Promise((resolve, reject) => {
        conn.query(query, (error, result) => {
          if (error) {
            resolve({ success: false, err: error });
          }
          else {
            if(result.length) {
              resolve({ success: true, result: result });
            }
            else {
              resolve({ success: false });
            }
          }
        });
      });
      if(result && result.success) {
        return result
      }
      else {
        return { success: false }
      }
    }
    else {
      logger.debug('MySQL', query);
      const result = await new Promise((resolve, reject) => {
        conn.query(query, (error, result, fields) => {
          if (error) resolve({ success: false });
          else {
            resolve({ success: true, result: result });
          }
        });
      });
      if(result && result.success) {
        return { success: true, result: result.result };
      }
      else {
        return { success: false }
      }
    }
  }
}
