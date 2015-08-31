var config = require('./../helpers/generalConnectionOptionHelper');
var baseSocket = require('./baseSocket');

function AgentSocket(server, storages, time, objectType) {
    this.__proto__ = new baseSocket(server, time, objectType);
    this.generalBuildStorage = storages.generalBuildStorage;
    this.agentStorage = storages.agentStorage;
    var self = this;

    this.sendInfo = function (clients) {
        for (var id in clients) {
            var client = clients[id];

            (function (client) {
                client.agentHelper.generateNewObjects(function (agents) {
                    var agentsData = self.pushModels(agents);
                    client.socket.emit('agent', agentsData);
                });

                client.historyHelper.generateNewObjects(function (agentHistory) {
                    var buildsData = self.pushModels(agentHistory);
                    client.socket.emit('agentHistory', buildsData);
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
            getAgentById: function () {
                return self.agentStorage.getAgentById(client.objectId);
            },
            getAgentHistoryById: function () {
                return self.generalBuildStorage.getAgentHistoryById(client.objectId);
            }
        };
        client.agentHelper = new this.objectHelper('agents', client.getAgentById);
        client.historyHelper = new this.objectHelper('builds', client.getAgentHistoryById);

        this.clients[socket.id] = client;
    };
}

module.exports = AgentSocket;