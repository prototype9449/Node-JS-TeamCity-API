var config = require('./nconfSetting');

function clone (object) {
    var copy = JSON.stringify(object);
    return JSON.parse(copy);
}
var globalHelper = {};

Object.defineProperty(globalHelper, 'port', {
    get: function() {
        return clone(config.globalOptions().get("application").port);
    }
});

Object.defineProperty(globalHelper, 'timeTickPullingData', {
    get: function() {
        return clone(config.globalOptions().get("application").timeTickPullingData);
    }
});

Object.defineProperty(globalHelper, 'timeTickSendingData', {
    get: function() {
        return clone(config.globalOptions().get("application").timeTickSendingData);
    }
});

Object.defineProperty(globalHelper, 'dateMask', {
    get: function() {
        return clone(config.globalOptions().get("application").dateMask);
    }
});

module.exports = globalHelper;