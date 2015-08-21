var config = require('./../helpers/connectionOptionsHelper');
var htmlGenerator = require('./../htmlGenerator');
var baseSocket = require('./baseSocket');

function AgentSocket(server, storage, time, objectType) {
    this.storage = storage;
    this.__proto__ = new baseSocket(server, time, objectType);

    this.sendInfo = function (client) {
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
    };

    this.createClient = function (socket) {
        var id = socket.handshake.query.id;

        var client = {
            objectId: id,
            socket: socket,
            getAgentById: function () {
                return storage.getAgentById(client.objectId);
            },
            getAgentHistoryById: function () {
                return storage.getAgentHistoryById(client.objectId);
            }
        };
        client.agentHelper = new this.objectHelper('agent', client.getAgentById);
        client.historyHelper = new this.objectHelper('builds', client.getAgentHistoryById);

        this.clients[socket.id] = client;
    };
}

module.exports = AgentSocket;