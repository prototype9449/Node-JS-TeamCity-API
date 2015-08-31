var config = require('./../helpers/connectionOptionsHelper');
var htmlGenerator = require('./../htmlGenerator');
var baseSocket = require('./baseSocket');
var launchBuild = require('../providers/jsonBuildProvider').launchBuildConfiguration;

function MainSocket(server, storages, time, objectType) {
    this.__proto__ = new baseSocket(server, time, objectType);
    this.buildStorage = storages.buildStorage;
    this.agentStorage = storages.agentStorage;

    this.buildHelper = new this.objectHelper('builds', this.buildStorage.getBuilds);
    this.agentHelper = new this.objectHelper('agents', this.agentStorage.getAgents);
    this.buildCount = 10;

    var self = this;

    this.sendInfo = function (clients) {
        self.buildHelper.generateNewObjects(function (builds) {
            var optionTeamCity = config.getBuildOptions();
            htmlGenerator.generateHtmlFromJson({builds: builds}, "builds", optionTeamCity.options.pageHtmlTemplatePath, function (html) {
                for (var id in self.clients) {
                    clients[id].socket.emit('newBuilds', html);
                }
            });
        }, this.buildCount);

        self.agentHelper.generateNewObjects(function (agents) {
            var optionTeamCity = config.getAgentOptions();
            htmlGenerator.generateHtmlFromJson({agents: agents}, "agents", optionTeamCity.options.pageHtmlTemplatePath, function (html) {
                for (var id in self.clients) {
                    clients[id].socket.emit('newAgents', html);
                }
            });
        });
    };

    this.sendInitialData = function (socket) {
        var builds = self.buildStorage.getBuilds(this.buildCount)["builds"];
        var optionTeamCity = config.getBuildOptions();
        htmlGenerator.generateHtmlFromJson({builds: builds}, "builds", optionTeamCity.options.pageHtmlTemplatePath, function (html) {
            socket.emit('newBuilds', html);
        });

        var agents = self.agentStorage.getAgents()["agents"];
        optionTeamCity = config.getAgentOptions();
        htmlGenerator.generateHtmlFromJson({agents: agents}, "agents", optionTeamCity.options.pageHtmlTemplatePath, function (html) {
            socket.emit('newAgents', html);
        });
    };

    this.createClient = function (socket) {

        socket.on('launchBuild', function (agentId) {
            if (agentId != 1) {
                launchBuild('Portal_PortalControls', agentId);
            } else {
                launchBuild('Portal_PortalCore', agentId);
            }
        });

        this.clients[socket.id] = {
            socket: socket
        };
    };
}

module.exports = MainSocket;