var config = require('./../config');

var additionalConnectionOptionHelper =
{
    clone: function (object) {
        var copy = JSON.stringify(object);
        return JSON.parse(copy);
    },
    getGeneralOptions: function () {
        var additionalOptionTeamCity = config.get('additionalTeamCity');
        return this.clone(additionalOptionTeamCity);
    },

    getOneBuildByBuildTypeIdOptions: function (id) {
        var generalOptionTeamCity = config.get('additionalTeamCity');
        var buildOptionTeamCity = config.get('teamCityBuilds');
        var buildOptions = this.clone(generalOptionTeamCity);
        buildOptions.connection.url += buildOptionTeamCity.relativeUrlOneBuildByBuildTypeId.replace('_buildTypeId_', id);

        return buildOptions;
    },

    getBuildTypesOptions: function () {
        var generalOptionTeamCity = config.get('additionalTeamCity');
        var buildOptionTeamCity = config.get('teamCityBuildTypes');
        var buildOptions = this.clone(generalOptionTeamCity);
        buildOptions.connection.url += buildOptionTeamCity.relativeUrl;
        buildOptions.options = buildOptionTeamCity.options;

        return buildOptions;
    }
};

module.exports = additionalConnectionOptionHelper;