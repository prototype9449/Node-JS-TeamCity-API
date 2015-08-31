var request = require('request');
var additionalConnectionOptionHelper = require('./../helpers/additionalConnectionOptionHelper');

var getProperStatus = function(status,state){
    var status = status.toLocaleLowerCase();
    var state = state.toLocaleLowerCase();

    if(state.toLocaleLowerCase() =='running'){
        return 'running';
    }
    if(status == 'unknown'){
        return 'cancelled';
    } else if(status == 'failure') {
        return 'failure';
    } else {
        return 'success';
    }
};


var generateBuildByBuildTypeId = function (buildType, callback) {
    var optionTeamCity = additionalConnectionOptionHelper.getOneBuildByBuildTypeIdOptions(buildType.id).connection;
    request.get(optionTeamCity, function (err, response) {
        if (err) throw err;
        var json = JSON.parse(response.body);
        var build =
        {
            id : buildType.id,
            status : getProperStatus(json.build[0].status, json.build[0].state),
            projectName : buildType.projectName,
            buildTypeName : buildType.buildTypeName
        };

        callback(build);
    });
};

var generateBuilds = function (buildTypes, callback) {
    if(!buildTypes && buildTypes.length ==0)
        throw new Error('buildTypeIds');

    var resultBuilds = [];
    for (var i = 0; i < buildTypes.length; i++) {
        var callbackFunction = function (build) {
            resultBuilds.push(build);
            if (resultBuilds.length == buildTypes.length) {
                callback(resultBuilds);
            }
        };
        generateBuildByBuildTypeId(buildTypes[i], callbackFunction);
    }
};

var generateBuildsByBuildTypeNames = function (options, callback) {

    var option = options.projects[0];

    var optionTeamCity = additionalConnectionOptionHelper.getBuildTypesOptions().connection;
    request.get(optionTeamCity, function (err, response) {
        if (err) throw err;
        var json = JSON.parse(response.body);
        var buildTypes = json.buildType;
        var result = [];
        for (var i = 0; i < buildTypes.length; i++) {
            if (option.buildTypeNames.indexOf(buildTypes[i].name) != -1 && option.projectName== buildTypes[i].projectName){
                var buildType = {
                    id : buildTypes[i].id,
                    buildTypeName : buildTypes[i].name,
                    projectName : buildTypes[i].projectName
                };

                result.push(buildType);
            }

        }
        generateBuilds(result, callback);
    });
};

module.exports = generateBuildsByBuildTypeNames;