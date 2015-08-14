var config = require('./../helpers/connectionOptionsHelper');

function GeneralSocket(server, time, objectType) {
    this.time = time;
    this.objectHelper = require('./../helpers/objectHelper');
    //this.io = require('socket.io')(server, { path:  '/api/socket.io' });//IIS
    this.io = require('socket.io')(server, {path: '/' + objectType});//WebStorm
    this.objectType = objectType;
    this.clients = {};

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

                var id = socket.handshake.query.id;
                self.clients[socket.id] = {
                    objectId: id,
                    socket: socket
                };
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

module.exports = GeneralSocket;