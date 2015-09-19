var config = require('./../config/generalOptionHelper');
var baseSocket = require('./baseSocket');
var globalHelper= require('./../config/globalHelper');
var socketPathHelper= require('./../config/socketPathHelper');

function AgentSocket(server, storagesDetail, ioInstance) {
    this.__proto__ = new baseSocket(server, socketPathHelper.agentPath, ioInstance);
    this.generalBuildStorage = storagesDetail.generalBuildStorage.storage;
    this.agentStorage = storagesDetail.agentStorage.storage;
    var self = this;

    this.sendInfo = function () {
        for (var id in self.clients) {
            var client = self.clients[id];

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
        this.sendInfo(self.clients);
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