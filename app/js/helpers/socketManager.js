socketManager = {
    setMainSocket: function (model) {

        var socket = io.connect('http://localhost:8080', {'path': '/main', 'force new connection': true});

        socket.on('newBuilds', function (data) {
            var newBuilds = JSON.parse(data);
            for (var i = 0; i < newBuilds.length; i++) {
                var id = newBuilds[i].id;
                var html = newBuilds[i].htmlContent;
                model.buildList.add({id: id, body: html});
            }
        });

        socket.on('newAgents', function (data) {
            var newAgents = JSON.parse(data);
            for (var i = 0; i < newAgents.length; i++) {
                var id = newAgents[i].id;
                var html = newAgents[i].htmlContent;
                model.agentList.add({id: 2, body: html});

                (function (id) {
                    $('#launchBuildButton-' + id).click(function () {
                        socket.emit('launchBuild', id);
                    });
                }(id));
            }
        });

        return socket;
    },

    setBuildSocket: function (model, id) {
        $("#progress-bar-animation").remove();

        var socket = io.connect('http://localhost:8080', {
            'path': '/build',
            'query': 'id=' + id,
            'force new connection': true
        });

        socket.on('build', function (data) {
            var build = JSON.parse(data);
            var html = build[0].htmlContent;
            model.build.set({body: html});
        });

        socket.on('buildHistory', function (data) {
            var newBuilds = JSON.parse(data);
            for (var i = 0; i < newBuilds.length; i++) {
                var id = newBuilds[i].id;
                var html = newBuilds[i].htmlContent;
                model.buildList.add({id: id, body: html});
            }
        });

        return socket;
    },
    setAgentSocket: function (model, id) {
        $("#progress-bar-animation").remove();

        var socket = io.connect('http://localhost:8080', {
            'path': '/agent',
            'query': 'id=' + id,
            'force new connection': true
        });

        socket.on('agent', function (data) {
            var agent = JSON.parse(data);
            var id = agent[0].id;
            var html = agent[0].htmlContent;
            model.agent.set({id: id, body: html});
        });

        socket.on('agentHistory', function (data) {
            var newBuilds = JSON.parse(data);
            for (var i = 0; i < newBuilds.length; i++) {
                var id = newBuilds[i].id;
                var html = newBuilds[i].htmlContent;
                model.buildList.add({id: id, body: html});
            }
        });

        return socket;
    }
};
