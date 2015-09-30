var baseSocket = require('./baseSocket');
var socketPathHelper = require('./../config/socketPathHelper');

function SocketManager(server, storageDetails, ioInstance) {
    this.__proto__ = new baseSocket(server, socketPathHelper.buildPath, ioInstance);
    this.generalBuildStorage = storageDetails.generalBuildStorage.storage;
    this.agentStorage = storageDetails.agentStorage.storage;
    var self = this;

    this.sendInfo = function () {
        for (var id in self.clients) {
            var client = self.clients[id];

            (function (client) {

                client.generalBuildHelper.generateNewObjects(function (build) {
                    var buildsData = self.pushModels(build);
                    client.socket.emit('build', buildsData);
                });

                client.historyHelper.generateNewObjects(function (buildHistory) {
                    var buildsData = self.pushModels(buildHistory);
                    client.socket.emit('buildHistory', buildsData);
                });
            })(client)

        }
    };

    this.sendInitialData = function (socket) {
        this.sendInfo(this.clients);
    };

    this.createClient = function (socket) {
        var id = socket.handshake.query.id;

        var client = {
            objectId: id,
            socket: socket,
            getBuildById: function () {
                return self.generalBuildStorage.getBuildById(client.objectId);
            },
            getBuildHistoryById: function () {
                return self.generalBuildStorage.getBuildHistoryById(client.objectId);
            }
        };

        client.generalBuildHelper = new this.objectHelper('builds', client.getBuildById);
        client.historyHelper = new this.objectHelper('builds', client.getBuildHistoryById);
        this.clients[socket.id] = client;
    };

    this.stop = function () {
        clearInterval(this.interval);
        this.generalBuildStorage.clear();
        this.agentStorage.clear();
        for (var id in this.clients) {
            this.clients[id].generalBuildHelper.clear();
            this.clients[id].historyHelper.clear();
        }
    };
}

module.exports = SocketManager;