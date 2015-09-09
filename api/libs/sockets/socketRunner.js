var mainSocket = require('./mainSocket');
var agentSocket = require('./agentSocket');
var buildSocket = require('./buildSocket');
var settingSocket = require('./settingSocket');

function RunSockets(server, storages, time) {
    var timeTick = time || 4000;
    var main = new mainSocket(server, storages, timeTick, 'main');
    var agent = new agentSocket(server, storages, timeTick, 'agent');
    var build = new buildSocket(server, storages, timeTick, 'build');
    var setting = new settingSocket(server, storages, timeTick, 'settings');

    main.start();
    agent.start();
    build.start();
    setting.start();
}

module.exports.RunSocket = RunSockets;