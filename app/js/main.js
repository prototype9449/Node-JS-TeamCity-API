$(function () {
    tpl.loadTemplates(
        [
            {
                name: 'agentInfoPage',
                path: 'tpl/agentInfoPage'
            },
            {
                name: 'buildsInfoPage',
                path: 'tpl/buildsInfoPage'
            },
            {
                name: 'mainPage',
                path: 'tpl/mainPage'
            },
            {
                name: 'briefAgent',
                path: 'tpl/templates/agent-brief-information-panel'
            },
            {
                name: 'briefGeneralBuild',
                path: 'tpl/templates/general-build-brief-information-panel'
            },
            {
                name: 'briefAdditionalBuild',
                path: 'tpl/templates/additional-build-brief-information-panel'
            },
            {
                name: 'fullAgent',
                path: 'tpl/templates/agent-full-Information-panel'
            },
            {
                name: 'agentHistory',
                path: 'tpl/templates/agent-history-panel'
            },
            {
                name: 'fullBuild',
                path: 'tpl/templates/build-full-information-panel'
            },
            {
                name: 'buildHistory',
                path: 'tpl/templates/build-history-panel'
            }

        ], function () {
            new TeamcityController();
            Backbone.history.start();
        });
});

