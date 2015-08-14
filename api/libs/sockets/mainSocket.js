var optionHelper = require('./../helpers/connectionOptionsHelper');

function MainSocket(server, storage, time) {
    this.time = time;
    this.storage = storage;
    this.objectHelper = require('./../helpers/objectHelper');
    //this.io = require('socket.io')(server, { path:  '/api/socket.io' });//IIS
    this.io = require('socket.io')(server, {path: '/main'});//WebStorm
    this.clients = {};

    this.sendInfo = function (client) {

        client.buildHelper.getNew(function (newData) {
            client.socket.emit('newBuilds', newData);
        });


        client.agentHelper.getNew(function (newData) {
            client.socket.emit('newAgents', newData);
        });


        client.buildHelper.getUpdate(function (newData) {
            client.socket.emit('buildsUpdate', newData);
        });


        client.agentHelper.getUpdate(function (newData) {
            client.socket.emit('agentsUpdate', newData);
        });
    };

    this.start = function () {

        console.time('start');

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
                console.time("connection start");
                socket.emit('connection start');

                console.time("main");
                console.timeEnd("connection start");

                var client = {
                    buildHelper: new self.objectHelper('builds', self.storage.getBuilds, optionHelper.getBuildOptions()),
                    agentHelper: new self.objectHelper('agents', self.storage.getAgents, optionHelper.getAgentOptions()),
                    socket: socket
                };
                self.clients[socket.id] = client;
                console.log('Clients online : ' + self.clients);
                console.timeEnd("main");

                socket.on('disconnect', function () {
                    delete self.clients[socket.id];
                });

                SetTimer(self);
            });
        }

        begin(this);
        console.timeEnd('start');
    };

    this.stop = function () {
        clearInterval(this.interval);
    };
}

module.exports = MainSocket;