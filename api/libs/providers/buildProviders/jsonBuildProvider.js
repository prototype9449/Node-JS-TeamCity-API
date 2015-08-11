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

    if(vscHref == undefined) {
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
    generateBuildJson(buildHref, function(jsonBuild){
        var buildStatus = jsonBuild.statusText;
        var buildConfiguration =
        {
            buildConfigurationId: jsonBuild.buildTypeId,
            buildConfigurationName: jsonBuild.buildType.name,
            buildProjectName : jsonBuild.buildType.projectName
        };
        var buildAgentName = jsonBuild.agent.name;
        var hrefAgent = jsonBuild.agent.href;
        var agentId = jsonBuild.agent.id;
        var buildLaunchDate = jsonBuild.triggered.date;
        var buildFinishedDate = jsonBuild.finishDate;
        //var duration = the difference between launch and finish. Need parsing date

        var vscHref;
        try {
            vscHref = jsonBuild.revisions.revision[0]['vcs-root-instance'].href;
        }
        catch(error) {
            vscHref = undefined;
        }
        generateVSCInstance(vscHref, function (vscJson) {
            var buildBranchName = getBuildBranchName(vscJson);
            var finalJsonBuild =
            {
                id : buildId,
                href: 'buildInfo.html?id=' + buildId,
                branchName : buildBranchName,
                agent : {
                    id : agentId,
                    name :buildAgentName,
                    href :'agentInfo.html?id=' + agentId
                },
                status : buildStatus,
                configuration : buildConfiguration,
                launchDate : buildLaunchDate
            };

            callback(finalJsonBuild);
        })
    })
};

module.exports.generateBuildJson = generateFinalBuildJson;