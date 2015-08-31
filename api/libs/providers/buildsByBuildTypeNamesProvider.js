var request = require('request');
var config = require('./../helpers/additionalConnectionOptionHelper');

var generateBuildByBuildTypeId = function (buildTypeId, callback) {
    var optionTeamCity = config.getOneBuildByBuildTypeIdOptions(buildTypeId).connection;
    request.get(optionTeamCity, function (err, response) {
        if (err) throw err;
        var json = JSON.parse(response.body);
        var build = json.build[0];
        callback(build);
    });
};

var generateBuilds = function (buildTypeIds, callback) {
    if(!buildTypeIds && buildTypeIds.length ==0)
        throw new Error('buildTypeIds');

    var resultBuilds = [];
    for (var i = 0; i < buildTypeIds.length; i++) {
        var callbackFunction = function (build) {
            resultBuilds.push(build);
            if (resultBuilds.length == buildTypeIds.length) {
                callback(resultBuilds);
            }
        };
        generateBuildByBuildTypeId(buildTypeIds[i], callbackFunction);
    }
};

var generateBuildsByBuildTypeNames = function (options, callback) {
    var optionTeamCity = config.getBuildTypesOptions().connection;
    request.get(optionTeamCity, function (err, response) {
        if (err) throw err;
        var json = JSON.parse(response.body);
        var buildTypes = json.buildType;
        var result = [];
        for (var i = 0; i < buildTypes.length; i++) {
            if (options.buildTypeNames.indexOf(buildTypes[i].name) != -1 && options.projectName== buildTypes[i].projectName)
                result.push(buildTypes[i].id);
        }
        generateBuilds(result, callback);
    });
};

module.exports = generateBuildsByBuildTypeNames;