var requestp = require('request-promise');
var Promise = require('promise');
var config = require('./../config/generalOptionHelper');
require('date-format-lite');
var globalHelper = require('./../config/globalHelper');

Date.masks.default = globalHelper.dateMask;

var getDateFromString = function (strDate) {
    if (!strDate) return undefined;
    var year = strDate.substring(0, 4);
    var month = strDate.substring(4, 6) - 1;
    var day = strDate.substring(6, 8);
    var hour = strDate.substring(9, 11);
    var minutes = strDate.substring(11, 13);
    var seconds = strDate.substring(13, 15);

    return new Date(year, month, day, hour, minutes, seconds);
};

var getProperDuration = function (buildLaunchDate, buildFinishedDate) {
    if (buildFinishedDate) {
        var duration = Math.abs((buildLaunchDate.getTime() - buildFinishedDate.getTime() ) / 1000);
    }
    if (!duration) return '---';

    var hours = Math.floor(duration / 3600);
    var minutes = (duration / 60) - hours * 60;
    var hoursString = hours == 0 ? '' : hours + 'h :';
    return hoursString + ' ' + Math.floor(minutes) + 'm';
};

var getBuildBranchName = function (vscJson) {
    if (vscJson == undefined) {
        var buildBranchName = 'unknown';
    } else {
        var properties = vscJson.properties.property;
        for (var i = 0; i < properties.length; i++) {
            if (properties[i].name == 'branch') {
                buildBranchName = properties[i].value;
            }
        }
    }
    return buildBranchName;
};

var getProperStatus = function (status, state) {
    status = status.toLocaleLowerCase();
    state = state.toLocaleLowerCase();

    if (state == 'running') {
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

var getValidateBscHref = function (jsonBuild) {
    var vscHref;
    try {
        vscHref = jsonBuild.revisions.revision[0]['vcs-root-instance'].href;
    }
    catch (error) {
        vscHref = undefined;
    }
    return vscHref;
};

var getValidateUserName = function (jsonBuild) {
    var userName;
    try {
        userName = jsonBuild.triggered.user.username;
    } catch (error) {
        userName = '---';
    }
    return userName;
};

var generateBuildJson = function (buildHref) {
    return new Promise(function (resolve, reject) {
        var optionTeamCity = config.getGeneralOptions().connection;
        optionTeamCity.url += buildHref;
        requestp(optionTeamCity).then(function (body) {
            var buildJson = JSON.parse(body);
            resolve(buildJson);
        }, function (err) {
            throw err;
        });
    });
};

var generateBuildBranch = function (data) {
    return new Promise(function (resolve, reject) {
        if (data.vscHref == undefined) {
            data.jsonBuild.build.branchName = '---';
            resolve(data.jsonBuild);
            return;
        }
        var optionTeamCity = config.getGeneralOptions().connection;
        optionTeamCity.url += data.vscHref;
        requestp(optionTeamCity).then(function (body) {
            var vscJson = JSON.parse(body);
            data.jsonBuild.build.branchName = getBuildBranchName(vscJson);
            resolve(data.jsonBuild);
        }, function (err) {
            console.log(optionTeamCity.url);
            resolve('---');
            throw err;
        });
    });
};

var getValidateBuildData = function (jsonBuild) {
    return new Promise(function (resolve, reject) {
        var buildLaunchDate = getDateFromString(jsonBuild.triggered.date);
        var buildFinishedDate = getDateFromString(jsonBuild.finishDate);

        var vscHref = getValidateBscHref(jsonBuild);
        var finalJsonBuild =
        {
            id: jsonBuild.id,
            build: {
                id: jsonBuild.id,
                href: 'buildInfo.html?id=' + jsonBuild.id,
                branchName: '---',
                authorName: getValidateUserName(jsonBuild),
                state: jsonBuild.state,
                status: getProperStatus(jsonBuild.status, jsonBuild.state),
                launchDate: buildLaunchDate.format(),
                duration: getProperDuration(buildLaunchDate, buildFinishedDate),
                configuration: {
                    id: jsonBuild.buildTypeId,
                    name: jsonBuild.buildType.name,
                    projectName: jsonBuild.buildType.projectName
                }
            },
            agent: {
                id: jsonBuild.agent.id,
                name: jsonBuild.agent.name,
                href: 'agentInfo.html?id=' + jsonBuild.agent.id
            }
        };
        resolve({vscHref: vscHref, jsonBuild: finalJsonBuild});
    });
};

var generateFinalBuildJson = function (buildId, buildHref, callback) {
    return new Promise(function (resolve, reject) {
        generateBuildJson(buildHref)
            .then(getValidateBuildData)
            .then(generateBuildBranch)
            .then(resolve);
    });
};

module.exports.generateBuildJson = generateFinalBuildJson;