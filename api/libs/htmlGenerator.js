var request = require('request');
var config = require('./config');
var generateBuild = require('./providers/buildProviders/jsonBuildProvider').generateBuildJson;
var generateAgent = require('./providers/agentProviders/jsonAgentProvider').generateAgent;

var generatorHelper = {
    generateBuilds: function (builds, callback) {
        var jsonBuilds = [];
        for (var i = 0; i < builds.length; i++) {
            var currentBuild = builds[i];
            generateBuild(currentBuild.id, currentBuild.href, function (build) {
                jsonBuilds.push(build)
                if (jsonBuilds.length == builds.length) {
                    callback({builds: jsonBuilds});
                }
            })
        }
    },
    generateAgents: function (agents, callback) {

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
    },

    getJson: function (options, callback) {
        request.get(options, function (err, response) {
            if (err) throw err;

            var bindingJson = JSON.parse(response.body);

            if (bindingJson.build) {
                generatorHelper.generateBuilds(bindingJson.build, callback);
            }
            else {
                generatorHelper.generateAgents(bindingJson.agent, callback);
            }
        })
    },
    generateHtmlFromJson: function (jsonData, currentPageTemplateSubdirectoryPath, callback) {
        var pathDirectory = __dirname + currentPageTemplateSubdirectoryPath;
        var swig = require('swig');
        var finalHtml = "";
        var jsonItems;
        if (jsonData.agents != undefined) {
            jsonItems = jsonData.agents;
        }
        else if (jsonData.builds != undefined) {
            jsonItems = jsonData.builds;
        }
        var controlsWrapperJson = [];
        for (var i = 0; i < jsonItems.length; i++) {
            var jsonItem = jsonItems[i];
            var template = swig.compileFile(pathDirectory);
            var currentHtmlControl = template(jsonItem);
            controlsWrapperJson.push({id: jsonItem.id, htmlContent: currentHtmlControl});
            finalHtml += currentHtmlControl;
        }
        //var renderedHtml = template(jsonData);
        //callback(finalHtml);
        callback(JSON.stringify(controlsWrapperJson));
    },

    generateHtml : function(options, currentPageTemplateSubdirectoryPath, callback) {
        generatorHelper.getJson(options, function (jsonData) {
            generatorHelper.generateHtmlFromJson(jsonData, currentPageTemplateSubdirectoryPath, callback)
        });
    }
};



module.exports = generatorHelper;




