var teamCityHelper = require('./teamCityHelper');

function SocketManager(server, time) {
    this.time = time || 4000;
    //this.io = require('socket.io')(server, { path:  '/api/socket.io' });//IIS
    this.io = require('socket.io')(server, { path:  '/socket.io' });//WebStorm
    this.buildHelper = new teamCityHelper("teamCityBuildTypes");
    this.agentHelper = new teamCityHelper("teamCityAgents");
    this.interval = {};
};

SocketManager.prototype.sendInfo = function (socket){

    this.buildHelper.getUpdate(function (newData) {
        socket.emit('buildsUpdate', newData);
    });

    this.agentHelper.getUpdate(function (newData) {
        socket.emit('agentsUpdate', newData);
    });
};

SocketManager.prototype.start = function () {
    function SetTimer(self, socket) {
        self.interval = setTimeout(function send() {

            console.log("timer started");
            self.sendInfo(socket);
            self.interval = setTimeout(send, self.time);

        }, 0);
    }

    function begin(self) {
         self.io.on('connection', function (socket) {

             console.log('New connection');

             self.buildHelper.getNew(function (newData){
                 socket.emit('newBuilds', newData);
             });

             self.agentHelper.getNew(function (newData) {
                 socket.emit('newAgents', newData);
             });

            SetTimer(self, socket);
        });
    }

    begin(this);
};

SocketManager.prototype.stop = function () {
    clearInterval(this.interval);
};

module.exports = SocketManager;