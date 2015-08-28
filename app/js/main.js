$(function () {
    tpl.loadTemplates(
        [
            'fullAgentInfo',
            'fullBuildsInfo',
            'mainPage',
            'templates/agent-brief-information-panel',
            'templates/agent-full-Information-panel',
            'templates/agent-history-panel',
            'templates/build-brief-information-panel',
            'templates/build-full-information-panel',
            'templates/build-history-panel'
        ], function () {
        new TeamcityController();
        Backbone.history.start();
    });
});

_.templateSettings.variable = "data";