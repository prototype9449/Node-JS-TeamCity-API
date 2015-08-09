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

function getAgenFreeSpace(agentName, callback) {

}

function getFinalAgentJson(agentId, agentHref, callback) {

    getMainInfo(agentHref, function (jsonAgent) {
        var agentName = jsonAgent.name;
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
                //freeSpace: agentFreeSpace,
                history: agentHistory
            };

            callback(finalJsonAgent);
        })
    })
}

module.exports.generateAgent = getFinalAgentJson;