var methodOverride = require('method-override');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var StorageManager = require('./libs/storage/storageManager');
var DataProvider = require('./libs/storage/dataProvider');
var http = require('http');
var SocketRunner = require('./libs/sockets/socketRunner').SocketRunner;
var app = express();
var server = http.createServer(app);
var globalHelper= require('./libs/config/globalHelper');
app = require('./libs/helpers/configurateApp')(app);

var storages, dataProvider, socketRunner;

var start = function(){
    storages = new StorageManager().getStorages();
    dataProvider = new DataProvider(storages, globalHelper.timeTickPullingData);
    socketRunner = new SocketRunner(server, storages, globalHelper.timeTickSendingData);
    dataProvider.start();
    socketRunner.start();
};

var stop = function(){
    dataProvider.stop();
    socketRunner.stop();
    delete socketRunner;
    delete dataProvider;
};

start();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());



var port = process.env.PORT || globalHelper.port;
server.listen(port);