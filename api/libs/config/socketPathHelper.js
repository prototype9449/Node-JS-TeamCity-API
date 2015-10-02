var config = require('./nconfSetting');

function clone (object) {
    var copy = JSON.stringify(object);
    return JSON.parse(copy);
}
var socketPathHelper = {};

Object.defineProperty(socketPathHelper, 'buildPath', {
    get: function() {
        return clone(config.globalOptions().get("socketPaths").buildPath);
    }
});

Object.defineProperty(socketPathHelper, 'agentPath', {
    get: function() {
        return clone(config.globalOptions().get("socketPaths").agentPath);
    }
});

Object.defineProperty(socketPathHelper, 'mainPath', {
    get: function() {
        return clone(config.globalOptions().get("socketPaths").mainPath);
    }
});

Object.defineProperty(socketPathHelper, 'settingsPath', {
    get: function() {
        return clone(config.globalOptions().get("socketPaths").settingsPath);
    }
});

module.exports = socketPathHelper;