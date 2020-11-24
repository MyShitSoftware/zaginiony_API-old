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
      query = await new Promise((resolve) => {
        Object.keys(data).forEach((key, idx, array) => {
          query = query.replace(`$[${key}]`, `'${data[key]}'`)
          query = query.replace(`$[${key}]`, `'${data[key]}'`)
          query = query.replace(`$[${key}]`, `'${data[key]}'`)
          query = query.replace(`$[${key}]`, `'${data[key]}'`)
          query = query.replace(`$[${key}]`, `'${data[key]}'`)
          if (idx === array.length - 1){
            resolve(query);
          }
        })
      });
      logger.debug('MySQL', query);
      const result = await new Promise((resolve) => {
        conn.query(query, (error, result) => {
          if (error) {
            resolve({ success: false, err: error });
          }
          else {
            if(result.length) {
              resolve({ success: true, result: result });
            }
            else if(result.insertId) {
              resolve({ success: true, id: result.insertId });
            }
            else {
              resolve({ success: false, error: 'no data' });
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
