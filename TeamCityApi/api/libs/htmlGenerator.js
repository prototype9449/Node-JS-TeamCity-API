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
        var template = swig.compileFile(pathDirectory);
        var renderedHtml = template(jsonData);
        callback(renderedHtml);
    }
};

function generateHtml(options, currentPageTemplateSubdirectoryPath, callback) {
    generatorHelper.getJson(options, function (jsonData) {
        generatorHelper.generateHtmlFromJson(jsonData, currentPageTemplateSubdirectoryPath, callback)
    });
}


module.exports.generateHtml = generateHtml;
module.exports.generatorHelper = generatorHelper;




