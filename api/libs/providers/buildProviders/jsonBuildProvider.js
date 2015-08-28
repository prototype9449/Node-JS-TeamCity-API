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
    if(!strDate) return undefined;
    var year = strDate.substring(0, 4);
    var month = strDate.substring(4, 6) - 1;
    var day = strDate.substring(6, 8);
    var hour = strDate.substring(9, 11);
    var minutes = strDate.substring(11, 13);
    var seconds = strDate.substring(13, 15);

    return new Date(year, month, day, hour, minutes, seconds);
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

var generateFinalBuildJson = function (buildId, buildHref, callback) {
    generateBuildJson(buildHref, function (jsonBuild) {
        var buildLaunchDate = getDateFromString(jsonBuild.triggered.date);
        var buildFinishedDate = getDateFromString(jsonBuild.finishDate);
        if(buildFinishedDate){
            var duration =  Math.abs((buildLaunchDate.getTime() - buildFinishedDate.getTime() )/ 1000) + ' sec';
        }

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
                id: buildId,
                build: {
                    id: buildId,
                    href: 'buildInfo.html?id=' + buildId,
                    branchName: buildBranchName,
                    status: getProperStatus(jsonBuild.status,jsonBuild.state),
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

var launchBuildConfiguration = function(buildTypeId, agentId){
    var optionTeamCity = config.getLaunchBuildsOptions(buildTypeId,agentId).connection;

    request.post(optionTeamCity, function(error, response, body){
        console.log('launch build ' +  buildTypeId);
    });
}

module.exports.generateBuildJson = generateFinalBuildJson;
module.exports.launchBuildConfiguration = launchBuildConfiguration;