const mysql = require('mysql');
const logger = require('../core/logger');

var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'ark_panel'
});

conn.connect(function(err) {
  if (err) {
    logger.error('MySQL', 'Error connecting');
    return;
  }

  logger.log('MySQL', 'Connected');
});

module.exports = {
  async query(query) {
    const result = await new Promise((resolve, reject) => {
      conn.query(query, (error, result, fields) => {
        if (error) logger.error('MySQL', 'Query Error');
        else {
          resolve(result);
        }
      });
    });
    return result;
  }
}
