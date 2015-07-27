var request = require('request');
var swig = require('swig');
var config = require('../../libs/config');

var setupHandlers = function(app) {
    var templateDataBinder = require('./templateDataBinder');
    var restApiPath = "/agents";
    var optionConfigName = 'teamCityAgents';
    var pageTemplateSubdirectoryPath = '\\..\\..\\public\\pages\\agent-information-panel.html';
    templateDataBinder.templateDataBinderConstructor(optionConfigName, pageTemplateSubdirectoryPath, restApiPath);
    templateDataBinder.setupDataBinder(app);
};

module.exports.setupHandlers = setupHandlers;