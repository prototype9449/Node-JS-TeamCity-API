var request = require('request');
var config = require('./../../helpers/connectionOptionsHelper');
var generateBuildJson = require('./jsonBuildProvider').generateBuildJson;

var generateJsonBuildType = function(buildTypeHref, callback){
    var optionTeamCity = config.getGeneralOptions().connection;
    optionTeamCity.url += buildTypeHref;

    request.get(optionTeamCity, function (err, response) {
        if (err) throw err;
        var buildTypeJson = JSON.parse(response.body);
        callback(buildTypeJson);
    });
};

var generateBuilds = function(buildTypeJson, callback){
    var buildsHref = buildTypeJson.builds.href;
    var optionTeamCity = config.getGeneralOptions().connection;
    optionTeamCity.url += buildsHref;

    request.get(optionTeamCity, function (err, response) {
        if (err) throw err;
        var buildsJson = JSON.parse(response.body);
        callback(buildsJson);
    });
};

var generateFinalJsonBuilds = function(buildTypeHref, callback) {
   generateJsonBuildType(buildTypeHref, function(buildTypeJson){
       generateBuilds(buildTypeJson, function(buildsJson) {
           var buildsJson = buildsJson.build;
           var finalBuilds = [];
           for(var i = 0; i < buildsJson.length; i++){
               var currentBuild = buildsJson[0];
               generateBuildJson(currentBuild.id, currentBuild.href, function(build){
                   finalBuilds.push(build);
                   if(finalBuilds.length == buildsJson.length){
                       callback(finalBuilds);
                   }
               });
           }
       })
   })
};

module.exports.generateBuilds = generateFinalJsonBuilds;