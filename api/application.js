var methodOverride = require('method-override');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();
var server = require('http').createServer(app);

var AgentStorage = require('./libs/storage/agentStorage').AgentStorage;
var BuildStorage = require('./libs/storage/buildStorage').BuildStorage;

var buildsStorage = new BuildStorage();
var agentStorage = new AgentStorage(buildsStorage);

var storages = {
    buildStorage: buildsStorage,
    agentStorage: agentStorage
};

var DataProvider = new require('./libs/storage/dataProvider');
var dataProvider = new DataProvider(storages, 4000);
dataProvider.start();

require('./libs/sockets/socketRunner').RunSocket(server, storages);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

var port = process.env.PORT || 8080;
server.listen(port);