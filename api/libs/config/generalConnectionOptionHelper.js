var config = require('./config');

var generalConnectionOptionHelper =
{
    clone: function (object) {
        var copy = JSON.stringify(object);
        return JSON.parse(copy);
    },
    getGeneralOptions: function () {
        var generalOptionTeamCity = config.get('generalTeamCity');
        return this.clone(generalOptionTeamCity);
    },

    getAgentOptions: function () {
        var generalOptionTeamCity = config.get('generalTeamCity');
        var agentOptionTeamCity = config.get('teamCityAgents');
        var agentOptions = this.clone(generalOptionTeamCity);
        agentOptions.connection.url += agentOptionTeamCity.relativeUrl;

        return agentOptions;
    },
    getLaunchBuildsOptions: function (buildTypeId, agentId) {
        var launchBuildsOptionTeamCity = config.get('teamCityLaunchBuilds');
        var launchBuildsOptions = this.clone(config.get('generalTeamCity'));
        launchBuildsOptions.connection.url += launchBuildsOptionTeamCity.relativeUrl;
        launchBuildsOptions.connection.headers['Content-Type'] = launchBuildsOptionTeamCity['Content-Type'];
        launchBuildsOptions.connection.body = launchBuildsOptionTeamCity.body.replace('_buildTypeId_', buildTypeId).replace('_agentId_', agentId);
        return launchBuildsOptions;
    },

    getBuildOptions: function (sinceBuildId) {
        var generalOptionTeamCity = config.get('generalTeamCity');
        var buildOptionTeamCity = config.get('teamCityBuilds');
        var buildOptions = this.clone(generalOptionTeamCity);
        if (sinceBuildId) {
            buildOptions.connection.url += buildOptionTeamCity.relativeUrlSinceIdBuilds + sinceBuildId;
        } else {
            buildOptions.connection.url += buildOptionTeamCity.relativeUrlWithRunnedBuilds;
        }
        //buildOptions.options = this.clone(buildOptionTeamCity.options);

        return buildOptions;
    }
};

module.exports = generalConnectionOptionHelper;
