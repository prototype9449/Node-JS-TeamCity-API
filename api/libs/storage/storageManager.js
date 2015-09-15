var AgentStorage = require('./agentStorage').AgentStorage;
var GeneralBuildStorage = require('./generalBuildStorage').BuildStorage;
var AdditionalBuildStorage = require('./generalBuildStorage').BuildStorage;
var BuildTypeStorage = require('./buildTypeStorage').BuildTypeStorage;

var connectionOptionHelper = require('./../config/generalOptionHelper');
var additionalConnectionHelper = require('../config/additionalOptionHelper');

var generateBuildsByBuildTypeNames = require('../providers/additionalBuildProvider');
var generateObjects = require('./../providers/objectProvider').generateObjects;

function StorageManager() {

    var getConnectionForGeneralBuildStorage = function (generalBuildStorage) {
        function getConnection() {
            function getFirstFinishedBuildId(builds) {
                var buildId = "";
                for (var i = builds.length - 1; i >= 0; i--) {
                    if (builds[i].build.state == 'finished') {
                        buildId = builds[i].id;
                    } else {
                        return buildId;
                    }
                }
                return buildId;
            }

            var builds = generalBuildStorage.getBuilds().builds;
            var firstFinishedBuildId = getFirstFinishedBuildId(builds);
            var connection;

            if (builds.length == 0 || !firstFinishedBuildId) {
                connection = connectionOptionHelper.getBuildOptions().connection;
            } else {
                connection = connectionOptionHelper.getBuildOptions(firstFinishedBuildId).connection;
            }

            return connection;
        }

        return getConnection;
    };

    var getConnectionForAgentStorage = function () {
        return  connectionOptionHelper.getAgentOptions().connection;
    };

    var getConnectionForBuildTypeStorage = function () {
        return  connectionOptionHelper.getBuildTypeOptions().connection;
    };

    var getConnectionForAdditionalBuildStorage = function () {
        return additionalConnectionHelper.getGeneralOptions().options;
    };

    this.getStorages = function () {
        var generalBuildStorage = new GeneralBuildStorage(60);
        var agentStorage = new AgentStorage(generalBuildStorage);
        var additionalBuildStorage = new AdditionalBuildStorage();
        var buildTypeStorage = new BuildTypeStorage();

        return {
            agentStorage: {
                storage: agentStorage,
                getOptions: getConnectionForAgentStorage,
                generateObjects: generateObjects
            },
            generalBuildStorage: {
                storage: generalBuildStorage,
                getOptions: getConnectionForGeneralBuildStorage(generalBuildStorage),
                generateObjects: generateObjects
            },
            additionalBuildStorage: {
                storage: additionalBuildStorage,
                getOptions: getConnectionForAdditionalBuildStorage,
                generateObjects: generateBuildsByBuildTypeNames
            },
            buildTypeStorage : {
                storage : buildTypeStorage,
                getOptions : getConnectionForBuildTypeStorage,
                generateObjects : generateObjects
            }
        };
    }
}

module.exports = StorageManager;