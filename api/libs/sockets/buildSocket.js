var config = require('./../helpers/connectionOptionsHelper');
var htmlGenerator = require('./../htmlGenerator');

function SocketManager(server, time) {
    this.time = time || 4000;
    this.objectHelper = require('./../helpers/objectHelper');
    //this.io = require('socket.io')(server, { path:  '/api/socket.io' });//IIS
    this.io = require('socket.io')(server, {path: '/build'});//WebStorm
    this.clients = {};


    this.sendInfo = function (client) {
        var generateBuild = require('./../providers/buildProviders/jsonBuildProvider').generateBuildJson;

        var optionTeamCity = config.getBuildByIdOptions(client.id);
        generateBuild (client.id, optionTeamCity.connection.url, function (jsonBuild) {
            htmlGenerator.generateHtmlFromJson({builds :[jsonBuild]}, optionTeamCity.options.pageFullHtmlTemplatePath, function(html){
                client.socket.emit('build', html);
            })
        });
    };

    this.start = function () {
        function SetTimer(self) {
            console.log("timer started");
            self.interval = setTimeout(function send() {

                for (var id in self.clients) {
                    self.sendInfo(self.clients[id]);
                }
                self.interval = setTimeout(send, self.time);
            }, 0);
        }

        function begin(self) {
            self.io.on('connection', function (socket) {
                socket.emit('connection start');
                socket.on('build', function (id) {

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