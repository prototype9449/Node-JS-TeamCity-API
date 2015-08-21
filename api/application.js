var routes = require('./requestHandlers/routes');
var methodOverride = require('method-override');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();
var server = require('http').createServer(app);

var ObjectStorage = require('./libs/storage/objectStorage').ObjectStorage;
var storage = new ObjectStorage();

var DataProvider = new require('./libs/storage/dataProvider');
var dataProvider = new DataProvider(storage, 4000);
dataProvider.start();

require('./libs/sockets/socketRunner').RunSocket(server, storage);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

var handlers = require('./requestHandlers/handlerProvider').handlers;
routes.setup(app, handlers);



var port = process.env.PORT || 8080;
server.listen(port);