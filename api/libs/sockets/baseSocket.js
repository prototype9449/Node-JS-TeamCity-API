function BaseSocket(server, time, objectType) {
    this.time = time;
    this.objectHelper = require('./../helpers/objectHelper');
    //this.io = require('socket.io')(server, { path:  '/api/socket.io' });//IIS
    this.io = require('socket.io')(server, {path: '/' + objectType});//WebStorm
    this.objectType = objectType;
    this.clients = {};

    this.start = function () {
        function SetTimer(self) {
            console.log("timer started");
            self.interval = setInterval(function send() {
                self.sendInfo(self.clients);
            }, self.time);
        }

        function begin(self) {
            self.io.on('connection', function (socket) {
                self.createClient(socket);

                self.sendInitialData(socket);

                console.log('Clients online : ' + self.clients);

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

module.exports = BaseSocket;