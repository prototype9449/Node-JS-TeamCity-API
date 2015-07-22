var routes = require('./libs/routes');
var methodOverride = require('method-override');
var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

// Если произошла ошибка валидации, то отдаем 400 Bad Request
app.use(function (err, req, res, next) {
  logger.info(err.name);
  logger.info(err);
  console.log("Если произошла ошибка валидации, то отдаем 400 Bad Request");
  console.log(err.name);
  if (err.name == "ValidationError") {
    res.send(400, err);
  } else {
    next(err);
  }
});

// Если же произошла иная ошибка то отдаем 500 Internal Server Error
app.use(function (err, req, res, next) {
  logger.info(err.name);
  logger.info(err);
  console.log("Если же произошла иная ошибка то отдаем 500 Internal Server Error");
  console.log(err.name);
  res.send(500, err);
});

var handlers = {
  entities : require('./handlers/handlerProvider').handlers.test,
  build    : require('./handlers/handlerProvider').handlers.build
 // error    : require('./handlers/handlerProvider').handlers.error
};
routes.setup(app, handlers); // Связуем Handlers с Routes

var port = process.env.PORT || 8080;
app.listen(port);