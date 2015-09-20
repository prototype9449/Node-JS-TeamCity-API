var config = require('./nconfSetting');
var Promise = require('promise');

var ConfigManager = function () {

    function clone(object) {
        var copy = JSON.stringify(object);
        return JSON.parse(copy);
    }

    function saveConfig(config) {
        (function (config) {
            config.save(function (err) {
                if (err) throw err;
            });
        })(config);
    }

    var getObjectByKey = function (url, userName) {
        var objects = config.otherOptions().get('teamCityObjects');
        for (var i = 0; i < objects.length; i++) {
            if (objects[i].connection.url === url && objects[i].connection.auth.user === userName) {
                return {
                    object: objects[i],
                    index: i
                };
            }
        }
    }.bind(this);

    this.addNewTeamCity = function (options) {
        return new Promise(function (resolve, reject) {
            try {
                var connection = clone(config.general().get('generalOptions').connection);
                connection.url = options.url;
                connection.auth = options.auth;

                var teamCityObjects = config.otherOptions().get('teamCityObjects');
                teamCityObjects.push({connection: connection});
                config.otherOptions();
                saveConfig(config);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };

    this.changeTeamCity = function (options) {
        var self = this;
        return new Promise(function (resolve, reject) {
            try {
                var baseOptions = clone(config.general().get('generalOptions'));
                if (baseOptions.connection.url != options.url
                    || baseOptions.connection.auth.user != options.userName) {
                    reject(new Error('Wrong authentication'));
                }

                baseOptions.agentFixBuilds = options.agentFixBuilds;
                var teamCityObjects = config.otherOptions().get('teamCityObjects');
                var index = getObjectByKey(options.url, options.userName).index;
                teamCityObjects[index] = baseOptions;
                config.otherOptions();
                saveConfig(config);
                self.chooseGeneralTeamCity(options.url, options.userName)
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    };

    this.removeTeamCityByKey = function (url, userName) {
        var objects = config.otherOptions().get('teamCityObjects');
        var index = getObjectByKey(url, userName).index;
        objects.splice(index, 1);
        saveConfig(config);
    };

    this.chooseGeneralTeamCity = function (url, userName) {
        var teamCity = getObjectByKey(url, userName).object;
        if (!teamCity) throw new Error('There is not that id');
        config.set("generalOptions", clone(teamCity));
        saveConfig(config);
    };
};

module.exports = ConfigManager;