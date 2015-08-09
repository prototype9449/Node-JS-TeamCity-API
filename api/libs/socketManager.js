function SocketManager(server, time) {
    this.time = time || 4000;
    this.helper = require('./helpers/objectHelper');
    //this.io = require('socket.io')(server, { path:  '/api/socket.io' });//IIS
    this.io = require('socket.io')(server, {path: '/socket.io'});//WebStorm
    this.buildHelper = {};
    this.agentHelper = {};
    this.interval = {};
}

SocketManager.prototype.sendInfo = function (socket) {

    console.log('newBuilds emit');
    this.buildHelper.getNew(function (newData) {
        socket.emit('newBuilds', newData);
    });

    console.log('newAgents emit');
    this.agentHelper.getNew(function (newData) {
        socket.emit('newAgents', newData);
    });

    console.log('buildsUpdate emit');
    this.buildHelper.getUpdate(function (newData) {
        //  socket.emit('buildsUpdate', newData);
    });

    console.log('agentsUpdate emit');
    this.agentHelper.getUpdate(function (newData) {
        socket.emit('agentsUpdate', newData);
    });
};

SocketManager.prototype.start = function () {
    function SetTimer(self, socket) {
        console.log("timer started");
        self.interval = setTimeout(function send() {

            self.sendInfo(socket);
            self.interval = setTimeout(send, self.time);
        }, 0);
    }

    function begin(self) {
        self.io.on('connection', function (socket) {
            var optionHelper = require('./helpers/connectionOptionsHelper');
            this.config = optionHelper.getAgentOptions();
            self.buildHelper = self.helper('buildTypes', optionHelper.getBuildOptions());
            self.agentHelper = self.helper('agents', optionHelper.getAgentOptions());
            console.log('New connection');
            SetTimer(self, socket);
        });
    }

    begin(this);
};

SocketManager.prototype.stop = function () {
    clearInterval(this.interval);
};

module.exports = SocketManager;