var AgentStorage = require('./agentStorage').AgentStorage;
var GeneralBuildStorage = require('./buildStorage').BuildStorage;
var AdditionalBuildStorage = require('./buildStorage').BuildStorage;

var connectionOptionHelper = require('./../config/generalOptionHelper');
var additionalConnectionHelper = require('../config/additionalOptionHelper');

var generateBuildsByBuildTypeNames = require('../providers/buildsByBuildTypeNamesProvider');
var generateObjects = require('./../providers/objectProvider').generateObjects;

function StorageManager() {

    var getConnectionForGeneralBuildStorage = function (generalBuildStorage) {
        function getConnection() {
            var getFirstFinishedBuildId = function (builds) {
                var buildId = "";
                for (var i = builds.length - 1; i >= 0; i--) {
                    if (builds[i].build.state == 'finished') {
                        buildId = builds[i].id;
                    } else {
                        return buildId;
                    }
                }
                return buildId;
            };

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

    var getConnectionForAdditionalBuildStorage = function () {
        return additionalConnectionHelper.getGeneralOptions().options;
    };

    this.getStorages = function () {
        var generalBuildStorage = new GeneralBuildStorage();
        var agentStorage = new AgentStorage(generalBuildStorage);
        var additionalBuildStorage = new AdditionalBuildStorage();

        return {
            agentStorage: {
                storage: agentStorage,
                getOptions: getConnectionForAgentStorage,
                getObjecs: generateObjects
            },
            generalBuildStorage: {
                storage: generalBuildStorage,
                getOptions: getConnectionForGeneralBuildStorage(generalBuildStorage),
                getObjecs: generateObjects
            },
            additionalBuildStorage: {
                storage: additionalBuildStorage,
                getOptions: getConnectionForAdditionalBuildStorage,
                getObjecs: generateBuildsByBuildTypeNames
            }
        };
    }
}

module.exports = StorageManager;