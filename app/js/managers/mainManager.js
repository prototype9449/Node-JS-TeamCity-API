$(function () {

    function addNewElements(data, parentElementId) {
        if($('#' + data.id).length == 0){
            var parent = $("#" + parentElementId);
            parent.prepend(data.htmlContent);
            $('#' + data.id).fadeIn(500);
        } else {
            $('#' + data.id).fadeOut(500);
            $('#' + data.id).replaceWith(data.htmlContent);
            $('#' + data.id).fadeIn(500);

        }
    }

    //var socket = io.connect('http://localhost', { 'path': '/api/socket.io'}); //IIS
    var socket = io.connect('http://localhost:8080', { 'path': '/main'}); //WebStorm

    socket.on('newBuilds', function (data) {
        var newBuilds = JSON.parse(data);
        for(var i = 0; i < newBuilds.length; i++){
            addNewElements(newBuilds[i], 'builds-panel');
        }
    });

    socket.on('newAgents', function (data) {
        var newAgents = JSON.parse(data);
        for(var i = 0; i < newAgents.length; i++){
            addNewElements(newAgents[i], 'agents-panel');
        }
    });

 });