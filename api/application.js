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
var globalHelper= require('./libs/config/globalHelper');

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

app.post('/changeUrl', function(req, res) {
    var url = req.body.url;
    var userName = req.body.user;
    stop();
    start();
    configManager.chooseGeneralTeamCity(url,userName);
    res.end();
});

var launchBuild = require('./libs/helpers/buildLaunchHelper');

app.post('/launchBuild', function(req, res){
    var agent = req.body.agent;
    launchBuild(agent).then(function(){
        res.end('success');
    }, function(){
        res.end('error');
    });
});


var port = process.env.PORT || globalHelper.port;
server.listen(port);