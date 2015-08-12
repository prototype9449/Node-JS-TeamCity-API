function SocketManager(server, time) {
    this.time = time;
    this.objectHelper = require('./../helpers/objectHelper');
    //this.io = require('socket.io')(server, { path:  '/api/socket.io' });//IIS
    this.io = require('socket.io')(server, {path: '/main'});//WebStorm
    this.clients = {};

    this.sendInfo = function (client) {
        console.log('newBuilds emit');
        client.buildHelper.getNew(function (newData) {
            client.socket.emit('newBuilds', newData);
        });

        console.log('newAgents emit');
        client.agentHelper.getNew(function (newData) {
            client.socket.emit('newAgents', newData);
        });

        console.log('buildsUpdate emit');
        client.buildHelper.getUpdate(function (newData) {
            client.socket.emit('buildsUpdate', newData);
        });

        console.log('agentsUpdate emit');
        client.agentHelper.getUpdate(function (newData) {
            client.socket.emit('agentsUpdate', newData);
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
                socket.on('main', function () {
                    var optionHelper = require('./../helpers/connectionOptionsHelper');

                    var client = {
                        buildHelper: new self.objectHelper('builds', optionHelper.getBuildOptions()),
                        agentHelper: new self.objectHelper('agents', optionHelper.getAgentOptions()),
                        socket: socket
                    };
                    self.clients[socket.id] = client;
                    console.log('Clients online : ' + self.clients);
                });
                socket.on('disconnect', function () {
                    delete self.clients[socket.id];
                });
                SetTimer(self);
            });
        }

        begin(this);
    };

    this.stop = function () {
        clearInterval(this.interval);
    };
}

module.exports = SocketManager;