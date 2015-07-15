var http = require('http');
var url = require('url');
var paths = require('../pages/pathsToPages.json');
var fileModule = require('./responseWritter');

var writeFileToResponse = fileModule.readFile;

http.createServer(function(request, response) {

    var path = url.parse(request.url, true);
    var pathname = path.pathname;
    var parameters = path.query;
    var pathToPage = paths[pathname];

    debugger;

    if (!pathToPage) {
        response.statusCode = 404;
        response.end("Not Found");
        return;
    }
    writeFileToResponse(pathToPage, response);

}).listen(3000);

