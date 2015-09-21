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
    this.server = {};
    var self = this;

    this.app.use(morgan('dev'));
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use(methodOverride());


    function getError(responce) {
        return function () {
            responce.set({
                    'Content-Type': 'text',
                    'Access-Control-Allow-Origin': '*',
                    'Status': '409'
                });
            responce.send('error');
        }
    }

    function getSuccess(responce) {
        return function () {
            responce.set({
                'Status': '202',
                'Content-Type': 'text',
                'Access-Control-Allow-Origin': '*'
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
        configManager.addNewTeamCity(options).then(getSuccess(res), getError(res));
    });

    this.app.post('/launchBuild', function (req, res) {
        var agent = req.body;
        launchBuild(agent).then(getSuccess(res), getError(res));
    });

    this.init = function () {
        console.log(process.memoryUsage());
        this.storages = new StorageManager().getStorages();
        this.dataProvider = new DataProvider(this.storages, globalHelper.timeTickPullingData);
        this.socketRunner = new SocketRunner(this.server);
        this.dataProvider.start();
        this.socketRunner.init(this.storages);
    };

    this.start = function () {
        console.log(process.memoryUsage());
        this.dataProvider.start();
        this.socketRunner.start(this.storages);
    };

    this.stop = function () {
        this.dataProvider.stop();
        this.socketRunner.stop();
    };

    this.setServer = function (server) {
        this.server = server;
    };
}
module.exports = CustomApp;