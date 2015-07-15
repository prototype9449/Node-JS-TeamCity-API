var http = require('http');
var url = require('url');
var paths = require('../pages/pathsToPages.json');
var fileModule = require('./responseWritter');

var readFile = fileModule.readFile;

http.createServer(function(req, res) {

    var path = url.parse(req.url, true);
    var pathname = path.pathname;
    var parameters = path.query;
    var pathToPage = paths[pathname];

    debugger;

    if (!pathToPage) {
        res.statusCode = 404;
        res.end("Not Found");
        return;
    }
    var file = readFile(pathToPage, res);

}).listen(3000);

