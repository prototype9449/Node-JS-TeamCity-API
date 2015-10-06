var sendPostRequest = function (model, url, isReload) {
    return function (result) {
        $.ajax({
            type: "POST",
            url: url,
            data: result,
            dataType: 'text'
        }).done(function (data) {
            if (data === 'success') {
                model.set({state: 'success'});
            } else {
                model.set({state: 'failure'});
            }
            setTimeout(function () {
                model.set({state: 'default'})
            }, 7000);
        }).fail(function (data) {
            model.set({state: 'error'});
            setTimeout(function () {
                model.set({state: 'default'})
            }, 7000);
        });
        if (isReload)
            location.reload();

    }
};

window.socketManager = {
    setMainSocket: function (model) {

        var socket = io.connect(socketSettings.url, {'path': socketSettings.basePath + 'main', 'force new connection': true});

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

                agent.set({sendLaunchBuild: sendPostRequest(agent, socketSettings.url + '/launchBuild')});
            }
        });

        return socket;
    },

    setSettingsSocket: function (model) {

        var socket = io.connect(socketSettings.url, {'path': socketSettings.basePath + 'settings', 'force new connection': true});

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

        model.urlSettings.set({sendUrlChanging: sendPostRequest(model.urlSettings, socketSettings.url + '/changeUrl', true)}, {silent: true});
        model.settings.set({sendSettingSubmit: sendPostRequest(model.settings, socketSettings.url + '/changeConfiguration')}, {silent: true});
        model.connectionSetting.set({sendConnectionSubmit: sendPostRequest(model.connectionSetting, socketSettings.url + '/newAuthentication')}, {silent: true});

        return socket;
    },

    setBuildSocket: function (model, id) {

        var socket = io.connect(socketSettings.url, {
            'path': socketSettings.basePath + 'build',
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

        var socket = io.connect(socketSettings.url, {
            'path': socketSettings.basePath + 'agent',
            'query': 'id=' + id,
            'force new connection': true
        });

        socket.on('agent', function (agent) {
            var object = agent[0].model;
            model.agent.set({
                object: object,
                sendLaunchBuild: sendPostRequest(model.agent, socketSettings.url + '/launchBuild')
            });
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