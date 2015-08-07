var teamCityHelper = require('./teamCityHelper');

function SocketManager(server, time) {
    this.time = time || 4000;
    //this.io = require('socket.io')(server, { path:  '/api/socket.io' });//IIS
    this.io = require('socket.io')(server, { path:  '/socket.io' });//WebStorm
    this.buildsHelper = new teamCityHelper("teamCityBuildTypes");
    this.agentsHelper = new teamCityHelper("teamCityAgents");
    this.interval = {};
};

SocketManager.prototype.sendInfo = function (socket){

    this.buildsHelper.getUpdate(function (newData) {
        socket.emit('buildsUpdate', newData);
    });

    this.agentsHelper.getUpdate(function (newData) {
        socket.emit('agentsUpdate', newData);
    });
};

SocketManager.prototype.start = function () {
    function begin(self) {
         self.io.on('connection', function (socket) {

             console.log('New connection');

             self.buildsHelper.getNew(function (newData){
                 socket.emit('newBuilds', newData);
             });

             self.agentsHelper.getNew(function (newData) {
                 socket.emit('newAgents', newData);
             });

            self.interval = setTimeout(function send() {

                console.log("timer started");
                self.sendInfo(socket);
                self.interval = setTimeout(send, self.time);

            }, 0);
        });
    }

    begin(this);
};

SocketManager.prototype.stop = function () {
    clearInterval(this.interval);
};

module.exports = SocketManager;