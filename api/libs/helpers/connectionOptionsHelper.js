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

    getBuildOptions: function () {
        var generalOptionTeamCity = config.get('teamCityGeneral');
        var buildOptionTeamCity = config.get('teamCityBuilds');
        var buildOptions = this.clone(generalOptionTeamCity);
        buildOptions.connection.url += buildOptionTeamCity.relativeUrl;
        buildOptions.options = this.clone(buildOptionTeamCity.options);

        return buildOptions;
    }
};

module.exports = optionsHelper;