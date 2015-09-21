var mainSocket = require('./mainSocket');
var agentSocket = require('./agentSocket');
var buildSocket = require('./buildSocket');
var settingSocket = require('./settingSocket');

function SocketRunner(server) {
    this.ioInstances = {};
    this.server = server;
    var self = this;
    this.init = function (storages) {
        this.sockets = {
            main: new mainSocket(self.server, storages, this.ioInstances['main']),
            agent: new agentSocket(self.server, storages, this.ioInstances['agent']),
            build: new buildSocket(self.server, storages, this.ioInstances['build']),
            setting: new settingSocket(self.server, storages, this.ioInstances['setting'])
        };
        for (var socket in this.sockets) {
            this.sockets[socket].init();
        }
    };

    this.start = function () {
        for (var socket in this.sockets) {
            this.sockets[socket].start();
        }
    };

    this.stop = function () {
        for (var socket in this.sockets) {
            this.sockets[socket].stop();
            this.ioInstances[socket] = this.sockets[socket].io;
        }
    }
}

exports.SocketRunner = SocketRunner;