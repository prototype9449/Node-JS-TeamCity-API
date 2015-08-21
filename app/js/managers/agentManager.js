$(function () {
    $("#progress-bar-animation").remove();

    //var socket = io.connect('http://localhost', { 'path': '/api/socket.io'}); //IIS
    var id = getParameterByName("id");
    var socket = io.connect('http://localhost:8080', {'path': '/agent', 'query': 'id=' + id}); //WebStorm

    socket.on('agent', function (data) {
        var agent = JSON.parse(data);
        addNewElements(agent[0], "agent-", 'Agent-panel');
    });

    socket.on('agentHistory', function (data) {
        var newBuilds = JSON.parse(data);
        for (var i = 0; i < newBuilds.length; i++) {
            addNewElements(newBuilds[i], "agentHistory-", 'history-table-panel');
        }
    });
});