var generateObjects = require('./../providers/objectProvider').generateObjects;
var optionHelper = require('./../helpers/connectionOptionsHelper');

function DataProvider(storage, time) {
    this.storage = storage;
    this.interval = {};
    this.time = time || 4000;

    this.saveBuilds = function (self) {
        var builds = self.storage.getBuilds().builds;
        var connection;

        var getFirstNotRunnedBuildId = function (builds) {
            for(var i = 0; i < builds.length; i++){
                if (builds[i].build.state == 'finished') return builds[i].id;
            }
        };

        var firstFinishedBuildId = getFirstNotRunnedBuildId(builds);
        if (builds.length == 0 || !firstFinishedBuildId) {
            connection = optionHelper.getBuildOptions().connection;
        } else {
            connection = optionHelper.getBuildOptions(firstFinishedBuildId).connection;
        }
        generateObjects(connection, function (data) {
            self.storage.pushBuilds(data.builds);
        });
    };

    this.saveAgents = function (self) {
        var connection = optionHelper.getAgentOptions().connection;
        generateObjects(connection, function (data) {
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