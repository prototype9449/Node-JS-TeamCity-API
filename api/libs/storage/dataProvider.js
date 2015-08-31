var generateObjects = require('./../providers/objectProvider').generateObjects;
var connectionOptionHelper = require('./../helpers/generalConnectionOptionHelper');

function DataProvider(storages, time) {
    this.buildStorage = storages.buildStorage;
    this.agentStorage = storages.agentStorage;
    this.interval = {};
    this.time = time || 5000;

    this.saveBuilds = function (self) {
        var builds = self.buildStorage.getBuilds().builds;
        var connection;

        var getFirstFinishedBuildId = function (builds) {
            var buildId;
            for (var i = builds.length - 1; i >= 0; i--) {
                if (builds[i].build.state == 'finished') {
                    buildId = builds[i].id;
                } else {
                    return buildId;
                }
            }
            return buildId;
        };

        var firstFinishedBuildId = getFirstFinishedBuildId(builds);
        if (builds.length == 0 || !firstFinishedBuildId) {
            connection = connectionOptionHelper.getBuildOptions().connection;
        } else {
            connection = connectionOptionHelper.getBuildOptions(firstFinishedBuildId).connection;
        }
        generateObjects(connection, function (data) {
            self.buildStorage.pushBuilds(data.builds);
        });
    };

    this.saveAgents = function (self) {
        var connection = connectionOptionHelper.getAgentOptions().connection;
        generateObjects(connection, function (data) {
            self.agentStorage.pushAgents(data.agents);
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