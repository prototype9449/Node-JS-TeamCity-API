/**
 * Created by AlexeyO on 7/22/2015.
 */
var swig = require('swig');
var teamCityHelper = {};

teamCityHelper.generateBuildsPage = function(responce, jsonBuildsInfo)
{
    responce.writeHeader(200, {"Content-Type": "text/html"});

    var pathDirectory = __dirname + "\\..\\public\\pages\\page-template.html";
    var template = swig.compileFile(pathDirectory);

    var capitalize = function(str)
    {
        return str[0].toUpperCase() + str.slice(1);
    };

    var jsonArr = [];
    for (var i = 0; i < jsonBuildsInfo.build.length; i++) {
        jsonArr.push({
            id: jsonBuildsInfo.build[i].id,
            state: capitalize(jsonBuildsInfo.build[i].state),
            status: capitalize(jsonBuildsInfo.build[i].status),
            buildTypeId: capitalize(jsonBuildsInfo.build[i].buildTypeId)
        });
    }

    var finalJson = {
        builds: jsonArr
    };

    var renderedHtml = template(finalJson);
    responce.end(renderedHtml);
};


exports.teamCityHelper = teamCityHelper;
