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

    this.AddNewTeamCity = function (options) {
        var baseOptions = clone(config.general().get('generalOptions'));
        baseOptions.connection.url = options.url;
        baseOptions.connection.auth = options.auth;
        baseOptions.agentFixBuilds = options.agentFixBuilds;

        var teamCityObjects = config.otherOptions().get('teamCityObjects');
        var id;
        if (teamCityObjects.length === 0) {
            id = 0;
        } else {
            id = teamCityObjects[teamCityObjects.length - 1].id + 1;
        }
        baseOptions.id = id;
        teamCityObjects.push(baseOptions);
        config.otherOptions();
        saveConfig(config);
    };

    this.removeTeamCityById = function (id) {
        var objects = config.otherOptions().get('teamCityObjects');
        for (var i = 0; i < objects.length; i++) {
            if (objects[i].id == id) {
                objects.splice(i, 1);
                saveConfig(config);
                return;
            }
        }
    };
};

module.exports = ConfigManager;