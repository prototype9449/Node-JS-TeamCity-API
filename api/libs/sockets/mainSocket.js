var config = require('./../helpers/generalConnectionOptionHelper');
var baseSocket = require('./baseSocket');
var launchBuild = require('../providers/jsonBuildProvider').launchBuildConfiguration;

function MainSocket(server, storages, time, objectType) {
    this.__proto__ = new baseSocket(server, time, objectType);
    this.buildStorage = storages.buildStorage;
    this.agentStorage = storages.agentStorage;

    this.buildHelper = new this.objectHelper('builds', this.buildStorage.getBuilds);
    this.agentHelper = new this.objectHelper('agents', this.agentStorage.getAgents);
    this.buildCount = 10;

    var self = this;

    this.sendInfo = function (clients) {
        self.buildHelper.generateNewObjects(function (builds) {
            var buildsData = self.pushModels(builds);
            for (var id in self.clients) {
                clients[id].socket.emit('newBuilds', buildsData);
            }
        }, this.buildCount);

        self.agentHelper.generateNewObjects(function (agents) {
            var agentsData = self.pushModels(agents);
            for (var id in self.clients) {
                clients[id].socket.emit('newAgents', agentsData);
            }
        });
    };

    this.sendInitialData = function (socket) {
        var builds = self.buildStorage.getBuilds(this.buildCount)["builds"];
        var buildsData = self.pushModels(builds);
        socket.emit('newBuilds', buildsData);

        var agents = self.agentStorage.getAgents()["agents"];
        var agentsData = self.pushModels(agents);
        socket.emit('newAgents', agentsData);
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