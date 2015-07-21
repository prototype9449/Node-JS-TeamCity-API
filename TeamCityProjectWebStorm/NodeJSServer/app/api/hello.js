var winston = require('winston');
var routes = require('./routes'); // Файл с роутам
//var config = require('./libs/config'); // Используемая конфигурация
var methodOverride = require('method-override');
var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ filename: 'C:/NodeJSServer/log-file.log' }),
    ]
});

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};
console.log("test");
var app = express();
app.use(morgan('dev')); // log requests to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
var port = process.env.PORT || 8080; // set our port

//app.use(bodyParser.json()); // "Обучаем" наше приложение понимать JSON и urlencoded запросы
//app.use(bodyParser.urlencoded({'extended':'true'}));
//app.use(methodOverride()); // Переопределяем PUT и DELETE запросы для работы с WEB формами

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

// Инициализируем Handlers
var handlers = {
  entities: require('./handlers/mainHandler').handlers
};
console.log(handlers);
  routes.setup(app, handlers); // Связуем Handlers с Routes

  app.listen(process.env.PORT);