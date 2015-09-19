var config = require('./../config/generalOptionHelper');
var baseSocket = require('./baseSocket');
var socketPathHelper= require('./../config/socketPathHelper');

function MainSocket(server, storagesDetail, ioInstance) {
    this.__proto__ = new baseSocket(server, socketPathHelper.mainPath, ioInstance);
    this.generalBuildStorage = storagesDetail.generalBuildStorage.storage;
    this.additionalBuildStorage = storagesDetail.additionalBuildStorage.storage;
    this.agentStorage = storagesDetail.agentStorage.storage;

    this.generalBuildHelper = new this.objectHelper('builds', this.generalBuildStorage.getBuilds);
    this.additionalBuildHelper = new this.objectHelper('builds', this.additionalBuildStorage.getBuilds);
    this.agentHelper = new this.objectHelper('agents', this.agentStorage.getAgents);
    this.buildCount = 10;
    var self = this;

    this.sendInfo = function () {

        this.generalBuildHelper.generateNewObjects(function (builds) {
            var buildsData = self.pushModels(builds);
            self.sendDataToAllClients('generalBuilds', buildsData);

        }, this.buildCount);

        this.additionalBuildHelper.generateNewObjects(function (builds) {
            var buildsData = self.pushModels(builds);
            self.sendDataToAllClients('additionalBuilds', buildsData);

        });

        this.agentHelper.generateNewObjects(function (agents) {
            var agentsData = self.pushModels(agents);
            self.sendDataToAllClients('agents', agentsData);

        });
    };

    this.sendInitialData = function (socket) {

        var generalBuilds = this.generalBuildStorage.getBuilds(this.buildCount)["builds"];
        var generalBuildsData = this.pushModels(generalBuilds);
        socket.emit('generalBuilds', generalBuildsData);

        var additionalBuilds = this.additionalBuildStorage.getBuilds()["builds"];
        var additionalBuildsData = this.pushModels(additionalBuilds);
        socket.emit('additionalBuilds', additionalBuildsData);

        var agents = this.agentStorage.getAgents()["agents"];
        var agentsData = this.pushModels(agents);
        socket.emit('agents', agentsData);
    };

    this.createClient = function (socket) {
        this.clients[socket.id] = {
            socket: socket
        };
    };
}

module.exports = MainSocket;