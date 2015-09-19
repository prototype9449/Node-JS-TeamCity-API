var mainSocket = require('./mainSocket');
var agentSocket = require('./agentSocket');
var buildSocket = require('./buildSocket');
var settingSocket = require('./settingSocket');

function SocketRunner(server, storages, time) {
    var timeTick = time;
    this.main = new mainSocket(server, storages, timeTick, 'main');
    this.agent = new agentSocket(server, storages, timeTick, 'agent');
    this.build = new buildSocket(server, storages, timeTick, 'build');
    this.setting = new settingSocket(server, storages, timeTick, 'settings');

    this.start = function() {
        this.main.start();
        this.agent.start();
        this.build.start();
        this.setting.start();
    };

    this.stop = function(){
        this.main.stop();
        this.agent.stop();
        this.build.stop();
        this.setting.stop();
    }
}

exports.SocketRunner = SocketRunner;