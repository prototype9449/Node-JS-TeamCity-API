var config = require('./../config/generalOptionHelper');
var baseSocket = require('./baseSocket');

function SettingSocket(server, storagesDetail, time, objectType) {
    this.__proto__ = new baseSocket(server, time, objectType);
    this.buildTypeStorage = storagesDetail.buildTypeStorage.storage;
    this.agentStorage = storagesDetail.agentStorage.storage;

    this.buildTypeHelper = new this.objectHelper('buildTypes', this.buildTypeStorage.getBuildTypes);
    this.agentHelper = new this.objectHelper('agents', this.agentStorage.getAgents);

    var self = this;
    var generateData = function (callback) {
        this.buildTypeHelper.generateNewObjects(function (buildTypes) {
            var buildTypesData = self.pushModels(buildTypes);
            self.agentHelper.generateNewObjects(function (agents) {
                var agentsData = self.pushModels(agents);
                var selectedSettings = config.getGeneralOptions();
                var otherSettings = config.getOtherOptions();
                var bunch =
                {
                    agents: agentsData,
                    buildTypes: buildTypesData,
                    currentSettings: selectedSettings,
                    otherSettings: otherSettings
                };
                callback(bunch);
            });
        });
    }.bind(this);

    this.sendInfo = function () {
        generateData(function (bunch) {
            for (var id in self.clients) {
                self.clients[id].socket.emit('settings', bunch);
            }
        });
    };

    this.sendInitialData = function (socket) {
        var buildTypes = self.buildTypeStorage.getBuildTypes();
        var agents = self.agentStorage.getAgents();
        var settings = config.getGeneralOptions();
        var otherSettings = config.getOtherOptions();
        var bunch =
        {
            agents: agents.agents,
            buildTypes: buildTypes.buildTypes,
            currentSettings: settings,
            otherSettings : otherSettings
        };

        socket.emit('settings', bunch);
    };

    this.createClient = function (socket) {
        this.clients[socket.id] = {
            socket: socket
        };
    };
}

module.exports = SettingSocket;