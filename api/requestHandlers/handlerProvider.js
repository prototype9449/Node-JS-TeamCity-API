var config = require('../libs/helpers/connectionOptionsHelper');
var handlers = {
    agents: {
        module: require('./handlers/entityHandler'),
        options: config.getAgentOptions()
    },
    build: {
        module: require('./handlers/entityHandler'),
        options: config.getBuildOptions()
    }
};

exports.handlers = handlers;

