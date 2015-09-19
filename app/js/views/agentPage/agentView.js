window.AgentView = ObjectView.extend({

    events: {
        "click  .launch-button": "launchBuildClickEventHandler"
    },

    launchBuildClickEventHandler : function(e){
        e.preventDefault();

        var handler = this.model.handleLaunchBuildClick;

        if (handler)
            handler.call(this.model);
    },

    render: function () {
        var model = this.model.get("object");
        model.state = this.model.get("state");
        var html = "";
        if (model)
            html = this.template(model);

        $(this.el)
            .fadeOut(300)
            .html(html)
            .fadeIn(300);

        return this;
    },

    renderChange: function () {
        var needToUpdate = this.model.get('options')["view"]['needToUpdate'];
        var model = this.model.get("object");
        model.state = this.model.get("state");
        var html = this.template(model);
        if (!html)  return this;

        if (needToUpdate) {
            $(this.el)
                .fadeOut(300)
                .html(html)
                .fadeIn(300);
        }
        else {
            $(this.el).html(html);
        }

        return this;
    },
});