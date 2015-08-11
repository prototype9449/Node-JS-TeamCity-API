$(function () {

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function updateElements(data, parentElementId) {
        var parent = $("#" + parentElementId);
        parent.html(data);
    }

    //var socket = io.connect('http://localhost', { 'path': '/api/socket.io'}); //IIS
    var socket = io.connect('http://localhost:8080', { 'path': '/agent'}); //WebStorm

    socket.on('connection start', function(){
        var id = getParameterByName("id");
        socket.emit('agent', id);
    });

    socket.on('agent', function (data) {
        var agent = JSON.parse(data);
        updateElements(agent[0].htmlContent, 'Agent-panel');
    });
});