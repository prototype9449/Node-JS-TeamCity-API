var config = require('./config');

var additionalConnectionOptionHelper =
{
    clone: function (object) {
        var copy = JSON.stringify(object);
        return JSON.parse(copy);
    },
    getGeneralOptions: function () {
        var generalOption = config.additional().get('additionalTeamCity');

        return this.clone(generalOption);
    },

    getOneBuildByBuildTypeIdOptions: function (id) {
        var generalOption = config.additional().get('additionalTeamCity');
        var buildPaths = config.get('teamCityBuilds');

        var buildOptions = this.clone(generalOption);
        buildOptions.connection.url += buildPaths.relativeUrlOneBuildByBuildTypeId.replace('_buildTypeId_', id);

        return buildOptions;
    },

    getBuildTypesOptions: function () {
        var generalOption = config.get('additionalTeamCity');
        var buildTypesPaths = config.get('teamCityBuildTypes');

        var buildOptions = this.clone(generalOption);
        buildOptions.connection.url += buildTypesPaths.relativeUrl;

        return buildOptions;
    }
};

module.exports = additionalConnectionOptionHelper;