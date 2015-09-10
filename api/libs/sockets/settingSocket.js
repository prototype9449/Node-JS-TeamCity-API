var config = require('./../config/generalOptionHelper');
var baseSocket = require('./baseSocket');
var ConfigManager = require('./../config/configManager');
var configManager = new ConfigManager();

function SettingSocket(server, storagesDetail, time, objectType) {
    this.__proto__ = new baseSocket(server, time, objectType);
    this.buildTypeStorage = storagesDetail.buildTypeStorage.storage;
    this.agentStorage = storagesDetail.agentStorage.storage;

    this.buildTypeHelper = new this.objectHelper('buildTypes', this.buildTypeStorage.getBuildTypes);
    this.agentHelper = new this.objectHelper('agents', this.agentStorage.getAgents);

    var self = this;

    var sendBuildTypes = function () {
        this.buildTypeHelper.generateNewObjects(function (buildTypes) {
            sendDataToAllClients('buildTypes', buildTypes);
        });

    }.bind(this);

    var sendAgents = function () {
        self.agentHelper.generateNewObjects(function (agents) {
            sendDataToAllClients('agents', agents);
        });
    }.bind(this);

    var sendUrls = function () {
        var otherSettings = config.getOtherOptions();
        var currentConfig = {
            url: config.getGeneralOptions().connection.url,
            userName: config.getGeneralOptions().connection.auth.user
        };

        var allUrls = otherSettings.map(function (value) {
            var isCurrent = currentConfig.url === value.connection.url && currentConfig.userName === value.connection.auth.user;

            return {
                url: value.connection.url,
                userName: value.connection.auth.user,
                isCurrent: isCurrent
            };
        });

        sendDataToAllClients('urls', allUrls);

    }.bind(this);

    var sendDataToAllClients = function (eventName, data) {
        for (var id in self.clients) {
            self.clients[id].socket.emit(eventName, data);
        }
    };

    this.sendInfo = function () {
        sendAgents();
        sendBuildTypes();
        sendUrls();
    };


    this.sendInitialData = function (socket) {
        var buildTypes = self.buildTypeStorage.getBuildTypes();
        sendDataToAllClients('buildTypes', buildTypes);
        var agents = self.agentStorage.getAgents();
        sendDataToAllClients('agents', agents);
        sendUrls();
    };

    this.createClient = function (socket) {
        socket.on('new authentication', function (data) {
            var options = {
                url: data.url,
                auth: {
                    user: data.user,
                    pass: data.pass
                }
            };
            configManager.addNewTeamCity(options)
        });

        socket.on('change url', function (data) {
            //configManager.addNewTeamCity(
            var r = 1;
        });

        socket.on('change configuration', function (data) {
            configManager.changeTeamCity(data);
        });

        this.clients[socket.id] = {
            socket: socket
        };
    };
}

module.exports = SettingSocket;