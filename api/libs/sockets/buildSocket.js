var baseSocket = require('./baseSocket');

function SocketManager(server, storagesDetail, time, objectType) {
    this.__proto__ = new baseSocket(server, time, objectType);
    this.generalBuildStorage = storagesDetail.generalBuildStorage.storage;
    this.agentStorage = storagesDetail.agentStorage.storage;
    var self = this;

    this.sendInfo = function (clients) {
        for (var id in clients) {
            var client = clients[id];

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
        self.sendInfo(self.clients);
    };

    this.createClient = function (socket) {
        var id = socket.handshake.query.id;
        var self = this;

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
}

module.exports = SocketManager;