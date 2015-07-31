var getHtmlContentForCurrentTemplate = function (optionConfigName, currentPageTemplateSubdirectoryPath) {
    var getHtmlContent = function (req, res) {
        var config = require('../../libs/config');
        var htmlGenerator = require('../../libs/htmlGenerator');

        var options = config.get(optionConfigName).connection;

        htmlGenerator.generateHtml(options, currentPageTemplateSubdirectoryPath, function (data) {
            res.writeHeader(200, {"Content-Type": "text/plain"});
            res.end(data);
        });
    };
    return getHtmlContent;
};

function setupDataBinder(app, restApiPath, optionConfigName, pageTemplateSubdirectoryPath) {
    app.get(restApiPath, getHtmlContentForCurrentTemplate(optionConfigName, pageTemplateSubdirectoryPath));
}

exports.setupDataBinder = setupDataBinder;