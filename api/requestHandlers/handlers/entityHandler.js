var getHtmlContentForCurrentTemplate = function(pageHtmlTemplatePath, connection) {
        var getHtmlContent = function (req, res) {
        var htmlGenerator = require('../../libs/htmlGenerator');

        htmlGenerator.generateHtml(connection, pageHtmlTemplatePath, function (data) {
            res.writeHeader(200, {"Content-Type": "text/plain"});
            res.end(data);
        });
    };
    return getHtmlContent;
};

var setupHandlers = function(app, settings) {
    app.get(settings.options.restApiPath,  getHtmlContentForCurrentTemplate(settings.options.pageHtmlTemplatePath, settings.connection));
};

exports.setupHandlers = setupHandlers;