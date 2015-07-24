/**
 * Created by NikitaK on 7/24/2015.
 */
var request = require('request');
var swig = require('swig');
var config = require('../../libs/config');

var getAgentsInfo = function (req, res, next) {
    var options = config.get('teamCityAgents');

    request.get(options, function (err, response) {
        if (err) throw err;

        res.writeHeader(200, {"Content-Type": "text/plain"});

        var pathDirectory = __dirname + "\\..\\..\\public\\pages\\agent-information-panel.html";
        var template = swig.compileFile(pathDirectory);

        var agentsJson = JSON.parse(response.body);
        var renderedHtml = template(agentsJson);
        res.end(renderedHtml);
    });
};

function setupHandlers(app)
{
    app.get('/agents', getAgentsInfo);
}

exports.setupHandlers = setupHandlers;