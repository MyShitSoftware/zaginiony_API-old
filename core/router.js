const express = require('express');
const app = express();
const port = 3080;
const logger = require('../core/logger');
const cors = require('cors');
const mysqlAdmin = require('node-mysql-admin');
const routing = require('../config/router');
const services = require('../config/services');

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

app.get('/', async (req, res) => {
  res.json({ success: true });
});

app.use(mysqlAdmin(app));

app.use(async function(req, res, next){
  let url = req.url.split('/');
  url = url.filter((param) => {
    if(param != '' || param != ' ') return param;
  });
  if (routing[url[0]] && routing[url[0]][url[1]] && routing[url[0]][url[1]].provider) {
    const provider = routing[url[0]][url[1]];
    if ( provider.method != req.method ) {
      res.json({ success: false, error: 'Wrong method!' });
    }
    else {
      if ( provider.method === 'GET' ) {
        if (services[url[0]][provider.provider]) {
          const response = await services[url[0]][provider.provider](url[2]);
          res.json( response );
        }
        else {
          res.status(500);
          res.json({ success: false, error: 'Interial error' });
        }
      }
      else if ( provider.method === 'POST' ) {
        res.json({ success: true });
      }
    }
  } else {
    res.status(404);
    res.json({ success: false, error: 'Not found' });
  }
});


app.listen(port, () => {
logger.log('API', `Listening on: http://localhost:${port}`);
})

module.exports = app;