Backbone.View.prototype.close = function () {
    console.log('Closing view ' + this);
    //if (this.beforeClose) {
    //    this.beforeClose();
    //}
    //this.remove();
    //this.unbind();
};

TeamcityController = Backbone.Router.extend({

    initialize: function () {
        this.socket = {};

    },

    routes: {
        "": "mainPage",
        "/": "mainPage",
        "/build/:id": "buildDetails",
        "/agent/:id": "agentDetails"
    },

    mainPage: function () {
        var model = {
            agentList: new ObjectsCollection([], {modelProvider: Agent}),
            buildList: new ObjectsCollection([], {modelProvider: Build, maxElem : 10 })
        };

        this.showView('#content', new MainPageView({model: model, router: this}));
        this.socket = socketManager.setMainSocket(model);
    },

    buildDetails: function (stringId) {
        var id = stringId.split(":")[1];
        var model = {
            build: new FullBuild({id: id}),
            buildList: new ObjectsCollection([], {modelProvider: BuildHistory })
        };

        this.showView('#content', new BuildPageView({model: model, router: this}));
        this.socket = socketManager.setBuildSocket(model, id);

    },

    agentDetails: function (stringId) {
        var id = stringId.split(":")[1];
        var model = {
            agent: new FullAgent({id: id}),
            buildList: new ObjectsCollection([], {modelProvider: AgentHistory })
        };

        this.showView('#content', new AgentPageView({model: model, router: this}));
        this.socket = socketManager.setAgentSocket(model, id);
    },

    showView: function (selector, view) {
        if (this.currentView)
            this.currentView.close();
        $(selector).html(view.render().el);
        this.currentView = view;
        return view;
    }
});

