var request = require('request');
var config = require('./../../helpers/connectionOptionsHelper');
var generateBuildsByAgent = require('./../buildProviders/jsonBuildByAgentProvider').generateBuildsByAgent;

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
    for(var i = 0; i < properties.length; i++){
        if(properties[i].name == 'teamcity.agent.work.dir.freeSpaceMb'){
            return properties[i].value;
        }
    }
}

function getFinalAgentJson(agentId, agentHref, callback) {

    getMainInfo(agentHref, function (jsonAgent) {
        var agentName = jsonAgent.name;
        var agentFreeSpace = getAgentFreeSpace(jsonAgent);
        var agentStatus = {
            connected: jsonAgent.connected,
            authorized: jsonAgent.authorized,
            enabled: jsonAgent.enabled
        };
        //generateBuildsByAgent(agentName, function (agentBuilds) {

            var finalJsonAgent =
            {
                href: agentHref,
                id: agentId,
                name: agentName,
                status: agentStatus,
                freeSpace: agentFreeSpace,
                //builds: agentBuilds.builds
            };

            callback(finalJsonAgent);
        //})
    })
}

module.exports.generateAgentJson = getFinalAgentJson;