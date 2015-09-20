var sendLaunchBuild = function (agent) {
    return function (result) {
        $.ajax({
            type: "POST",
            url: 'http://localhost:8080/launchBuild',
            data: result,
            dataType: 'text'
        }).done(function (data) {
            if (data === 'success') {
                agent.set({state: 'success'});
            } else {
                agent.set({state: 'failure'});
            }
            setTimeout(function () {
                agent.set({state: 'default'})
            }, 12000);
        }).fail(function (data) {
            agent.set({state: 'error'});
            setTimeout(function () {
                agent.set({state: 'default'})
            }, 12000);
        });
    }
};

var sendUrlChanging = function (result) {
    $.ajax({
        type: "POST",
        url: 'http://localhost:8080/changeUrl',
        data: result,
        dataType: 'application/json'
    });
    location.reload();
};

var sendConfigurationChanging = function(result){
    $.ajax({
        type: "POST",
        url: 'http://localhost:8080/changeConfiguration',
        data: result,
        dataType: 'application/json'
    });
};

var sendNewAuthentication = function(result){
    $.ajax({
        type: "POST",
        url: 'http://localhost:8080/newAuthentication',
        data: result,
        dataType: 'application/json'
    });
};

socketManager = {
    setMainSocket: function (model) {

        var socket = io.connect('http://localhost:8080', {'path': '/main', 'force new connection': true});

        socket.on('generalBuilds', function (generalBuilds) {
            for (var i = 0; i < generalBuilds.length; i++) {
                var id = generalBuilds[i].id;
                var object = generalBuilds[i].model;
                model.generalBuildList.add({id: id, object: object});
            }
        });

        socket.on('additionalBuilds', function (additionalBuilds) {
            for (var i = 0; i < additionalBuilds.length; i++) {
                var id = additionalBuilds[i].id;
                var object = additionalBuilds[i].model;
                model.additionalBuildList.add({id: id, object: object});
            }
        });

        socket.on('agents', function (newAgents) {
            for (var i = 0; i < newAgents.length; i++) {
                var id = newAgents[i].id;
                var object = newAgents[i].model;
                model.agentList.add({id: id, object: object});
                var agent = model.agentList.find(function (item) {
                    return item.id == id;
                });

                agent.set({sendLaunchBuild: sendLaunchBuild(agent)});
            }
        });

        return socket;
    },

    setSettingsSocket: function (model) {

        var socket = io.connect('http://localhost:8080', {'path': '/settings', 'force new connection': true});

        socket.on('urls', function (urls) {
            var object = {
                urlsSetting: urls
            };
            model.urlSettings.set({object: object});
            model.settings.set({object: object});

        });
        socket.on('settings', function (settings) {
            var object = {
                settings: settings
            };

            model.settings.set({object: object});

        });

        model.urlSettings.set({sendUrlChanging: sendUrlChanging}, {silent: true});
        model.settings.set({sendSettingSubmit: sendConfigurationChanging}, {silent: true});
        model.connectionSetting.set({sendConnectionSubmit: sendNewAuthentication }, {silent: true});

        return socket;
    },

    setBuildSocket: function (model, id) {

        var socket = io.connect('http://localhost:8080', {
            'path': '/build',
            'query': 'id=' + id,
            'force new connection': true
        });

        socket.on('build', function (build) {
            var object = build[0].model;
            model.build.set({object: object});
        });

        socket.on('buildHistory', function (newBuilds) {
            for (var i = 0; i < newBuilds.length; i++) {
                var id = newBuilds[i].id;
                var object = newBuilds[i].model;
                model.buildList.add({id: id, object: object});
            }
        });

        return socket;
    },

    setAgentSocket: function (model, id) {

        var socket = io.connect('http://localhost:8080', {
            'path': '/agent',
            'query': 'id=' + id,
            'force new connection': true
        });

        socket.on('agent', function (agent) {
            var object = agent[0].model;
            model.agent.set({object: object, sendLaunchBuild: sendLaunchBuild(model.agent)});
        });

        socket.on('agentHistory', function (newBuilds) {
            for (var i = 0; i < newBuilds.length; i++) {
                var id = newBuilds[i].id;
                var object = newBuilds[i].model;
                model.buildList.add({id: id, object: object});
            }
        });

        return socket;
    }
};
