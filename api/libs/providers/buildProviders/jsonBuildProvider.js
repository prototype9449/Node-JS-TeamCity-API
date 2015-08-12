var request = require('request');
var config = require('./../../helpers/connectionOptionsHelper');

var generateBuildJson = function (buildHref, callback) {
    var optionTeamCity = config.getGeneralOptions().connection;
    optionTeamCity.url += buildHref;
    request.get(optionTeamCity, function (err, response) {
        if (err) throw err;
        var buildJson = JSON.parse(response.body);
        callback(buildJson);
    });
};

var generateVSCInstance = function (vscHref, callback) {

    if (vscHref == undefined) {
        callback(undefined);
        return;
    }

    var optionTeamCity = config.getGeneralOptions().connection;
    optionTeamCity.url += vscHref;
    request.get(optionTeamCity, function (err, response) {
        if (err) throw err;
        var vscJson = JSON.parse(response.body);
        callback(vscJson);
    });
};

var getDateFromString = function (strDate) {
    var year = strDate.substring(0, 4);
    var month = strDate.substring(4, 6) - 1;
    var day = strDate.substring(6, 8);
    var hour = strDate.substring(9, 11);
    var minutes = strDate.substring(11, 13);
    var seconds = strDate.substring(13, 15);

    return new Date(year, month, day, hour, minutes, seconds);
};

var getDuration = function (start, end) {
    var timeDiff = Math.abs(start.getTime() - end.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    alert(diffDays);
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

var generateFinalBuildJson = function (buildId, buildHref, callback) {
    generateBuildJson(buildHref, function (jsonBuild) {
        var buildLaunchDate = getDateFromString(jsonBuild.triggered.date);
        var buildFinishedDate = getDateFromString(jsonBuild.finishDate);
        var duration =  Math.abs((buildLaunchDate.getTime() - buildFinishedDate.getTime() )/ 1000) + ' sec';

        var vscHref;
        try {
            vscHref = jsonBuild.revisions.revision[0]['vcs-root-instance'].href;
        }
        catch (error) {
            vscHref = undefined;
        }
        generateVSCInstance(vscHref, function (vscJson) {
            var buildBranchName = getBuildBranchName(vscJson);
            var finalJsonBuild =
            {
                build: {
                    id: buildId,
                    href: 'buildInfo.html?id=' + buildId,
                    branchName: buildBranchName,
                    status: jsonBuild.statusText,
                    launchDate: buildLaunchDate.toLocaleString(),
                    duration : duration,
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

            callback(finalJsonBuild);
        })
    })
};

module.exports.generateBuildJson = generateFinalBuildJson;