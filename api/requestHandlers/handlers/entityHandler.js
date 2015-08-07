var setupHandlers = function(app, options) {
    app.get(options.restApiPath,
        getHtmlContentForCurrentTemplate(options.configOptionName, options.pageHtmlTemplatePath));
};

var getHtmlContentForCurrentTemplate = function(optionConfigName, currentPageTemplateSubdirectoryPath) {
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

exports.setupHandlers = setupHandlers;