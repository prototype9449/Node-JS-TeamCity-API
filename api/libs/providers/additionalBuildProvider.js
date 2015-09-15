var request = require('request');
var additionalConnectionOptionHelper = require('./../config/additionalOptionHelper');
var Promise = require('promise');
var Enumerable = require('../linq/linq.min');
require("../linq/extensions/linq.qunit")({'Enumerable': Enumerable});

var getProperStatus = function (status, state) {
    var status = status.toLocaleLowerCase();
    var state = state.toLocaleLowerCase();

    if (state.toLocaleLowerCase() == 'running') {
        return 'running';
    }
    if (status == 'unknown') {
        return 'cancelled';
    } else if (status == 'failure') {
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
            id: buildType.id,
            status: getProperStatus(json.build[0].status, json.build[0].state),
            projectName: buildType.projectName,
            buildTypeName: buildType.buildTypeName
        };

        callback(build);
    });
};

var generateBuilds = function (buildTypes) {
    return new Promise(function (resolve, reject) {

        if (!buildTypes && buildTypes.length == 0)
            throw new Error('buildTypeIds');

        var resultBuilds = [];
        for (var i = 0; i < buildTypes.length; i++) {
            var callbackFunction = function (build) {
                resultBuilds.push(build);
                if (resultBuilds.length == buildTypes.length) {
                    resolve(resultBuilds);
                }
            };
            generateBuildByBuildTypeId(buildTypes[i], callbackFunction);
        }
    });
};

var generateBuildsByBuildTypeNames = function (options) {

    return new Promise(function (resolve, reject) {

        var projectsFromConfig = options.projects;

        if (!projectsFromConfig) return;

        var optionTeamCity = additionalConnectionOptionHelper.getBuildTypesOptions().connection;
        request.get(optionTeamCity, function (err, response) {
            if (err) throw err;
            var json = JSON.parse(response.body);
            var buildTypes = json.buildType;
            var resultObjects = [];

            var groupsByProject = Enumerable.from(buildTypes).groupBy('$.projectName').select(function (item) {

                return {
                    projectName: item.key(),
                    builds: item.getSource()
                };
            }).toArray();


            var projectsFromMemory = {};
            groupsByProject.map(function (item) {
                projectsFromMemory[item.projectName] = item.builds;
            });

            for (var i = 0; i < projectsFromConfig.length; i++) {
                var buildTypesFromMemory = projectsFromMemory[projectsFromConfig[i].projectName];
                if (buildTypesFromMemory) {
                    var projectName = projectsFromConfig[i].projectName;
                    var result = Enumerable.from(buildTypesFromMemory).where(function (item) {
                        return projectsFromConfig[i].buildTypeNames.indexOf(item.name) != -1;
                    }).select(function (item) {
                        return {
                            id: item.id,
                            buildTypeName: item.name,
                            projectName: projectName
                        }
                    }).toArray();
                    resultObjects = resultObjects.concat(result);
                }
            }

            generateBuilds(resultObjects).then(resolve);
        });
    });
};

module.exports = generateBuildsByBuildTypeNames;