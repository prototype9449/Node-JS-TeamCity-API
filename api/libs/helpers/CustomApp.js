var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var launchBuild = require('./buildLaunchHelper');
var ConfigManager = require('../config/configManager');
var configManager = new ConfigManager();
var express = require('express');
var globalHelper = require('./../config/globalHelper');
var StorageManager = require('./../../libs/storage/storageManager');
var DataProvider = require('./../../libs/storage/dataProvider');
var SocketRunner = require('./../../libs/sockets/socketRunner').SocketRunner;

function CustomApp() {
    this.app = express();
    this.storages = {};
    this.dataProvider = {};
    var self = this;

    this.app.use(morgan('dev'));
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use(methodOverride());


    function getError(responce) {
        return function() {
            responce.set({
                'Status': '409'
            });
            responce.send('error');
        }
    }

    function getSuccess(responce) {
        return function() {
            responce.set({
                'Status': '202'
            });
            responce.send('success');
        }
    }

    this.app.post('/changeUrl', function (req, res) {
        var url = req.body.url;
        var userName = req.body.user;
        self.stop();
        self.start();
        configManager.chooseGeneralTeamCity(url, userName);
        res.end();
    });

    this.app.post('/changeConfiguration', function (req, res) {
        res.set({
            'Content-Type': 'text'
        });
        configManager.changeTeamCity(req.body).then(getSuccess(res), getError(res));
    });

    this.app.post('/newAuthentication', function (req, res) {
        var options = {
            url: req.body.url,
            auth: {
                user: req.body.user,
                pass: req.body.pass
            }
        };
        res.set({
            'Content-Type': 'text'
        });
        configManager.addNewTeamCity(options).then(getSuccess(res), getError(res));
    });

    this.app.post('/launchBuild', function (req, res) {
        var agent = req.body;
        res.set({
            'Content-Type': 'text'
        });
        launchBuild(agent).then(getSuccess(res), getError(res));
    });

    this.start = function () {
        console.log(process.memoryUsage());
        this.storages = new StorageManager().getStorages();
        this.dataProvider = new DataProvider(this.storages, globalHelper.timeTickPullingData);
        this.dataProvider.start();
        this.socketRunner.start(this.storages);
    };

    this.stop = function () {
        this.dataProvider.stop();
        this.socketRunner.stop();
        delete this.dataProvider;
    };

    this.setServer = function (server) {
        this.server = server;
        this.socketRunner = new SocketRunner(server);
    }
}
module.exports = CustomApp;