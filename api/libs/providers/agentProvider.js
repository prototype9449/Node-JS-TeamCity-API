var requestp = require('request-promise');
var config = require('./../config/generalOptionHelper');
var Promise = require('promise');

function generateMainInfo(agentHref) {
    return new Promise(function (resolve, reject) {
        var optionTeamCity = config.getGeneralOptions().connection;
        optionTeamCity.url += agentHref;

        requestp(optionTeamCity).then(function (response) {
            var fullAgentInfo = JSON.parse(response);
            resolve(fullAgentInfo);
        }, function (err) {
            throw err;
            //reject(err);
        });
    });
}

function getFreeSpace(jsonAgent) {
    var properties = jsonAgent.properties.property;
    for (var i = 0; i < properties.length; i++) {
        if (properties[i].name == 'teamcity.agent.work.dir.freeSpaceMb') {
            return (properties[i].value / 1000).toFixed(1);
        }
    }
}

function  getValidateAgentData(jsonAgent) {
    return new Promise(function (resolve, reject) {

        var bitStatus = jsonAgent.connected && jsonAgent.authorized && jsonAgent.enabled;
        var ready = bitStatus == true ? 'Yes' : 'No';

        var finalJsonAgent =
        {
            id: jsonAgent.id,
            href: 'agentInfo.html?id=' + jsonAgent.id,
            name: jsonAgent.name,
            freeSpace: getFreeSpace(jsonAgent),
            status: {
                connected: jsonAgent.connected,
                authorized: jsonAgent.authorized,
                enabled: jsonAgent.enabled,
                ready: ready
            }
        };
        resolve(finalJsonAgent);
    });
}

function generateFinalAgentJson(agentHref) {
    return new Promise(function (resolve, reject) {
        generateMainInfo(agentHref).then( getValidateAgentData).then(resolve);
    });
}

module.exports.generateAgentJson = generateFinalAgentJson;