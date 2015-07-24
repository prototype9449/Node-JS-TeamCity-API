/**
 * Created by NikitaK on 7/24/2015.
 */
var request = require('request');
var swig = require('swig');
var config = require('../../libs/config');

var getHtmlContent = function (req, res, optionConfig, pageTemplateSubdirectoryPath) {
    var options = config.get(optionConfig);

    request.get(options, function (err, response) {
        if (err) throw err;

        res.writeHeader(200, {"Content-Type": "text/plain"});

        var pathDirectory = __dirname + pageTemplateSubdirectoryPath;
        var template = swig.compileFile(pathDirectory);

        var bindingJson = JSON.parse(response.body);
        var renderedHtml = template(bindingJson);
        res.end(renderedHtml);
    });
};

function setupDataBinder(app, restApiPath)
{
    app.get(restApiPath, getHtmlContent);
}

exports.setupHandlers = setupDataBinder;