var config = require('./../helpers/connectionOptionsHelper');
var htmlGenerator = require('./../htmlGenerator');
var baseSocket = require('./baseSocket');
var launchBuild = require('../providers/buildProviders/jsonBuildProvider').launchBuildConfiguration;

function MainSocket(server, storage, time, objectType) {
    this.storage = storage;
    this.__proto__ = new baseSocket(server, time, objectType);
    this.buildCount = 5;

    this.sendInfo = function (client) {
        client.buildHelper.generateNewObjects(function (builds) {
            var optionTeamCity = config.getBuildOptions();
            htmlGenerator.generateHtmlFromJson({builds: builds}, "builds", optionTeamCity.options.pageHtmlTemplatePath, function (html) {
                client.socket.emit('newBuilds', html);
            });
        }, this.buildCount);

        client.agentHelper.generateNewObjects(function (agents) {
            var optionTeamCity = config.getAgentOptions();
            htmlGenerator.generateHtmlFromJson({agents: agents}, "agents", optionTeamCity.options.pageHtmlTemplatePath, function (html) {
                client.socket.emit('newAgents', html);
            });
        });
    };

    this.createClient = function (socket) {

        socket.on('launchBuild', function() {
            launchBuild('MyRepozitoryGitHub_Build');
        });

        this.clients[socket.id] = {
            buildHelper: new this.objectHelper('builds', this.storage.getBuilds),
            agentHelper: new this.objectHelper('agents', this.storage.getAgents),
            socket: socket
        };
    };
}

module.exports = MainSocket;