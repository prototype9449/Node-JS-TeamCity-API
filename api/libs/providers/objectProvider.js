var generateBuild = require('./jsonBuildProvider').generateBuildJson;
var generateAgent = require('./jsonAgentProvider').generateAgentJson;
var request = require('request');

var generateBuilds = function (builds, callback) {
    var jsonBuilds = [];
    for (var i = 0; i < builds.length; i++) {
        var currentBuild = builds[i];
        generateBuild(currentBuild.id, currentBuild.href, function (build) {
            jsonBuilds.push(build);
            if (jsonBuilds.length == builds.length) {
                jsonBuilds.sort(function (build1, build2) {
                    return build2.build.id - build1.build.id;
                });
                callback({builds: jsonBuilds});
            }
        })
    }
};

var generateAgents = function (agents, callback) {
    var jsonAgents = [];
    for (var i = 0; i < agents.length; i++) {
        var currentAgent = agents[i];
        generateAgent(currentAgent.id, currentAgent.href, function (buildType) {
            jsonAgents.push(buildType);
            if (jsonAgents.length == agents.length) {
                callback({agents: jsonAgents});
            }
        })
    }
};

var generateObjects = function (connection, callback) {
    request.get(connection, function (err, response) {
        if (err) throw err;

        var bindingJson = JSON.parse(response.body);

        if (bindingJson.build) {
            generateBuilds(bindingJson.build, callback);
        }
        else if (bindingJson.agent) {
            generateAgents(bindingJson.agent, callback);
        }
    })
};

module.exports.generateObjects = generateObjects;
