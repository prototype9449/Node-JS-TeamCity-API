var generateObjects = require('./../providers/objectProvider').generateObjects;
var connectionOptionHelper = require('./../helpers/generalConnectionOptionHelper');
var generateBuildsByBuildTypeNames = require('../providers/buildsByBuildTypeNamesProvider');
var additionalConnectionHelper = require('../helpers/additionalConnectionOptionHelper');

function DataProvider(storages, time) {
    this.generalBuildStorage = storages.generalBuildStorage;
    this.additionalBuildStorage = storages.additionalBuildStorage;
    this.agentStorage = storages.agentStorage;
    this.additionalBuildStorage = storages.additionalBuildStorage;
    this.interval = {};
    this.time = time || 5000;

    this.saveGeneralBuilds = function (self) {
        var builds = self.generalBuildStorage.getGeneralBuilds().generalBuilds;
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
            self.generalBuildStorage.pushBuilds(data.builds);
        });
    };

    this.saveAdditionalBuilds = function(self){
        var options = additionalConnectionHelper.getGeneralOptions().options;
       generateBuildsByBuildTypeNames(options, function(builds){
           self.additionalBuildStorage.pushBuilds(builds);
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
            self.saveGeneralBuilds(self);
            self.saveAdditionalBuilds(self);
        }, this.time);
    }
}

module.exports = DataProvider;