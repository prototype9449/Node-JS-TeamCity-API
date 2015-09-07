var request = require('request');
var config = require('./../config/generalOptionHelper');

function generateMainInfo(agentHref, callback) {
    var optionTeamCity = config.getGeneralOptions().connection;
    optionTeamCity.url += agentHref;

    request.get(optionTeamCity, function (err, response) {
        if (err) {
            console.log(err);
            return;
        }
        var fullAgentInfo = JSON.parse(response.body);
        callback(fullAgentInfo);
    });
}

function generateAgentFreeSpace(jsonAgent) {
    var properties = jsonAgent.properties.property;
    for (var i = 0; i < properties.length; i++) {
        if (properties[i].name == 'teamcity.agent.work.dir.freeSpaceMb') {
            return (properties[i].value/1000).toFixed(1);
        }
    }
}

function generateFinalAgentJson(agentId, agentHref, callback) {

    generateMainInfo(agentHref, function (jsonAgent) {

        var bitStatus = jsonAgent.connected && jsonAgent.authorized && jsonAgent.enabled;
        var ready = bitStatus == true ? 'Yes' : 'No';

        var finalJsonAgent =
        {
            id: agentId,
            href: 'agentInfo.html?id=' + agentId,
            name: jsonAgent.name,
            freeSpace: generateAgentFreeSpace(jsonAgent),
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

module.exports.generateAgentJson = generateFinalAgentJson;