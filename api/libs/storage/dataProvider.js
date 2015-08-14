var generateObjects = require('./../providers/objectProvider').generateObjects;
var optionHelper = require('./../helpers/connectionOptionsHelper');

function DataProvider(storage, time) {
    this.storage = storage;
    this.interval = {};
    this.time = time || 4000;

    this.saveBuilds = function (self) {
        var connection = optionHelper.getBuildOptions().connection;
        generateObjects(undefined, connection, function (data) {
            self.storage.pushBuilds(data.builds);
        });
    };

    this.saveAgents = function (self) {
        var connection = optionHelper.getAgentOptions().connection;
        generateObjects(undefined, connection, function (data) {
            self.storage.pushAgents(data.agents);
        });
    };

    this.start = function () {
        var self = this;
        self.interval = setInterval(function send() {
            self.saveAgents(self);
            self.saveBuilds(self);
        }, this.time);
    }
}

module.exports = DataProvider;