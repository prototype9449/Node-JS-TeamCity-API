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
            builds.map(function (item) {
                if (item.build.state == 'Finished') return item.id;
            });
        };
        var firstNotRunnedBuildId = getFirstNotRunnedBuildId(builds);
        if (builds.length == 0 || !firstNotRunnedBuildId) {
            connection = optionHelper.getBuildOptions().connection;
        } else {
            connection = optionHelper.getBuildOptions(firstNotRunnedBuildId).connection;
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