var http = require('http');
var getJson = require('./getJson');

http.createServer(function(request, response) {
    getJson(response);
}).listen(3000);


