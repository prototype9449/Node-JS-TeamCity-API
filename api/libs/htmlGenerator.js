var request = require('request');
var config = require('./config');
var getBuild = require('./providers/jsonBuildTypeProvider').getBuild;

var generatorHelper = {
    generateBuildTypes : function(buildTypes, callback)
    {
        var jsonBuildTypes = [];
        for(var i = 0; i < buildTypes.length; i++)
        {
            var currentBuildType = buildTypes[i];
            getBuild(currentBuildType.id, currentBuildType.href, function(buildType){
                jsonBuildTypes.push(buildType);
                if(jsonBuildTypes.length == buildTypes.length) {
                    callback({buildTypes : jsonBuildTypes});
                }
            })
        }
    },
    generateAgents : function(jsonAgents,callback)
    {

       callback({agents: jsonAgents});
    },
    getJson: function (options, callback) {
        request.get(options, function (err, response) {
            if (err) throw err;

            var bindingJson = JSON.parse(response.body);

            if(bindingJson.buildType)
            {
                generatorHelper.generateBuildTypes(bindingJson.buildType, callback);
            }
            else
            {
                generatorHelper.generateAgents(bindingJson.agent, callback);
            }
        })
    },
    generateHtmlFromJson: function (jsonData, currentPageTemplateSubdirectoryPath, callback) {
        var pathDirectory = __dirname + currentPageTemplateSubdirectoryPath;
        var swig = require('swig');
        var finalHtml = "";
        var jsonItems;
        if(jsonData.agents != undefined){
            jsonItems = jsonData.agents;
        }
        else if (jsonData.buildTypes != undefined){
            jsonItems = jsonData.buildTypes;
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




