var config = require('./../helpers/connectionOptionsHelper');
var htmlGenerator = require('./../htmlGenerator');
var baseSocket = require('./baseSocket');

function SocketManager(server, storage, time, objectType) {
    this.storage = storage;
    this.__proto__ = new baseSocket(server, time, objectType);

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

        var client = {
            objectId: id,
            socket: socket,
            getBuildById: function () {
                return storage.getBuildById(client.objectId);
            },
            getBuildHistoryById: function () {
                return storage.getBuildHistoryById(client.objectId);
            }
        };

        client.buildHelper = new this.objectHelper('build', client.getBuildById);
        client.historyHelper = new this.objectHelper('builds', client.getBuildHistoryById);
        this.clients[socket.id] = client;
    };
}

module.exports = SocketManager;