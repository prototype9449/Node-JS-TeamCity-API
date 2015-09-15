var generateBuild = require('./generalBuildProvider').generateBuildJson;
var generateAgent = require('./agentProvider').generateAgentJson;
var request = require('request');

var generateBuilds = function (builds, callback) {
    var jsonBuilds = [];
    for (var i = 0; i < builds.length; i++) {
        var currentBuild = builds[i];
        generateBuild(currentBuild.id, currentBuild.href).then(function (build) {
            jsonBuilds.push(build);
            if (jsonBuilds.length == builds.length) {
                jsonBuilds.sort(function (build1, build2) {
                    return build2.build.id - build1.build.id;
                });
                callback(jsonBuilds);
            }
        })
    }
};

var generateAgents = function (agents, callback) {
    var jsonAgents = [];
    for (var i = 0; i < agents.length; i++) {
        var currentAgent = agents[i];
        generateAgent(currentAgent.href).then(function (jsonAgent) {
            jsonAgents.push(jsonAgent);
            if (jsonAgents.length == agents.length) {
                callback(jsonAgents);
            }
        });
    }
};

var generateBuildTypes = function (buildTypes, callback) {
    var jsonBuildTypes = [];
    for (var i = 0; i < buildTypes.length; i++) {
        jsonBuildTypes.push({
            id: buildTypes[i].id,
            buildTypeName: buildTypes[i].name,
            projectName: buildTypes[i].projectName
        })
    }

    callback(jsonBuildTypes);
};

var generateObjects = function (connection, callback) {
    request.get(connection, function (err, response) {
        if (err) throw err;

        var bindingJson = JSON.parse(response.body);

        if (bindingJson.build) {
            generateBuilds(bindingJson.build, callback);
        } else if (bindingJson.agent) {
            generateAgents(bindingJson.agent, callback);
        } else if (bindingJson.buildType) {
            generateBuildTypes(bindingJson.buildType, callback);
        }
    })
};

module.exports.generateObjects = generateObjects;
