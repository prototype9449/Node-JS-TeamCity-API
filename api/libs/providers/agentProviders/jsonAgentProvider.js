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

function getAgentBuildHistory(agentName, callback) {
    var buildProvider =  require('./../buildProviders/jsonBuildByAgentProvider');

    var history = {};
   // history = buildProvider(agentName);
    callback(history);
}

function getAgenFreeSpace(jsonAgent) {
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
        var agentFreeSpace = getAgenFreeSpace(jsonAgent);
        var agentStatus = {
            connected: jsonAgent.connected,
            authorized: jsonAgent.authorized,
            enabled: jsonAgent.enabled
        };
        getAgentBuildHistory(agentName, function (agentHistory) {

            var finalJsonAgent =
            {
                href: agentHref,
                id: agentId,
                name: agentName,
                status: agentStatus,
                freeSpace: agentFreeSpace,
                history: agentHistory
            };

            callback(finalJsonAgent);
        })
    })
}

module.exports.generateAgentJson = getFinalAgentJson;