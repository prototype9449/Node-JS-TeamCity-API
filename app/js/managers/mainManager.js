$(function () {

    //var socket = io.connect('http://localhost', { 'path': '/api/socket.io'}); //IIS
    var socket = io.connect('http://localhost:8080', {'path': '/main'}); //WebStorm

    socket.on('newBuilds', function (data) {
        var newBuilds = JSON.parse(data);
        for (var i = 0; i < newBuilds.length; i++) {
            addNewElements(newBuilds[i], 'build-', 'builds-panel');
        }
    });

    socket.on('newAgents', function (data) {
        var newAgents = JSON.parse(data);
        for (var i = 0; i < newAgents.length; i++) {
            addNewElements(newAgents[i], 'agent-', 'agents-panel');
        }
        $('#launchBuildButton').click(function(){
            socket.emit('launchBuild');
        });
    });

});