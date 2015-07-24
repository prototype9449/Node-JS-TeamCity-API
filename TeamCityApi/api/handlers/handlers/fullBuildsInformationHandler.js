/**
 * Created by NikitaK on 7/24/2015.
 */
var request = require('request');
var swig = require('swig');
var config = require('../../libs/config');

var getBuildsFullInformation = function (req, res, next) {
    var options = config.get('teamCityBuilds');

    request.get(options, function (err, response) {
        if (err) throw err;

        res.writeHeader(200, {"Content-Type": "text/html"});

        var pathDirectory = __dirname + "\\..\\..\\public\\pages\\index.html";
        var template = swig.compileFile(pathDirectory);
        res.end(template());
    });
};

function setupHandlers(app)
{
    app.get('/full-builds-information', getBuildsFullInformation);
}

exports.setupHandlers = setupHandlers;