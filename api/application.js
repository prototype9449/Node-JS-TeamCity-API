var methodOverride = require('method-override');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var StorageManager = require('./libs/storage/storageManager');
var ConfigManager = require('./libs/config/configManager');
var DataProvider = require('./libs/storage/dataProvider');
var http = require('http');
var SocketRunner = require('./libs/sockets/socketRunner').SocketRunner;
var app = express();
var configManager = new ConfigManager();
var server = http.createServer(app);

var storages, dataProvider, socketRunner;

var start = function(){
    storages = new StorageManager().getStorages();
    dataProvider = new DataProvider(storages, 4000);
    socketRunner = new SocketRunner(server, storages);
    dataProvider.start();
    socketRunner.start();
};

var stop = function(){
    dataProvider.stop();
    socketRunner.stop();
};

start();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

app.post('/changeUrl', function(req, res) {
    var url = req.body.url;
    var userName = req.body.user;
    stop();
    start();
    configManager.chooseGeneralTeamCity(url,userName);
    res.end();
});


var port = process.env.PORT || 8080;
server.listen(port);