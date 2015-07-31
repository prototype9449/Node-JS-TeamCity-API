var generatorHelper = {
    getJson: function (options, callback) {
        var request = require('request');

        request.get(options, function (err, response) {
            if (err) throw err;

            var bindingJson = JSON.parse(response.body);

            callback(bindingJson);
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




