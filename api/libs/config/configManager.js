var config = require('./nconfSetting');

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
        var baseOptions = clone(config.general().get('generalOptions'));
        baseOptions.connection.url = options.url;
        baseOptions.connection.auth = options.auth;

        var teamCityObjects = config.otherOptions().get('teamCityObjects');
        teamCityObjects.push(baseOptions);
        config.otherOptions();
        saveConfig(config);
    };

    this.changeTeamCity = function (options) {
        var baseOptions = clone(config.general().get('generalOptions'));
        if (baseOptions.connection.url != options.url
            || baseOptions.connection.auth.user != options.userName) {
            throw new Error('Wrong authentication');
        }

        baseOptions.agentFixBuilds = options.agentFixBuilds;
        var teamCityObjects = config.otherOptions().get('teamCityObjects');
        var index = getObjectByKey(options.url, options.userName).index;
        teamCityObjects[index] = baseOptions;
        config.otherOptions();
        saveConfig(config);
        this.chooseGeneralTeamCity(options.url, options.userName)
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