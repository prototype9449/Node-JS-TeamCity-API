var request = require('request');
var config = require('./config');
var getBuild = require('./jsonObjectProvider').getBuild;

var generatorHelper = {
    generateBuilds : function(builds, callback)
    {
        var jsonBuilds = [];
        for(var i = 0; i < builds.length; i++)
        {
            var currentBuild = builds[i];
            getBuild(currentBuild.id, function(build){
                jsonBuilds.push(build);
                if(jsonBuilds.length == builds.length) {
                    callback({build : jsonBuilds});
                }
            })
        }
    },
    generateAgents : function(agents,options, callback)
    {
        var request = require('request');

        request.get(options, function (err, response) {
            if (err) throw err;

            var bindingJson = JSON.parse(response.body);

            callback(bindingJson);
        })
    },
    getJson: function (options, callback) {
        request.get(options, function (err, response) {
            if (err) throw err;

            var bindingJson = JSON.parse(response.body);

            if(bindingJson.build)
            {
                generatorHelper.generateBuilds (bindingJson.build, callback);
            }
            else
            {
                generatorHelper.generateAgents(bindingJson.agent,options, callback);
            }
        })
    },
    generateHtmlFromJson: function (jsonData, currentPageTemplateSubdirectoryPath, callback) {
        var pathDirectory = __dirname + currentPageTemplateSubdirectoryPath;
        var swig = require('swig');
        var finalHtml = "";
        var jsonItems;
        if(jsonData.agent != undefined){
            jsonItems = jsonData.agent;
        }
        else if (jsonData.build != undefined){
            jsonItems = jsonData.build;
        }
        var controlsWrapperJson = [];
        for(var i = 0; i < jsonItems.length; i++){
            var jsonItem = jsonItems[i];
            var template = swig.compileFile(pathDirectory);
            var currentHtmlControl = template(jsonItem);
            controlsWrapperJson.push({ id : jsonItem.id, htmlContent : currentHtmlControl});
            finalHtml += currentHtmlControl;
        }
        //var renderedHtml = template(jsonData);
        //callback(finalHtml);
        callback(JSON.stringify(controlsWrapperJson));
    }
};

function generateHtml(options, currentPageTemplateSubdirectoryPath, callback) {
    generatorHelper.getJson(options, function (jsonData) {
        generatorHelper.generateHtmlFromJson(jsonData, currentPageTemplateSubdirectoryPath, callback)
    });
}


module.exports.generateHtml = generateHtml;
module.exports.generatorHelper = generatorHelper;




