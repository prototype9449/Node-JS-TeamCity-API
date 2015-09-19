var config = require('./../config/generalOptionHelper');
var launchBuild = require('../providers/generalBuildProvider').launchBuildConfiguration;
var globalHelper = require('./../config/globalHelper');

function BaseSocket(server, objectType, ioInstance) {
    this.time = globalHelper.timeTickSendingData;
    this.objectHelper = require('./../helpers/objectHelper');
    //this.io = require('socket.io')(server, { path:  '/api/socket.io' });//IIS
    if (ioInstance) {
        this.io = ioInstance;
    } else {
        this.io = require('socket.io')(server, {path: '/' + objectType});//WebStorm
    }

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

    this.sendDataToAllClients = function (eventName, data) {
        for (var id in this.clients) {
            this.clients[id].socket.emit(eventName, data);
        }
    };

    this.start = function () {
        var self = this;

        var setTimer = function () {
            console.log("timer started");
            this.interval = setInterval(function () {
                self.sendInfo();
            }, self.time);
        };

        this.io.on('connection', function (socket) {
            self.createClient(socket);
            self.sendInitialData(socket);

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
}

module.exports = BaseSocket;
