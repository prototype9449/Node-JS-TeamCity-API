var handlers = {
    test  : require('./handlers/testHandler'),
    fullBuildsInformation: require('./handlers/fullBuildsInformationHandler'),
    error : require('./handlers/errorHandler'),
    fooBar : require('./handlers/fooBarHandlers')
};
var htmlContentGeneratorHandlers = {
    agents : {
        module : require('./handlers/agentHandler'),
        restApiPath : '/agents',
        configOptionName :'teamCityAgents',
        pageHtmlTemplatePath : '\\..\\..\\public\\pages\\agent-information-panel.html'
    },
    build : {
        module : require('../handlers/handlers/buildHandler'),
        restApiPath : '/builds',
        configOptionName : 'teamCityBuilds',
        pageHtmlTemplatePath : '\\..\\..\\public\\pages\\build-information-panel.html'
    }
};

exports.handlers = handlers;
exports.htmlContentGeneratorHandlers =  htmlContentGeneratorHandlers;
