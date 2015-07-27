var request = require('request');
var swig = require('swig');
var config = require('../../libs/config');

var setupHandlers = function(app) {
    var templateDataBinder = require('./templateDataBinder');
    var restApiPath = '/builds';
    var optionConfigName = 'teamCityBuilds';
    var pageTemplateSubdirectoryPath = '\\..\\..\\public\\pages\\build-information-panel.html';
    templateDataBinder.templateDataBinderConstructor(optionConfigName, pageTemplateSubdirectoryPath, restApiPath);
    templateDataBinder.setupDataBinder(app);
};

module.exports.setupHandlers = setupHandlers;