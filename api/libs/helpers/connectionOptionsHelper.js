var config = require('./../config');
var optionsHelper =
{
    clone: function (object) {
        var copy = JSON.stringify(object);
        return JSON.parse(copy);
    },
    getGeneralOptions: function () {
        var generalOptionTeamCity = config.get('teamCityGeneral');

        return this.clone(generalOptionTeamCity);
    },

    getAgentOptions: function () {
        var generalOptionTeamCity = config.get('teamCityGeneral');
        var agentOptionTeamCity = config.get('teamCityAgents');
        var agentOptions = this.clone(generalOptionTeamCity);
        agentOptions.connection.url += agentOptionTeamCity.relativeUrl;
        agentOptions.options = this.clone(agentOptionTeamCity.options);

        return agentOptions;
    },
    getLaunchBuildsOptions: function (buildTypeId, agentId) {
        var launchBuildsOptionTeamCity = config.get('teamCityLaunchBuilds');
        var launchBuildsOptions = this.clone(config.get('teamCityGeneral'));
        launchBuildsOptions.connection.url += launchBuildsOptionTeamCity.relativeUrl;
        launchBuildsOptions.connection.headers['Content-Type'] = launchBuildsOptionTeamCity['Content-Type'];
        launchBuildsOptions.connection.body = launchBuildsOptionTeamCity.body.replace('_buildTypeId_', buildTypeId).replace('_agentId_', agentId);
        return launchBuildsOptions;
    },
    getBuildOptions: function (sinceBuildId) {
        var generalOptionTeamCity = config.get('teamCityGeneral');
        var buildOptionTeamCity = config.get('teamCityBuilds');
        var buildOptions = this.clone(generalOptionTeamCity);
        if (sinceBuildId) {
            buildOptions.connection.url += buildOptionTeamCity.relativeUrlSinceIdBuilds + sinceBuildId;
        } else {
            buildOptions.connection.url += buildOptionTeamCity.relativeUrlWithRunnedBuilds;
        }
        buildOptions.options = this.clone(buildOptionTeamCity.options);

        return buildOptions;
    },

    getAgentByIdOptions: function (id) {
        var generalOptionTeamCity = config.get('teamCityGeneral');
        var agentOptionTeamCity = config.get('teamCityAgents');
        var agentOptions = this.clone(generalOptionTeamCity);
        agentOptions.connection.url = agentOptionTeamCity.relativeUrl + '/id:' + id;
        agentOptions.options = this.clone(agentOptionTeamCity.options);

        return agentOptions;
    },

    getBuildByIdOptions: function (id) {
        var generalOptionTeamCity = config.get('teamCityGeneral');
        var buildOptionTeamCity = config.get('teamCityBuilds');
        var buildOptions = this.clone(generalOptionTeamCity);
        buildOptions.connection.url = buildOptionTeamCity.relativeUrl + '/id:' + id;
        buildOptions.options = this.clone(buildOptionTeamCity.options);

        return buildOptions;
    },

    getOneBuildBybuildTypeIdOptions: function (id) {
        var generalOptionTeamCity = config.get('teamCityGeneral');
        var buildOptionTeamCity = config.get('teamCityBuilds');
        var buildOptions = this.clone(generalOptionTeamCity);
        buildOptions.connection.url += buildOptionTeamCity.relativeUrlOneBuildByBuildTypeId.replace('_buildTypeId_', id);

        return buildOptions;
    },

    getBuildTypesOptions: function () {
        var generalOptionTeamCity = config.get('teamCityGeneral');
        var buildOptionTeamCity = config.get('teamCityBuildTypes');
        var buildOptions = this.clone(generalOptionTeamCity);
        buildOptions.connection.url += buildOptionTeamCity.relativeUrl;
        buildOptions.options = buildOptionTeamCity.options;

        return buildOptions;
    }
};

module.exports = optionsHelper;