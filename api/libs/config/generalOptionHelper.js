var config = require('./nconfSetting');

var generalConnectionOptionHelper =
{
    clone: function (object) {
        var copy = JSON.stringify(object);
        return JSON.parse(copy);
    },
    getGeneralOptions: function () {
        var generalOption = config.general().get('generalOptions');

        return this.clone(generalOption);
    },

    getAgentOptions: function () {
        var generalOption = config.general().get('generalOptions');
        var agentPaths = config.urlPaths().get('agentOptions');

        var agentOptions = this.clone(generalOption);
        agentOptions.connection.url += agentPaths.relativeUrl;

        return agentOptions;
    },
    getLaunchBuildsOptions: function (buildTypeId, agentId) {
        var generalOption = config.general().get('generalOptions');
        var launchBuildsOption = config.urlPaths().get('launchBuildOptions');

        var launchBuildsOptions = this.clone(generalOption);
        launchBuildsOptions.connection.url += launchBuildsOption.relativeUrl;
        launchBuildsOptions.connection.headers['Content-Type'] = launchBuildsOption['Content-Type'];
        launchBuildsOptions.connection.body = launchBuildsOption.body.replace('_buildTypeId_', buildTypeId).replace('_agentId_', agentId);

        return launchBuildsOptions;
    },

    getBuildOptions: function (sinceBuildId) {
        var generalOption = config.general().get('generalOptions');
        var buildPaths = config.urlPaths().get('buildOptions');

        var buildOptions = this.clone(generalOption);
        if (sinceBuildId) {
            buildOptions.connection.url += buildPaths.relativeUrlSinceIdBuilds + sinceBuildId;
        } else {
            buildOptions.connection.url += buildPaths.relativeUrlWithRunnedBuilds;
        }

        return buildOptions;
    },

    getBuildTypeOptions: function () {
        var generalOption = generalConnectionOptionHelper.getGeneralOptions();
        var buildPaths = config.urlPaths().get('buildTypeOptions');
       generalOption.connection.url += buildPaths.relativeUrl;
        return generalOption;
    },

    getAgentFixBuildsOptions: function () {
        var generalOption = config.general().get('generalOptions');
        return this.clone(generalOption.agentFixBuilds);
    }
};

module.exports = generalConnectionOptionHelper;
