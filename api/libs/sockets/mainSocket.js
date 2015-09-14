var config = require('./../config/generalOptionHelper');
var baseSocket = require('./baseSocket');

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
    this.sendInfo = function () {

        this.generalBuildHelper.generateNewObjects(function (builds) {
            var buildsData = self.pushModels(builds);
            for (var id in self.clients) {
                self.clients[id].socket.emit('generalBuilds', buildsData);
            }
        }, this.buildCount);

        this.additionalBuildHelper.generateNewObjects(function (builds) {
            var buildsData = self.pushModels(builds);
            for (var id in self.clients) {
                self.clients[id].socket.emit('additionalBuilds', buildsData);
            }
        });

        this.agentHelper.generateNewObjects(function (agents) {
            var agentsData = self.pushModels(agents);
            for (var id in self.clients) {
                self.clients[id].socket.emit('agents', agentsData);
            }
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

        socket.on('launchBuild', function(agent){
            self.launchBuildByAgent(agent,socket);
        });
        this.clients[socket.id] = {
            socket: socket
        };
    };
}

module.exports = MainSocket;