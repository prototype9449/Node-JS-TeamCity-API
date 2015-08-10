var request = require('request');
var config = require('./config');
var generateObjects = require('./providers/objectProvider').generateObjects;

var generatorHelper = {
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
        generateObjects(options, function (jsonData) {
            generatorHelper.generateHtmlFromJson(jsonData, currentPageTemplateSubdirectoryPath, callback)
        });
    }
};

module.exports = generatorHelper;




