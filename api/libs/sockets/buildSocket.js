var config = require('./../helpers/connectionOptionsHelper');
var htmlGenerator = require('./../htmlGenerator');
var baseSocket = require('./baseSocket');

function SocketManager(server, storages, time, objectType) {
    this.__proto__ = new baseSocket(server, time, objectType);
    this.buildStorage = storages.buildStorage;
    this.agentStorage = storages.agentStorage;

    this.sendInfo = function (client) {
        var optionTeamCity = config.getBuildByIdOptions(client.objectId);

        client.buildHelper.generateNewObjects(function (build) {
            htmlGenerator.generateHtmlFromJson({builds: build}, "builds", optionTeamCity.options.pageFullHtmlTemplatePath, function (html) {
                client.socket.emit('build', html);
            });
        });

        client.historyHelper.generateNewObjects(function (buildHistory) {
            htmlGenerator.generateHtmlFromJson({buildHistory: buildHistory}, "buildHistory", optionTeamCity.options.pageHistoryHtmlTemplatePath, function (html) {
                client.socket.emit('buildHistory', html);
            });
        });
    };

    this.createClient = function (socket) {
        var id = socket.handshake.query.id;
        var self = this;

        var client = {
            objectId: id,
            socket: socket,
            getBuildById: function () {
                return  self.buildStorage.getBuildById(client.objectId);
            },
            getBuildHistoryById: function () {
                return self.buildStorage.getBuildHistoryById(client.objectId);
            }
        };

        client.buildHelper = new this.objectHelper('builds', client.getBuildById);
        client.historyHelper = new this.objectHelper('builds', client.getBuildHistoryById);
        this.clients[socket.id] = client;
    };
}

module.exports = SocketManager;