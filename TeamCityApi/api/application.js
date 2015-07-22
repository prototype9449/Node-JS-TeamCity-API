var routes = require('./libs/routes');
var methodOverride = require('method-override');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

var handlers = require('./handlers/handlerProvider').handlers;

routes.setup(app, handlers);

var port = process.env.PORT || 8080;
app.listen(port);