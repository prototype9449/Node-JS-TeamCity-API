var config = require('./../helpers/connectionOptionsHelper');
var htmlGenerator = require('./../htmlGenerator');
var baseSocket = require('./baseSocket');
var launchBuild = require('../providers/buildProviders/jsonBuildProvider').launchBuildConfiguration;

function MainSocket(server, storages, time, objectType) {
    this.__proto__ = new baseSocket(server, time, objectType);
    this.buildStorage = storages.buildStorage;
    this.agentStorage = storages.agentStorage;
    this.buildCount = 10;

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

        socket.on('launchBuild', function(agentId) {
            if(agentId == 2) {
                launchBuild('Portal_PortalControls',agentId);
            } else {
                launchBuild('Portal_PortalCore',agentId);
            }
        });

        this.clients[socket.id] = {
            buildHelper: new this.objectHelper('builds', this.buildStorage.getBuilds),
            agentHelper: new this.objectHelper('agents', this.agentStorage.getAgents),
            socket: socket
        };
    };
}

module.exports = MainSocket;