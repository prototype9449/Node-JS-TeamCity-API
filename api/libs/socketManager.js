function SocketManager(server, time) {
    this.init(server, time);
}

SocketManager.prototype.init = function (server, time) {
    this.time = time || 4000;
    //this.io = require('socket.io')(server, { path:  '/api/socket.io' });//IIS
    this.io = require('socket.io')(server, { path:  '/socket.io' });//WebStorm
    var helper = require('./teamCityHelper').teamCityHelper;
    this.buildsHelper = new helper("teamCityBuilds");
    this.agentsHelper = new helper("teamCityAgents");
    this.interval = {};
};


SocketManager.prototype.sendInfo = function (socket){

    this.buildsHelper.getNew(function (newData){
        socket.emit('newBuilds', newData);
    });

    this.buildsHelper.getUpdate(function (newData) {
        socket.emit('buildsUpdate', newData);
    });

    this.agentsHelper.getNew(function (newData) {
        socket.emit('newAgents', newData);
    });

    this.agentsHelper.getUpdate(function (newData) {
        socket.emit('agentsUpdate', newData);
    });
};


SocketManager.prototype.start = function () {
    function begin(instance) {
         instance.io.on('connection', function (socket) {
            console.log("New Connection");
            instance.interval = setTimeout(function send() {
                console.log("timer started");
                instance.sendInfo(socket);
                instance.interval = setTimeout(send, instance.time);
            }, 0);
        });
    }

    begin(this);
};

SocketManager.prototype.stop = function () {
    clearInterval(this.interval);
};

exports.socketManager = SocketManager;