var request = require('request');
var config = require('./../../helpers/connectionOptionsHelper');

function getMainInfo(agentHref, callback) {
    var optionTeamCity = config.getGeneralOptions().connection;
    optionTeamCity.url += agentHref;

    request.get(optionTeamCity, function (err, response) {
        if (err) throw err;
        var fullAgentInfo = JSON.parse(response.body);
        callback(fullAgentInfo);
    });
}

function getAgentFreeSpace(jsonAgent) {
    var properties = jsonAgent.properties.property;
    for (var i = 0; i < properties.length; i++) {
        if (properties[i].name == 'teamcity.agent.work.dir.freeSpaceMb') {
            return properties[i].value;
        }
    }
}

function getFinalAgentJson(agentId, agentHref, callback) {

    getMainInfo(agentHref, function (jsonAgent) {

        var bitStatus = jsonAgent.connected && jsonAgent.authorized && jsonAgent.enabled;
        var ready = bitStatus == true ? 'Yes' : 'No';

        var finalJsonAgent =
        {
            id: agentId,
            href: 'agentInfo.html?id=' + agentId,
            name: jsonAgent.name,
            freeSpace: getAgentFreeSpace(jsonAgent),
            status: {
                connected: jsonAgent.connected,
                authorized: jsonAgent.authorized,
                enabled: jsonAgent.enabled,
                ready: ready
            }
        };

        callback(finalJsonAgent);

    })
}

module.exports.generateAgentJson = getFinalAgentJson;