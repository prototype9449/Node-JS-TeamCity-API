var config = require('../libs/config');
var handlers = {
    //test: {
    //    module: require('./handlers/testHandler'),
    //    options: null
    //},
    //fullBuildsInformation: {
    //    module: require('./handlers/fullBuildsInformationHandler'),
    //    options: null
    //},
    //error: {
    //    module: require('./handlers/errorHandler'),
    //    options: null
    //},
    //agents: {
    //    module: require('./handlers/entityHandler'),
    //    options: config.get("teamCityAgents").options
    //},
    build: {
        module: require('./handlers/entityHandler'),
        options: config.get("teamCityBuildTypes").options
    }
};

exports.handlers = handlers;

