var request = require('request');
var config = require('./config');
var generateObjects = require('./providers/objectProvider').generateObjects;
var swig = require('swig');

var generatorHelper = {
    generateHtmlFromJson: function (jsonData, itemName, currentPageTemplateSubdirectoryPath, callback) {
        console.time('generateHtml');
        var pathDirectory = __dirname + currentPageTemplateSubdirectoryPath;
        var finalHtml = "";

        var jsonItems = jsonData[itemName];
        jsonItems.sort(function (item1, item2) {
            return item1.id - item2.id;
        });
        var controlsWrapperJson = [];
        for (var i = 0; i < jsonItems.length; i++) {
            var jsonItem = jsonItems[i];
            var template = swig.compileFile(pathDirectory);
            var currentHtmlControl = template(jsonItem);
            controlsWrapperJson.push({id: jsonItem.id, htmlContent: currentHtmlControl});
            finalHtml += currentHtmlControl;
        }

        console.timeEnd('generateHtml');
        callback(JSON.stringify(controlsWrapperJson));
    },

    generateHtml: function (options, currentPageTemplateSubdirectoryPath, callback) {
        generateObjects(options, function (jsonData) {
            generatorHelper.generateHtmlFromJson(jsonData, currentPageTemplateSubdirectoryPath, callback)
        });
    }
};

module.exports = generatorHelper;




