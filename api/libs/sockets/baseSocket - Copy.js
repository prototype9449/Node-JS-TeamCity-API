var config = require('./../config/generalOptionHelper');
var launchBuild = require('../providers/generalBuildProvider').launchBuildConfiguration;

function BaseSocket(server, time, objectType) {
    this.time = time;
    this.objectHelper = require('./../helpers/objectHelper');
    console.log("baseSocket created");
    this.io = require('socket.io')(server, { path:  '/api/' + objectType,  transports: [
        'xhr-polling'
    ] });//IIS

   // this.io = require('socket.io')(server, {path: '/' + objectType});//WebStorm
    this.objectType = objectType;
    this.clients = {};

    this.pushModels = function (models) {
        var result = [];
        for (var id in models)
            result.push({id: models[id].id, model: models[id]});

        result.sort(function (item1, item2) {
            return item1.id - item2.id;
        });
        return result;
    };

    this.start = function () {
        console.log("socket started");
        var self = this;

        var setTimer = function () {
            console.log("timer started");
            this.interval = setInterval(function () {
                self.sendInfo();
            }, self.time);
        };

        this.io.on('connection', function (socket) {
            console.log("connection on");
            console.log("before createClient");
            console.log(socket.id);
            self.createClient(socket);
            console.log("after createClient");
            console.log("before sendInitialData");
            self.sendInitialData(socket);
            console.log("after sendInitialData");
            console.log('Clients online : ' + self.clients);

            socket.on('disconnect', function () {
                delete self.clients[socket.id];
                self.stop();
            });
            setTimer.apply(self);
        });
    };

    this.stop = function () {
        clearInterval(this.interval);
    };

    this.launchBuildByAgent = function (agent) {
        var agentFixBuilds = config.getAgentFixBuildsOptions();

        var buildTypeName;
        agentFixBuilds.map(function (item) {
            if (item.agentName == agent.name) {
                buildTypeName = item.buildTypeName;
            }
        });

        if (!buildTypeName) return;

        launchBuild(buildTypeName, agent.id);
    };
}

module.exports = BaseSocket;
