var config = require('../libs/config');
var handlers = {
    agents: {
        module: require('./handlers/entityHandler'),
        options: config.get("teamCityAgents").options
    },
    build: {
        module: require('./handlers/entityHandler'),
        options: config.get("teamCityBuildTypes").options
    }
};

exports.handlers = handlers;

