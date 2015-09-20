window.AgentView = ObjectView.extend({

    events: {
        "click  .launch-button": "launchBuildClickEventHandler"
    },

    launchBuildClickEventHandler: function (e) {
        e.preventDefault();

        var handler = this.model.handleLaunchBuildClick;

        if (handler)
            handler.call(this.model);
    }
});