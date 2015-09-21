var http = require('http');
var CustomApp = require('./libs/helpers/customApp');
var customApp = new CustomApp();
var server = http.createServer(customApp.app);
var globalHelper= require('././libs/config/globalHelper');
customApp.setServer(server);
customApp.init();
var port = process.env.PORT || globalHelper.port;
server.listen(port);
