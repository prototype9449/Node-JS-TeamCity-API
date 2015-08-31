var config = require('./../helpers/generalConnectionOptionHelper');
var htmlGenerator = require('./../htmlGenerator');
var baseSocket = require('./baseSocket');

function AgentSocket(server, storages, time, objectType) {
    this.__proto__ = new baseSocket(server, time, objectType);
    this.buildStorage = storages.buildStorage;
    this.agentStorage = storages.agentStorage;
    var self = this;

    this.sendInfo = function (clients) {
        for (var id in clients) {
            var client = clients[id];

            (function (client) {
                var optionTeamCity = config.getAgentByIdOptions(client.objectId);
                client.agentHelper.generateNewObjects(function (agents) {
                    htmlGenerator.generateHtmlFromJson({agents: agents}, "agents", optionTeamCity.options.pageFullHtmlTemplatePath, function (html) {
                        client.socket.emit('agent', html);
                    });
                });

                client.historyHelper.generateNewObjects(function (agentHistory) {
                    htmlGenerator.generateHtmlFromJson({agentHistory: agentHistory}, "agentHistory", optionTeamCity.options.pageHistoryHtmlTemplatePath, function (html) {
                        client.socket.emit('agentHistory', html);
                    });
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
                return self.buildStorage.getAgentHistoryById(client.objectId);
            }
        };
        client.agentHelper = new this.objectHelper('agents', client.getAgentById);
        client.historyHelper = new this.objectHelper('builds', client.getAgentHistoryById);

        this.clients[socket.id] = client;
    };
}

module.exports = AgentSocket;