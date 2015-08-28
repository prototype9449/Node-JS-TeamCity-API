socketManager = {
    setMainSocket: function (model) {

        var socket = io.connect('http://localhost:8080', {'path': '/main', 'force new connection': true});

        socket.on('newBuilds', function (data) {
            var newBuilds = data;
            for (var i = 0; i < newBuilds.length; i++) {
                var id = newBuilds[i].id;
                var object = newBuilds[i].model;
                model.buildList.add({id: id, object : object});
            }
        });

        socket.on('newAgents', function (data) {
            var newAgents = data;
            for (var i = 0; i < newAgents.length; i++) {
                var id = newAgents[i].id;
                var object = newAgents[i].model;
                model.agentList.add({id: id, object: object});

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
            var build = data;
            var object = build[0].model;
            model.build.set({object: object});
        });

        socket.on('buildHistory', function (data) {
            var newBuilds = data;
            for (var i = 0; i < newBuilds.length; i++) {
                var id = newBuilds[i].id;
                var object = newBuilds[i].model;
                model.buildList.add({id: id, object: object});
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
            var agent = data;
            var id = agent[0].id;
            var object = agent[0].model;
            model.agent.set({id: id, object: object});
        });

        socket.on('agentHistory', function (data) {
            var newBuilds = data;
            for (var i = 0; i < newBuilds.length; i++) {
                var id = newBuilds[i].id;
                var object = newBuilds[i].model;
                model.buildList.add({id: id, object: object});
            }
        });

        return socket;
    }
};
