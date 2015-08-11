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

function getBuildBranchName(vscJson) {
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
        var buildLaunchDate = jsonBuild.triggered.date;
        var buildFinishedDate = jsonBuild.finishDate;
        //var duration = the difference between launch and finish. Need parsing date

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
                    launchDate: jsonBuild.triggered.date,
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