var request = require('request');
var config = require('./../helpers/connectionOptionsHelper');

var getBuildTypeJson = function (buildTypeId, buildTypeHref, callback) {
    var optionTeamCity = config.getGeneralOptions().connection;
    optionTeamCity.url += buildTypeHref;
    request.get(optionTeamCity, function (err, response) {
        if (err) throw err;
        var buildTypeJson = JSON.parse(response.body);
        callback(buildTypeJson);
    });
};

var getVSCInstance = function (vscHref, callback) {

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
}

var getFinalBuildJson = function (buildTypeId, buildTypeHref, callback) {
    getBuildTypeJson(buildTypeId, buildTypeHref, function(jsonBuild){
        var buildTypeName = jsonBuild.name;
        var buildTypeProjectName = jsonBuild.projectName;
        var vscHref
        try {
            vscHref = jsonBuild['vcs-root-entries']['vcs-root-entry'][0]['vcs-root'].href;
        }
        catch(error) {
            vscHref = undefined;
        }
        getVSCInstance(vscHref, function (vscJson) {
            var branchName
            if(vscJson == undefined){
                branchName = 'unknown';
            }else {
                branchName = vscJson.properties.property[3].value;
            }
            var finalJsonBuild =
            {
                id : buildTypeId,
                name : buildTypeName,
                projectName : buildTypeProjectName,
                branchName : branchName
            };

            callback(finalJsonBuild);
        })
    })
}

module.exports.getBuild = getFinalBuildJson;