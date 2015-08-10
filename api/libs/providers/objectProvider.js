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

var generateObjects = function(number, connection, callback) {
    request.get(connection, function (err, response) {
        if (err) throw err;

        var bindingJson = JSON.parse(response.body);

        var getSpliceArray = function(array, number) {
            if(!number) return array;

            if(array.length > number) {
                return array.splice(0, number);
            }
        };

        if (bindingJson.build) {
            var builds = getSpliceArray(bindingJson.build, number);
            generateBuilds(builds, callback);
        }
        else if(bindingJson.agent) {
            var agents = getSpliceArray(bindingJson.agent, number);
            generateAgents(agents, callback);
        }
        else{
            throw new Error('Unknown type')
        }
    })
};

module.exports.generateObjects = generateObjects;
