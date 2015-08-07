window.MainPageView = Backbone.View.extend({

    tagName: "div", // Not required since 'div' is the default if no el or tagName specified

    initialize: function () {
        this.template = _.template(tpl.get('mainPage'));
        this.model.bind("change", this.render, this);
    },

    render: function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change input": "change",
        "click .buildsRef"    : "build",
        "click .agentRef"    : "agent"
        },

    build: function(event) {
            app.navigate("build", true);
            return false;
        },

    agent: function(event) {
        app.navigate("build", true);
        return false;
    },

    change: function (event) {
        var target = event.target;
        console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
        // You could change your model on the spot, like this:
        // var change = {};
        // change[target.name] = target.value;
        // this.model.set(change);
    }
});

