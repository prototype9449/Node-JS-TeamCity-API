var mainSocket =  require('./sockets/mainSocket');
var agentSocket = require('./sockets/agentSocket');
var buildSocket = require('./sockets/buildSocket');

function RunSockets(server, time) {
    var timeTick = time || 4000;
    var main = new mainSocket(server,timeTick);
    var agent = new agentSocket(server,timeTick);
    var build = new buildSocket(server,timeTick);

    main.start();
    agent.start();
    build.start();
}

module.exports.RunSocket = RunSockets;