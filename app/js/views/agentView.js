window.AgentView = ObjectView.extend({

    events: {
        "click  .launch-button": "launchBuildClickEventHandler"
    },
    launchBuildClickEventHandler : function(e){
        e.preventDefault();
        var handler = this.model.handleLaunchBuildClick;
        var agent = {
            id : this.model.get("object").id,
            agentName : this.model.get("object").agentName
        };
        if (handler)
            handler.call(this.model,agent);
    },

    render: function () {
        var html = this.template();
        if (!html)  return this;

        $(this.el).html(html);

        return this;
    }
});