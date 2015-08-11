var routes = require('./libs/routes');
var methodOverride = require('method-override');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var fs = require('fs');

var app = express();
var server = require('http').createServer(app);
require('./libs/socketManager').RunSocket(server);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

var handlers = require('./requestHandlers/handlerProvider').handlers;
routes.setup(app, handlers);

var port = process.env.PORT || 8080;
server.listen(port);