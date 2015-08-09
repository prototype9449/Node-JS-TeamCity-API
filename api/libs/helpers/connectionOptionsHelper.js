var config = require('./../config');
var optionsHelper =
{
    clone: function (object) {
        var copy = JSON.stringify(object);
        return JSON.parse(copy);
    },
    getGeneralOptions: function () {
        var generalOptionTeamCity = config.get('teamCityGeneral');

        return optionsHelper.clone(generalOptionTeamCity);
    },

    getAgentOptions: function () {
        var generalOptionTeamCity = config.get('teamCityGeneral');
        var agentOptionTeamCity = config.get('teamCityAgents');
        var agentOptions = optionsHelper.clone(generalOptionTeamCity);
        agentOptions.connection.url += agentOptionTeamCity.url;
        agentOptions.options = optionsHelper.clone(agentOptionTeamCity.options);

        return agentOptions;
    },

    getBuildOptions: function () {
        var generalOptionTeamCity = config.get('teamCityGeneral');
        var buildOptionTeamCity = config.get('teamCityBuildTypes');
        var buildOptions = optionsHelper.clone(generalOptionTeamCity);
        buildOptions.connection.url += buildOptionTeamCity.url;
        buildOptions.options = optionsHelper.clone(buildOptionTeamCity.options);

        return buildOptions;
    }
};

module.exports = optionsHelper;