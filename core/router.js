const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3080;
const logger = require('../core/logger');
const cors = require('cors');
const routing = require('../config/router');
const services = require('../config/services');
const redis = require("redis");
const client = redis.createClient();

client.on("error", function(error) {
  logger.error('REDIS', error);
});

var whitelist = ['http://localhost', 'http://localhost:3000', 'http://localhost:3080', 'http://localhost:8000', 'http://192.168.194.34:8000', 'https://zaginiony-swiat.pl', 'https://www.zaginiony-swiat.pl']
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

app.use(cookieParser());
app.use(express.json());
app.disable('x-powered-by');

app.use(cors(corsOptions));
app.use((req, res, next) => {
  logger.log('API', "URL: "+ req.url + " TYPE: " + req.method);
  next();
});

app.get('/', async (req, res) => {
  res.json({ success: true });
});

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
      const user = req.header('x-auth-token');;
      let session = null;
      if (user) {
        session = await new Promise((resolve) => {
          client.get(user, (err, data) => {
            if (err) resolve(null);
            resolve(data);
          });
        });
      }
      if ( provider.auth === true && !session) {
        res.status(401);
        res.json({ success: false, error: "You don't have access to be here!" });
      }
      else {
        session = JSON.parse(session)
        if ( provider.method === 'GET' ) {
          if (services[url[0]][provider.provider]) {
            const response = await services[url[0]][provider.provider]({ data: url[2], session, req, res });
            res.json( response );
          }
          else {
            res.status(500);
            res.json({ success: false, error: 'Interial error' });
          }
        }
        else if ( provider.method === 'POST' ) {
          if (services[url[0]][provider.provider]) {
            const validator = provider.validator;
            const err = {};

            if(validator) {
              Object.keys(validator).forEach((key) => {
                if (validator[key].require == true) {
                  if(validator[key].type == 'string' && !req.body[key]) {
                    err.err = 1;
                    err.code = `Value ${key} missing!`;
                  }
                  if(validator[key].type == 'number' && (req.body[key] === undefined || req.body[key] === null)) {
                    err.err = 1;
                    err.code = `Value ${key} missing!`;
                  }
                }
              });
            }

            if(err.err) {
              res.json({ success: false, err: err.code })
            }
            else {
              const response = await services[url[0]][provider.provider]({ data: req.body, session, req, res });
              res.json( response );
            }
          }
          else {
            res.status(500);
            res.json({ success: false, error: 'Interial error' });
          }
        }
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