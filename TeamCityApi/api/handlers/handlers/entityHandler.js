var request = require('request');
var swig = require('swig');
var config = require('../../libs/config');

var setupHandlers = function(app, restApiPath, optionConfigName, pageTemplateSubdirectoryPath) {
    var templateDataBinder = require('./templateDataBinder');
    templateDataBinder.setupHandlers(app, restApiPath, optionConfigName, pageTemplateSubdirectoryPath);
};

exports.setupHandlers = setupHandlers;