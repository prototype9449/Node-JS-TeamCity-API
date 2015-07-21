var request = require('request');
var http = require('http');
var swig = require('swig');
var config = require('../../libs/config');

var getResultJson = function (req, res, next) {

    var options = config.get('teamCityBuilds');

    request.get(options, function (err, response) {
        if (err) throw err;

        res.writeHeader(200, {"Content-Type": "text/html"});

        var pathDirectory = __dirname + "\\..\\..\\public\\pages\\page-template.html";
        var template = swig.compileFile(pathDirectory);

        var json = JSON.parse(response.body);

        var capitalize = function(str)
        {
            return str[0].toUpperCase() + str.slice(1);
        };

        var jsonArr = [];
        for (var i = 0; i < json.build.length; i++) {
            jsonArr.push({
                id: json.build[i].id,
                state: capitalize(json.build[i].state),
                status: capitalize(json.build[i].status),
                buildTypeId: capitalize(json.build[i].buildTypeId)
            });
        }

        var finalJson = {
            builds: jsonArr
        };

        var renderedHtml = template(finalJson);
        res.end(renderedHtml);
    });
};

module.exports.getResultJson = getResultJson;
