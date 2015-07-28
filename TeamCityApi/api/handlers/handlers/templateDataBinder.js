var getHtmlContentForCurrentTemplate = function (optionConfigName, currentPageTemplateSubdirectoryPath){
    var getHtmlContent = function (req, res) {
        var config = require('../../libs/config');

        var request = require('request');
        var options = config.get(optionConfigName);
        request.get(options, function (err, response) {
            if (err) throw err;

            res.writeHeader(200, {"Content-Type": "text/plain"});

            console.log(currentPageTemplateSubdirectoryPath);
            var pathDirectory = __dirname + currentPageTemplateSubdirectoryPath;

            var swig = require('swig');
            var template = swig.compileFile(pathDirectory);

            var bindingJson = JSON.parse(response.body);
            var renderedHtml = template(bindingJson);
            res.end(renderedHtml);
        });
    };
    return getHtmlContent;
};

function setupDataBinder(app, restApiPath, optionConfigName, pageTemplateSubdirectoryPath)
{
    app.get(restApiPath, getHtmlContentForCurrentTemplate(optionConfigName, pageTemplateSubdirectoryPath));
}

exports.setupDataBinder = setupDataBinder;