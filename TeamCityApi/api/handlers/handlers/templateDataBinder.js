var _optionConfigName, _currentPageTemplateSubdirectoryPath, _restApiPath;
var parametersWrapper;

var templateDataBinderConstructor = function(optionConfigName, currentPageTemplateSubdirectoryPath, restApiPath) {
    _optionConfigName = optionConfigName;
    _currentPageTemplateSubdirectoryPath = currentPageTemplateSubdirectoryPath;
    _restApiPath = restApiPath;
    parametersWrapper = {
        optionConfigName: _optionConfigName,
        currentPageTemplateSubdirectoryPath : _currentPageTemplateSubdirectoryPath,
        restApiPath : _restApiPath
    };
};

var getHtmlContent = function (req, res) {
    var config = require('../../libs/config');

    var request = require('request');
    var options = config.get(parametersWrapper.optionConfigName);
    request.get(options, function (err, response) {
        if (err) throw err;

        res.writeHeader(200, {"Content-Type": "text/plain"});

        console.log(_currentPageTemplateSubdirectoryPath);
        var pathDirectory = __dirname + parametersWrapper.currentPageTemplateSubdirectoryPath;

        var swig = require('swig');
        var template = swig.compileFile(pathDirectory);

        var bindingJson = JSON.parse(response.body);
        var renderedHtml = template(bindingJson);
        res.end(renderedHtml);
    });
};

function setupDataBinder(app)
{
    app.get(parametersWrapper.restApiPath, getHtmlContent);
}

module.exports.setupDataBinder = setupDataBinder;
module.exports.templateDataBinderConstructor = templateDataBinderConstructor;