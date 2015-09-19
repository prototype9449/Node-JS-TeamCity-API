var express = require('express');
var router = express.Router();
var launchBuild = require('./buildLaunchHelper');
var ConfigManager = require('../config/configManager');
var configManager = new ConfigManager();

function configurateApp (app) {
    app.post('/changeUrl', function (req, res) {
        var url = req.body.url;
        var userName = req.body.user;
        stop();
        start();
        configManager.chooseGeneralTeamCity(url, userName);
        res.end();
    });

    app.post('/launchBuild', function (req, res) {
        var agent = req.body.agent;
        launchBuild(agent).then(function () {
            res.end('success');
        }, function () {
            res.end('error');
        });
    });
    return app;
}
module.exports = configurateApp;