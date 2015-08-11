var request = require('request');
var generateObjects = require('./../objectProvider').generateObjects;
var optionHelper = require('./../../helpers/connectionOptionsHelper');

var generateBuildsByAgent = function(agentId, callback){
        var connection = optionHelper.getBuildOptions().connection;
        generateObjects(false, connection, function(result) {
            var builds = result.builds;
            var buildsOfAgent = [];
            builds.map(function(build) {
                if(build.agent.id == agentId) { buildsOfAgent.push(build); }
                });

            callback( { builds: buildsOfAgent });

        });
    };

module.exports.generateBuildsByAgent = generateBuildsByAgent;
