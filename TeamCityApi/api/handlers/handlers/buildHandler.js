var request = require('request');
var swig = require('swig');
var config = require('../../libs/config');

var getBuildsInfo = function (req, res, next) {
    var options = config.get('teamCityBuilds');

    request.get(options, function (err, response) {
        if (err) throw err;

        res.writeHeader(200, {"Content-Type": "text/plain"});

        var pathDirectory = __dirname + "\\..\\..\\public\\pages\\build-information-panel.html";
        var template = swig.compileFile(pathDirectory);

        var buildsJson = JSON.parse(response.body);
        var renderedHtml = template(buildsJson);
        res.end(renderedHtml);
    });
};

function setupHandlers(app)
{
    app.get('/builds', getBuildsInfo);
}

exports.setupHandlers = setupHandlers;
