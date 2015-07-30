$(function () {
   // var url = 'http://localhost:8080/';
    var url = 'http://localhost:80/api/';
    function getHtmlContent(path, elementId) {
        var element = document.getElementById(elementId);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', path);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 3) {
                element.innerHTML = xhr.responseText;
            }
        };
        xhr.setRequestHeader('Accept', 'text/html; charset=UTF-8');
        xhr.send();
    }

    function updateBuildsContent() {
        getHtmlContent(url + 'builds', 'builds-panel');
    }

    function updateAgentsContent() {
        getHtmlContent(url + 'agents', 'agents-panel');
    }

    function updateInformation() {
        updateBuildsContent();
        updateAgentsContent();
    }

    var button = $('#button'); // Input message input box
    button.click(function () {
        updateInformation();
    });

    function addNewElements(data, parentElementId) {
        var parent = $("#" + parentElementId);
        parent.append(data);
    }

    function updateElements(data, parentElementId) {
        var parent = $("#" + parentElementId);
        parent.append(data);
    }

    var socket = io.connect(url);

    socket.on('newBuilds', function (data) {
        addNewElements(data, 'builds-panel');
    });

    socket.on('buildsUpdate', function (data) {
        updateElements(data, 'builds-panel');
    });

    socket.on('newAgents', function (data) {
        addNewElements(data, 'agents-panel');
    });

    socket.on('agentsUpdate', function (data) {
        updateElements(data, 'agents-panel');
    });
 });