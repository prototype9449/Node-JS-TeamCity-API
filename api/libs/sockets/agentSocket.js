var config = require('./../helpers/connectionOptionsHelper');
var htmlGenerator = require('./../htmlGenerator');
var generateAgent = require('./../providers/agentProviders/jsonAgentProvider').generateAgentJson;
var generateBuilds = require('../providers/buildProviders/jsonBuildByAgentProvider').generateBuildsByAgent;

function SocketManager(server, time) {
    this.time = time;
    this.objectHelper = require('./../helpers/objectHelper');
    //this.io = require('socket.io')(server, { path:  '/api/socket.io' });//IIS
    this.io = require('socket.io')(server, {path: '/agent'});//WebStorm
    this.clients = {};


    this.sendInfo = function (client) {
        var optionTeamCity = config.getAgentByIdOptions(client.id);
        generateAgent(client.id, optionTeamCity.connection.url, function (jsonAgent) {
            generateBuilds(jsonAgent.id, function (buildInformation) {
                jsonAgent.builds = buildInformation.builds;
                htmlGenerator.generateHtmlFromJson({agents: [jsonAgent]}, optionTeamCity.options.pageFullHtmlTemplatePath, function (html) {
                    client.socket.emit('agent', html);
                });
            });
        });


    };

    this.start = function () {
        function SetTimer(self) {
            console.log("timer started");
            self.interval = setTimeout(function send() {

                for (var id in self.clients) {
                    self.sendInfo(self.clients[id]);
                }
                ;
                self.interval = setTimeout(send, self.time);
            }, 0);
        }

        function begin(self) {
            self.io.on('connection', function (socket) {
                socket.emit('connection start');
                socket.on('agent', function (id) {

                    self.clients[socket.id] = {
                        id: id,
                        socket: socket
                    };
                    console.log('Clients online : ' + self.clients);
                });
                socket.on('disconnection', function () {
                    delete self.clients[socket.id];
                });
            });

            SetTimer(self);
        }

        begin(this);
    };

    this.stop = function () {
        clearInterval(this.interval);
    };
}

module.exports = SocketManager;