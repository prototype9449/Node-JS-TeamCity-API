var generateBuild = require('./generalBuildProvider').generateBuildJson;
var generateAgent = require('./agentProvider').generateAgentJson;
var request = require('request');
var Promise = require('promise');
var requestp = require('request-promise');

var generateBuilds = function (builds) {
    return new Promise(function (resolve, reject) {
        var jsonBuilds = [];
        for (var i = 0; i < builds.length; i++) {
            var currentBuild = builds[i];
            generateBuild(currentBuild.id, currentBuild.href).then(function (build) {
                jsonBuilds.push(build);
                if (jsonBuilds.length == builds.length) {
                    jsonBuilds.sort(function (build1, build2) {
                        return build2.build.id - build1.build.id;
                    });
                    resolve(jsonBuilds);
                }
            })
        }
    });
};

var generateAgents = function (agents) {
    return new Promise(function (resolve, reject) {
        var jsonAgents = [];
        for (var i = 0; i < agents.length; i++) {
            var currentAgent = agents[i];
            generateAgent(currentAgent.href).then(function (jsonAgent) {
                jsonAgents.push(jsonAgent);
                if (jsonAgents.length == agents.length) {
                    resolve(jsonAgents);
                }
            });
        }
    });
};

var generateBuildTypes = function (buildTypes) {
    return new Promise(function (resolve, reject) {
        var jsonBuildTypes = [];
        for (var i = 0; i < buildTypes.length; i++) {
            jsonBuildTypes.push({
                id: buildTypes[i].id,
                buildTypeName: buildTypes[i].name,
                projectName: buildTypes[i].projectName
            })
        }

        resolve(jsonBuildTypes);
    });
};

var generateObjects = function (connection) {

    return new Promise(function (resolve, reject) {
        requestp(connection).then(function (body) {
            var bindingJson = JSON.parse(body);
            if (bindingJson.build) {
                generateBuilds(bindingJson.build).then(resolve);
            } else if (bindingJson.agent) {
                generateAgents(bindingJson.agent).then(resolve);
            } else if (bindingJson.buildType) {
                generateBuildTypes(bindingJson.buildType).then(resolve);
            }
        })
    });
};

module.exports.generateObjects = generateObjects;
