var optionHelper = require('./../config/generalOptionHelper');
var Promise = require('promise');
var requestp = require('request-promise');

var launchBuildConfiguration = function (agent) {
    return new Promise(function (resolve, reject) {

        var agentFixBuilds = optionHelper.getAgentFixBuildsOptions();
        var buildTypeId;
        agentFixBuilds.map(function (item) {
            if (item.agentName == agent.agentName) {
                buildTypeId = item.buildTypeId;
            }
        });

        if (!buildTypeId) {
            reject();
            return;
        }

        var optionTeamCity = optionHelper.getLaunchBuildsOptions(buildTypeId, agent.id).connection;
        requestp(optionTeamCity).then(resolve, reject);
        console.log('launch build ' + buildTypeId);
    });
};

module.exports = launchBuildConfiguration;