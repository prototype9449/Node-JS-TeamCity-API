var config = require('./../config/generalOptionHelper');
var baseSocket = require('./baseSocket');
var launchBuild = require('../providers/generalBuildProvider').launchBuildConfiguration;

function MainSocket(server, storagesDetail, time, objectType) {
    this.__proto__ = new baseSocket(server, time, objectType);
    this.generalBuildStorage = storagesDetail.generalBuildStorage.storage;
    this.additionalBuildStorage = storagesDetail.additionalBuildStorage.storage;
    this.agentStorage = storagesDetail.agentStorage.storage;

    this.generalBuildHelper = new this.objectHelper('builds', this.generalBuildStorage.getBuilds);
    this.additionalBuildHelper = new this.objectHelper('builds', this.additionalBuildStorage.getBuilds);
    this.agentHelper = new this.objectHelper('agents', this.agentStorage.getAgents);
    this.buildCount = 10;

    var self = this;

    this.sendInfo = function (clients) {
        self.generalBuildHelper.generateNewObjects(function (builds) {
            var buildsData = self.pushModels(builds);
            for (var id in self.clients) {
                clients[id].socket.emit('generalBuilds', buildsData);
            }
        }, this.buildCount);

        self.additionalBuildHelper.generateNewObjects(function (builds) {
            var buildsData = self.pushModels(builds);
            for (var id in self.clients) {
                clients[id].socket.emit('additionalBuilds', buildsData);
            }
        });

        self.agentHelper.generateNewObjects(function (agents) {
            var agentsData = self.pushModels(agents);
            for (var id in self.clients) {
                clients[id].socket.emit('agents', agentsData);
            }
        });
    };

    this.sendInitialData = function (socket) {
        var generalBuilds = self.generalBuildStorage.getBuilds(this.buildCount)["builds"];
        var generalBuildsData = self.pushModels(generalBuilds);
        socket.emit('generalBuilds', generalBuildsData);

        var additionalBuilds = self.additionalBuildStorage.getBuilds()["builds"];
        var additionalBuildsData = self.pushModels(additionalBuilds);
        socket.emit('additionalBuilds', additionalBuildsData);

        var agents = self.agentStorage.getAgents()["agents"];
        var agentsData = self.pushModels(agents);
        socket.emit('agents', agentsData);
    };

    this.createClient = function (socket) {

        socket.on('launchBuild', function (agent) {
            var agentFixBuilds = config.getAgentFixBuildsOptions();

            var buildTypeName;
            agentFixBuilds.map(function (item) {
                if (item.agentName == agent.name) {
                    buildTypeName = item.buildTypeName;
                }
            });

            if(!buildTypeName) return;

            launchBuild(buildTypeName, agent.id);
        });

        this.clients[socket.id] = {
            socket: socket
        };
    };
}

module.exports = MainSocket;