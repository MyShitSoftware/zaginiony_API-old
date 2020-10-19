const express = require('express');
const app = express();
const port = 3080;
const querier = require('./modules/querier');
const logger = require('./core/logger');
const cors = require('cors');
const mysqlAdmin = require('node-mysql-admin');

var whitelist = ['http://localhost', 'http://localhost:3000', 'http://localhost:3080', 'http://localhost:8000', 'http://192.168.194.34:8000']
var corsOptions = {
    origin: function (origin, callback) {
        if(!origin) {
            callback(null, true);
            logger.log('CORS', "Allowed by CORS: local app");
        }
        else if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
          logger.log('CORS', "Allowed by CORS: " + origin);
        } else {
          callback(new Error("Not allowed by CORS"));
          logger.log('CORS', "Not allowed by CORS: " + origin);
        }
    },
    optionsSuccessStatus: 200,
    credentials: true
}
app.use(cors(corsOptions));
app.use((req, res, next) => {
  logger.log('API', "URL: "+ req.url + " TYPE: " + req.method);
  next();
});

const srv1 = new querier('zaginiony-swiat.pl', 27017, 32332, 'Azorek530');
const srv2 = new querier('zaginiony-swiat.pl', 27018, 32333, 'Azorek530');
const srv3 = new querier('zaginiony-swiat.pl', 27019, 32334, 'Azorek530');
const srv4 = new querier('zaginiony-swiat.pl', 27015, 32330, 'zagswi1');
const srv5 = new querier('zaginiony-swiat.pl', 27016, 32331, 'zagswi1');

app.get('/', async (req, res) => {
  res.json({ success: true });
});

app.get('/get_status/:id', async (req, res) => {
  const servers_id = req.params.id;
  const status = [];

  switch(servers_id) {
    case '1':
      status.push( await srv1.showInfo() );
      status.push( await srv2.showInfo() );
      status.push( await srv3.showInfo() );

      res.json({ success: true, response: status });
      break;
    case '2':
      status.push( await srv4.showInfo() );
      status.push( await srv5.showInfo() );

      res.json({ success: true, response: status });
      break;
    default:
      res.json({ success: false, error: 'No servers selected' });
  }
});

app.use(mysqlAdmin(app));

app.use('*', async (req, res) => {
  res.json({ success: false, error: 404 });
});

app.listen(port, () => {
  logger.log('API', `Listening on: http://localhost:${port}`);
})