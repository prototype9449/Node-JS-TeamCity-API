var setupHandlers = function(app, options) {

    var templateDataBinder = require('./templateDataBinder');
    templateDataBinder.setupDataBinder(app, options.restApiPath, options.configOptionName, options.pageHtmlTemplatePath);
};

exports.setupHandlers = setupHandlers;