var http = require('http');
var CustomApp = require('./libs/helpers/CustomApp');
var customApp = new CustomApp();
var server = http.createServer(customApp.app);
var globalHelper= require('././libs/config/globalHelper');
customApp.setServer(server);
customApp.start();
var port = process.env.PORT || globalHelper.port;
server.listen(port);