var mainSocket = require('./mainSocket');
var agentSocket = require('./agentSocket');
var buildSocket = require('./buildSocket');

function RunSockets(server, storage, time) {
    var timeTick = time || 8000;
    var main = new mainSocket(server, storage, timeTick, 'main');
    var agent = new agentSocket(server, storage, timeTick, 'agent');
    var build = new buildSocket(server, storage, timeTick, 'build');

    main.start();
    agent.start();
    build.start();
}

module.exports.RunSocket = RunSockets;