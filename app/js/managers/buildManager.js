$(function () {
    $("#progress-bar-animation").remove();

    //var socket = io.connect('http://localhost', { 'path': '/api/socket.io'}); //IIS
    var id = getParameterByName("id");
    var socket = io.connect('http://localhost:8080', {'path': '/build', 'query': 'id=' + id}); //WebStorm

    socket.on('build', function (data) {
        var build = JSON.parse(data);
        addNewElements(build[0], 'build-', 'Build-panel');
    });

    socket.on('buildHistory', function (data) {
        var newBuilds = JSON.parse(data);
        for (var i = 0; i < newBuilds.length; i++) {
            addNewElements(newBuilds[i], 'buildHistory-', 'history-table-panel');
        }
    });
});