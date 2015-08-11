var request = require('request');
var config = require('./../../helpers/connectionOptionsHelper');
var generateObjects = require('./../objectProvider').generateObjects;
var optionHelper = require('./../../helpers/connectionOptionsHelper');

var getBuildsByAgent = function(agentId, callback){
        var connection = optionHelper.getBuildOptions().connection;
        generateObjects(false, connection, function(result) {
            var builds = result.builds;
            var buildsOfAgent = [];

            for(var i = 0; i < builds.length; i++){
                if(builds[i].agent.id == agentId)
                {
                    buildsOfAgent.push(builds[i]);
                    if(i==builds.length-1) {
                        callback( { builds: buildsOfAgent });
                    }
                }
            }

        });
    };

module.exports.getBuildsByAgent = getBuildsByAgent;
