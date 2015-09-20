var config = require('./../config/generalOptionHelper');
var baseSocket = require('./baseSocket');
var ConfigManager = require('./../config/configManager');
var configManager = new ConfigManager();
var socketPathHelper= require('./../config/socketPathHelper');

function SettingSocket(server, storagesDetail, ioInstance) {
    this.__proto__ = new baseSocket(server, socketPathHelper.settingsPath, ioInstance);
    this.buildTypeStorage = storagesDetail.buildTypeStorage.storage;
    this.agentStorage = storagesDetail.agentStorage.storage;

    this.buildTypeHelper = new this.objectHelper('buildTypes', this.buildTypeStorage.getBuildTypes);
    this.agentHelper = new this.objectHelper('agents', this.agentStorage.getAgents);

    var self = this;

    var getIndexOfBuildTypeByAgent = function (agentName, buildTypes) {
        var agentFixBuilds = config.getGeneralOptions().agentFixBuilds;
        if (!agentFixBuilds) return -1;

        var agentNames = agentFixBuilds.map(function (value) {
            return value.agentName;
        });
        var buildTypeIds = agentFixBuilds.map(function (value) {
            return value.buildTypeId;
        });
        var agentIndex = agentNames.indexOf(agentName);
        var currentBuildType = buildTypeIds[agentIndex];
        var buildTypes = buildTypes.map(function (value) {
            return value.id;
        });
        return buildTypes.indexOf(currentBuildType);
    }.bind(this);

    var getSettings = function (buildTypes, agentsFromStorage) {
        var agents = agentsFromStorage.map(function (value) {
            return {
                agentName: value.name,
                indexOfBuildType: getIndexOfBuildTypeByAgent(value.name, buildTypes)
            }
        });
        return {
            agents: agents,
            buildTypes: buildTypes
        };
    };

    var sendBuildTypes = function () {
        this.buildTypeHelper.generateNewObjects(function (buildTypes) {
            var agentsFromStorage = self.agentStorage.getAgents().agents;
            self.sendDataToAllClients('settings', getSettings(buildTypes, agentsFromStorage))
        });

    }.bind(this);

    var sendAgents = function () {
        self.agentHelper.generateNewObjects(function (agentsFromStorage) {
            var buildTypes = self.buildTypeStorage.getBuildTypes().buildTypes;
            self.sendDataToAllClients('settings', getSettings(buildTypes, agentsFromStorage))
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

        this.sendDataToAllClients('urls', allUrls);

    }.bind(this);


    this.sendInfo = function () {
        sendAgents();
        sendBuildTypes();
        sendUrls();
    };

    this.sendInitialData = function (socket) {
        var buildTypes = self.buildTypeStorage.getBuildTypes().buildTypes;
        var agentsFromStorage = self.agentStorage.getAgents().agents;
        socket.emit('settings', getSettings(buildTypes, agentsFromStorage));
        sendUrls();
    };

    this.createClient = function (socket) {


        this.clients[socket.id] = {
            socket: socket
        };
    };
}

module.exports = SettingSocket;