var handlers = {
    test  : require('./handlers/testHandler'),
    build : require('./handlers/buildHandler'),
    agents: require('./handlers/agentHandler'),
    fullBuildsInformation: require('./handlers/fullBuildsInformationHandler'),
    error : require('./handlers/errorHandler'),
    fooBar : require('./handlers/fooBarHandlers')
};

exports.handlers = handlers;
