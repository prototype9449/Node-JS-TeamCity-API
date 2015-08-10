var generateBuild = require('./buildProviders/jsonBuildProvider').generateBuildJson;
var generateAgent = require('./agentProviders/jsonAgentProvider').generateAgentJson;
var request = require('request');

var generateBuilds =  function(builds, callback) {
    var jsonBuilds = [];
    for (var i = 0; i < builds.length; i++) {
        var currentBuild = builds[i];
        generateBuild(currentBuild.id, currentBuild.href, function (build) {
            jsonBuilds.push(build);
            if (jsonBuilds.length == builds.length) {
                callback({builds: jsonBuilds});
            }
        })
    }
};

var generateAgents = function(agents, callback) {

    var jsonAgents = [];
    for (var i = 0; i < agents.length; i++) {
        var currentAgent = agents[i];
        generateAgent (currentAgent.id, currentAgent.href, function (buildType) {
            jsonAgents.push(buildType);
            if (jsonAgents.length == agents.length) {
                callback({agents: jsonAgents});
            }
        })
    }
};

var generateObjects = function(options, callback) {
    request.get(options, function (err, response) {
        if (err) throw err;

        var bindingJson = JSON.parse(response.body);

        if (bindingJson.build) {
            generateBuilds(bindingJson.build, callback);
        }
        else {
            generateAgents(bindingJson.agent, callback);
        }
    })
};

module.exports.generateObjects = generateObjects;
