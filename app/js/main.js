$(function () {
    tpl.loadTemplates(
        [
            {
                name: 'agentInfoPage',
                path: 'tpl/agent-information-page'
            },
            {
                name: 'buildsInfoPage',
                path: 'tpl/build-information-page'
            },
            {
                name: 'mainPage',
                path: 'tpl/main-information-page'
            },
            {
                name: 'settingsPage',
                path: 'tpl/settings-information-page'
            },
            {
                name: 'SettingsPanel',
                path: 'tpl/settingsPage/agent-settings-panel'
            },

            {
                name: 'currentUrl',
                path: 'tpl/settingsPage/current-url-panel'
            },
            {
                name: 'newConnection',
                path: 'tpl/settingsPage/new-connection-form-panel'
            },
            {
                name: 'briefAgent',
                path: 'tpl/mainPage/agent-brief-information-panel'
            },
            {
                name: 'briefGeneralBuild',
                path: 'tpl/mainPage/general-build-brief-information-panel'
            },
            {
                name: 'briefAdditionalBuild',
                path: 'tpl/mainPage/additional-build-brief-information-panel'
            },
            {
                name: 'fullAgent',
                path: 'tpl/agentPage/agent-full-Information-panel'
            },
            {
                name: 'agentHistory',
                path: 'tpl/agentPage/agent-history-panel'
            },
            {
                name: 'fullBuild',
                path: 'tpl/buildPage/build-full-information-panel'
            },
            {
                name: 'buildHistory',
                path: 'tpl/buildPage/build-history-panel'
            }

        ], function () {
            new TeamcityController();
            Backbone.history.start();
        });

    rivets.configure({
        adapter: {
            subscribe: function (obj, keypath, callback) {
                obj.on('change:' + keypath, callback);
            },
            unsubscribe: function (obj, keypath, callback) {
                obj.off('change:' + keypath, callback);
            },
            read: function (obj, keypath) {
                return obj.get(keypath);
            },
            publish: function (obj, keypath, value) {
                obj.set(keypath, value);
            }
        }
    });
});

window.socketSettings = {url: 'http://localhost:8080', basePath: '/'};
