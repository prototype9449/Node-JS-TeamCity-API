var generateObjects = require('./../providers/objectProvider').generateObjects;
var optionHelper = require('./../helpers/connectionOptionsHelper');

function DataProvider(storage, time) {
    this.storage = storage;
    this.interval = {};
    this.time = time || 4000;

    this.saveBuilds = function (self) {
        var builds = self.storage.getBuilds().builds;
        var connection;

        var getFirstFinishedBuildId = function (builds) {
            var buildId;
            for(var i = builds.length-1; i >= 0; i--){
                if (builds[i].build.state == 'finished') {
                    buildId =  builds[i].id;
                } else {
                    return buildId;
                }
            }
            return buildId;
        };

        var firstFinishedBuildId = getFirstFinishedBuildId(builds);
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