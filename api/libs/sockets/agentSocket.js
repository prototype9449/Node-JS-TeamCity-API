var config = require('./../helpers/connectionOptionsHelper');
var htmlGenerator = require('./../htmlGenerator');
var baseSocket = require('./baseSocket');

var e = 1;
function AgentSocket(server, storage, time, objectType) {
    this.storage = storage;

    var generalSocket = new baseSocket(server, time, objectType);

    this.__proto__ = generalSocket;

    this.sendInfo = function (client) {
        var optionTeamCity = config.getAgentByIdOptions(client.objectId);

        var agent = this.storage.getAgentById(client.objectId);
        htmlGenerator.generateHtmlFromJson({agents: [agent]}, optionTeamCity.options.pageFullHtmlTemplatePath, function (html) {
            client.socket.emit('agent', html);
        });

    };
}

module.exports = AgentSocket;