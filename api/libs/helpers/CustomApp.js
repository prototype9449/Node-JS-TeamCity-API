var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var launchBuild = require('./buildLaunchHelper');
var ConfigManager = require('../config/configManager');
var configManager = new ConfigManager();
var express = require('express');
var globalHelper= require('./../config/globalHelper');
var StorageManager = require('./../../libs/storage/storageManager');
var DataProvider = require('./../../libs/storage/dataProvider');
var SocketRunner = require('./../../libs/sockets/socketRunner').SocketRunner;

function CustomApp () {
    this.app = express();
    this.storages = {};
    this.dataProvider = {};
    this.socketRunner = {};

    this.app.use(morgan('dev'));
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use(methodOverride());
    var self = this;
    this.app.post('/changeUrl', function (req, res) {
        var url = req.body.url;
        var userName = req.body.user;
        self.stop();
        self.start();
        configManager.chooseGeneralTeamCity(url, userName);
        res.end();
    });

    this.app.post('/launchBuild', function (req, res) {
        var agent = req.body.agent;
        launchBuild(agent).then(function () {
            res.end('success');
        }, function () {
            res.end('error');
        });
    });

    this.start = function(){
        this.storages = new StorageManager().getStorages();
        this.dataProvider = new DataProvider(this.storages, globalHelper.timeTickPullingData);
        this.socketRunner = new SocketRunner(this.server, this.storages, globalHelper.timeTickSendingData);
        this.dataProvider.start();
        this.socketRunner.start();
    };

    this.stop = function(){
        this.dataProvider.stop();
        this.socketRunner.stop();
        delete this.socketRunner;
        delete this.dataProvider;
    };

    this.setServer = function(server){
        this.server = server;
    }
}
module.exports = CustomApp;