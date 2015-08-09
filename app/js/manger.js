$(function () {
    tpl.loadTemplates(['shortAgentInfo', 'fullAgentInfo', 'shortBuildInfo', 'fullBuildsInfo', 'mainPage'], function () {
        app = new TeamcityController();
        Backbone.history.start();

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
            $(newElement).fadeIn(300, function () {
            });
            $(newElement).fadeIn();
        }

        //var socket = io.connect('http://localhost', { 'path': '/api/socket.io'}); //IIS
        var socket = io.connect('http://localhost:8080', {'path': '/socket.io'}); //WebStorm

        //   var socket = io.connect(url);//WEB Storm
        socket.on('newBuilds', function (data) {
            var newBuilds = JSON.parse(data);
            for (var i = 0; i < newBuilds.length; i++) {
                app.BuildList.add({id: i, body: newBuilds[i].htmlContent});
                // addNewElements(newBuilds[i].htmlContent, 'builds-panel');
            }
        });

        socket.on('buildsUpdate', function (data) {
            var updatingBuilds = JSON.parse(data);
            for (var i = 0; i < updatingBuilds.length; i++) {
                updateElements(updatingBuilds[i], 'builds-panel');
            }
        });

        socket.on('newAgents', function (data) {
            var newAgents = JSON.parse(data);
            for (var i = 0; i < newAgents.length; i++) {
                // addNewElements(newAgents[i].htmlContent, 'agents-panel');
                app.AgentList.add({id: i, body: newAgents[i].htmlContent});
            }
        });

        socket.on('agentsUpdate', function (data) {
            var updatingAgents = JSON.parse(data);
            for (var i = 0; i < updatingAgents.length; i++) {
                updateElements(updatingAgents[i].htmlContent, 'agents-panel');
            }
        });
    });
});