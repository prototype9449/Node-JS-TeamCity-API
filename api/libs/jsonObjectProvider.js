var request = require('request');
var config = require('./config');
var optionTeamCityBuild = config.get('teamCityBuild').connection;
var optionTeamCityVSC = config.get('teamCityVSC').connection;

var getBuildJson = function (buildID, callback) {
    var backUpUrl = optionTeamCityBuild.url;
    optionTeamCityBuild.url += buildID;
    request.get(optionTeamCityBuild, function (err, response) {
        if (err) throw err;
        var buildJson = JSON.parse(response.body);
        callback(buildJson);
    });
    optionTeamCityBuild.url = backUpUrl;
}

var getVSCInstance = function (vscId, callback) {
    var backUpUrl = optionTeamCityVSC.url;
    optionTeamCityVSC.url += vscId;
    request.get(optionTeamCityVSC, function (err, response) {
        if (err) throw err;
        var vscJson = JSON.parse(response.body);
        callback(vscJson);
    });
    optionTeamCityVSC.url = backUpUrl;
}

var getFinalBuildJson = function (buildId, callback) {
    getBuildJson(buildId, function(jsonBuild){
        var agentName = jsonBuild.agent.name;
        var buildStatus = jsonBuild.status;
        var buildName = jsonBuild.buildTypeId;
        var vscId = jsonBuild.revisions.revision[0]['vcs-root-instance'].id;
        getVSCInstance(vscId, function (vscJson) {
            var branchName = vscJson.properties.property[3].value;
            var finalJsonBuild =
            {
                id : buildId,
                buildName : buildName,
                buildStatus : buildStatus,
                buildAgentName : agentName,
                buildBranchName : branchName
            };

            callback(finalJsonBuild);
        })
    })
}

module.exports.getBuild = getFinalBuildJson;