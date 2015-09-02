var config = require('./configManager');

var generalConnectionOptionHelper =
{
    clone: function (object) {
        var copy = JSON.stringify(object);
        return JSON.parse(copy);
    },
    getGeneralOptions: function () {
        var generalOption = config.general().get('generalTeamCity');

        return this.clone(generalOption);
    },

    getAgentOptions: function () {
        var generalOption = config.general().get('generalTeamCity');
        var agentPaths = config.urlPaths().get('teamCityAgents');

        var agentOptions = this.clone(generalOption);
        agentOptions.connection.url += agentPaths.relativeUrl;

        return agentOptions;
    },
    getLaunchBuildsOptions: function (buildTypeId, agentId) {
        var generalOption = config.general().get('generalTeamCity');
        var launchBuildsOption = config.urlPaths().get('teamCityLaunchBuilds');

        var launchBuildsOptions = this.clone(generalOption);
        launchBuildsOptions.connection.url += launchBuildsOption.relativeUrl;
        launchBuildsOptions.connection.headers['Content-Type'] = launchBuildsOption['Content-Type'];
        launchBuildsOptions.connection.body = launchBuildsOption.body.replace('_buildTypeId_', buildTypeId).replace('_agentId_', agentId);

        return launchBuildsOptions;
    },

    getBuildOptions: function (sinceBuildId) {
        var generalOption = config.general().get('generalTeamCity');
        var buildPaths = config.urlPaths().get('teamCityBuilds');

        var buildOptions = this.clone(generalOption);
        if (sinceBuildId) {
            buildOptions.connection.url += buildPaths.relativeUrlSinceIdBuilds + sinceBuildId;
        } else {
            buildOptions.connection.url += buildPaths.relativeUrlWithRunnedBuilds;
        }

        return buildOptions;
    }
};

module.exports = generalConnectionOptionHelper;
