var handlers = {
    test  : require('./handlers/testHandler'),
    fullBuildsInformation: require('./handlers/fullBuildsInformationHandler'),
    error : require('./handlers/errorHandler'),
    fooBar : require('./handlers/fooBarHandlers'),
    agents : require('./handlers/agentHandler'),
    build : require('./handlers/buildHandler')
};

exports.handlers = handlers;
