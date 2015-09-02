var methodOverride = require('method-override');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();
var server = require('http').createServer(app);

var StorageManager = require('./libs/storage/storageManager');
var storages = new StorageManager().getStorages();

var DataProvider = require('./libs/storage/dataProvider');
var dataProvider = new DataProvider(storages, 4000);
dataProvider.start();

require('./libs/sockets/socketRunner').RunSocket(server, storages);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

var port = process.env.PORT || 8080;
server.listen(port);