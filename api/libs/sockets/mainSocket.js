var config = require('./../helpers/generalConnectionOptionHelper');
var baseSocket = require('./baseSocket');
var launchBuild = require('../providers/jsonBuildProvider').launchBuildConfiguration;

function MainSocket(server, storages, time, objectType) {
    this.__proto__ = new baseSocket(server, time, objectType);
    this.generalBuildStorage = storages.generalBuildStorage;
    this.additionalBuildStorage = storages.additionalBuildStorage;
    this.agentStorage = storages.agentStorage;

    this.generalBuildHelper = new this.objectHelper('generalBuilds', this.generalBuildStorage.getGeneralBuilds);
    this.additionalBuildHelper = new this.objectHelper('additionalBuilds', this.additionalBuildStorage.getAdditionalBuilds);
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
        var generalBuilds = self.generalBuildStorage.getGeneralBuilds(this.buildCount)["generalBuilds"];
        var generalBuildsData = self.pushModels(generalBuilds);
        socket.emit('generalBuilds', generalBuildsData);

        var additionalBuilds = self.additionalBuildStorage.getAdditionalBuilds()["additionalBuilds"];
        var additionalBuildsData = self.pushModels(additionalBuilds);
        socket.emit('additionalBuilds', additionalBuildsData);

        var agents = self.agentStorage.getAgents()["agents"];
        var agentsData = self.pushModels(agents);
        socket.emit('agents', agentsData);
    };

    this.createClient = function (socket) {

        socket.on('launchBuild', function (agentId) {
            if (agentId != 1) {
                launchBuild('Portal_PortalControls', agentId);
            } else {
                launchBuild('Portal_PortalCore', agentId);
            }
        });

        this.clients[socket.id] = {
            socket: socket
        };
    };
}

module.exports = MainSocket;