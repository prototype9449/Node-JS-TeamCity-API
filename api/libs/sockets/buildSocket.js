var config = require('./../helpers/connectionOptionsHelper');
var htmlGenerator = require('./../htmlGenerator');
var generateBuild = require('./../providers/buildProviders/jsonBuildProvider').generateBuildJson;
var generateBuilds = require('../providers/buildProviders/jsonBuildsByBuildTypeId').generateBuilds;
var baseSocket = require('./baseSocket');

function SocketManager(server,storage, time, objectType) {
    this.storage = storage;
    var generalSocket = new baseSocket(server, time, objectType);

    this.__proto__ = generalSocket;
    this.sendInfo = function (client) {

        var optionTeamCity = config.getBuildByIdOptions(client.objectId);

        var build = this.storage.getBuildById(client.objectId);
        htmlGenerator.generateHtmlFromJson({builds: [build]}, optionTeamCity.options.pageFullHtmlTemplatePath, function (html) {
            client.socket.emit('build', html);
        });
    };
}

module.exports = SocketManager;