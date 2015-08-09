window.AgentListView = Backbone.View.extend({

    tagName: 'div',

    initialize: function () {
        console.log('AgentListView has been created');
        if (this.model)
            this.bind(this.model);
    },

    bind: function (model) {
        this.model = model;
        this.model.bind("reset", this.render, this);
        var self = this;
        this.model.bind("add", function (agent) {
            $(self.$el).append(new AgentListItemView({model: agent}).render().el);
        });
    },

    render: function (eventName) {
        _.each(this.model.models, function (agent) {
            $(this.$el).append(new AgentListItemView({model: agent}).render().el);
        }, this);
        return this;
    }
});

window.BuildListView = Backbone.View.extend({

    tagName: 'div',

    initialize: function () {
        console.log('BuildListView has been created');
        if (this.model)
            this.bind(this.model);
    },

    bind: function (model) {
        this.model = model;
        this.model.bind("reset", this.render, this);
        var self = this;
        this.model.bind("add", function (build) {
            $(self.$el).append(new BuildListItemView({model: build}).render().el);
        });
    },

    render: function (eventName) {
        _.each(this.model.models, function (build) {
            $(this.$el).append(new BuildListItemView({model: build}).render().el);
        }, this);
        return this;
    }
});

window.AgentListItemView = Backbone.View.extend({

    tagName: "div",

    initialize: function () {
        console.log('AgentListItemView has been created');
        this.template = _.template(tpl.get('shortAgentInfo'));
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function (eventName) {
        $(this.el).html(this.model.get('body'));
      //  $(this.el).html(this.template());//this.model.toJSON()));
        return this;
    },

    events: {
        "click .shortAgentInfo": "agentInfo"
    },

    agentInfo: function (event) {
        var path = "/agent/id:" + this.model.id;
        app.navigate(path, true);
        return false;
    }
});

window.BuildListItemView = Backbone.View.extend({

    tagName: "div",

    initialize: function () {
        console.log('BuildListItemView has been created');
        this.template = _.template(tpl.get('shortBuildInfo'));

        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function (eventName) {
        $(this.el).html(this.model.get('body')); //приходящие с сервера
        //$(this.el).html(this.template());//this.model.toJSON())); //c местным шаблоном
        return this;
    },

    events: {
        "click .shortBuildInfo": "buildInfo"
    },

    buildInfo: function (event) {
        var path = "/build/id:" + this.model.id;
        app.navigate(path, true);
        return false;
    }
});

window.MainPageView = Backbone.View.extend({

    tagName: 'div',

    initialize: function () {
        console.log('MainPageView has been created');
        this.template = _.template(tpl.get('mainPage'));
    },

    agentListView: new AgentListView(),
    buildListView: new BuildListView(),

    render: function () {
        $(this.el).html(this.template());
        this.agentListView.$el = this.$('#agents-panel');
        this.agentListView.bind(this.model.AgentList);
        this.agentListView.render();
        this.agentListView.delegateEvents();

        this.buildListView.$el = this.$('#builds-panel');
        this.buildListView.bind(this.model.BuildList);
        this.buildListView.render();
        this.buildListView.delegateEvents();
        return this;
    }
});
