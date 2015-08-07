$(function () {

    //var url = 'http://localhost:8080/';
    ////var url = 'http://localhost:80/api/';
    //function getHtmlContent(path, elementId) {
    //    var element = document.getElementById(elementId);
    //    var xhr = new XMLHttpRequest();
    //    xhr.open('GET', path);
    //    xhr.onreadystatechange = function () {
    //        if (xhr.readyState == 3) {
    //            element.innerHTML = xhr.responseText;
    //        }
    //    };
    //    xhr.setRequestHeader('Accept', 'text/html; charset=UTF-8');
    //    xhr.send();
    //}
    //
    //function updateBuildsContent() {
    //    getHtmlContent(url + 'builds', 'builds-panel');
    //}
    //
    //function updateAgentsContent() {
    //    getHtmlContent(url + 'agents', 'agents-panel');
    //}
    //
    //function updateInformation() {
    //    updateBuildsContent();
    //    updateAgentsContent();
    //}
    //
    //var button = $('#button'); // Input message input box
    //button.click(function () {
    //    updateInformation();
    //});

    function addNewElements(data, parentElementId) {
        var parent = $("#" + parentElementId);
        parent.append(data);
    }

    function updateElements(data, parentElementId) {
        var element = $("#" + data.id);
        //$(parentElementId).find('#' + data.id).remove();
        element.remove();
        var parent = $("#" + parentElementId);
        var newElement = $.parseHTML(data.htmlContent);
        parent.append(newElement);
        $(newElement).fadeIn(300, function() {  });
        $(newElement).fadeIn();
    }

    //var socket = io.connect('http://localhost', { 'path': '/api/socket.io'}); //IIS
    var socket = io.connect('http://localhost:8080', { 'path': '/socket.io'}); //WebStorm

     //   var socket = io.connect(url);//WEB Storm

    socket.on('newBuilds', function (data) {
        var newBuilds = JSON.parse(data);
        for(var i = 0; i < newBuilds.length; i++){
            addNewElements(newBuilds[i], 'builds-panel');
        }
    });

    socket.on('buildsUpdate', function (data) {
        var updatingBuilds = JSON.parse(data);
        for(var i = 0; i < updatingBuilds.length; i++){
            updateElements( updatingBuilds[i], 'builds-panel');
        }
    });

    socket.on('newAgents', function (data) {
        var newAgents = JSON.parse(data);
        for(var i = 0; i < newAgents.length; i++){
            addNewElements(newAgents[i].htmlContent, 'agents-panel');
        }
    });

    socket.on('agentsUpdate', function (data) {
        var updatingAgents = JSON.parse(data);
        for(var i = 0; i < updatingAgents.length; i++){
            updateElements(updatingAgents[i].htmlContent, 'agents-panel');
        }
    });
 });