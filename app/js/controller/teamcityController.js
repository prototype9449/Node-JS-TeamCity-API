Backbone.View.prototype.close = function () {
    console.log('Closing view ' + this);
    if (this.beforeClose) {
        this.beforeClose();
    }
    this.remove();
    this.unbind();
};

TeamcityController = Backbone.Router.extend({

    initialize: function () {
        this.socket = {};

    },

    routes: {
        "": "mainPage",
        "/": "mainPage",
        "/build": "buildDetails",
        "/build/:id": "buildDetails",
        "/agent/:id": "agentDetails"
    },

    disconectSocket: function () {
        if (this.socket.disconnect)
            this.socket.disconnect();
    },

    mainPage: function () {
        this.disconectSocket();
        var model = {
            agentList: new ObjectsCollection([], {modelProvider: Agent}),
            buildList: new ObjectsCollection([], {modelProvider: Build, maxElem : 10 })
        };
        this.model = model;

        this.showView('#content', new MainPageView({model: this.model, router: this}));
        this.socket = socketManager.setMainSocket(this.model);
    },

    buildDetails: function (stringId) {
        this.disconectSocket();
        var id = stringId.split(":")[1];
        var model = {
            build: new FullBuild({id: id, body : this.model.buildList.get(id).get("body")}),
            buildList: new ObjectsCollection([], {modelProvider: BuildHistory })
        };
        this.model = model;

        this.showView('#content', new BuildPageView({model: this.model, router: this}));
        this.socket = socketManager.setBuildSocket(this.model, id);

    },

    agentDetails: function (stringId) {
        this.disconectSocket();
        var id = stringId.split(":")[1];
        var model = {
            agent: new FullAgent({id: id, body : this.model.agentList.get(id).get("body")}),
            buildList: new ObjectsCollection([], {modelProvider: AgentHistory })
        };
        this.model = model;

        this.showView('#content', new AgentPageView({model: this.model, router: this}));
        this.socket = socketManager.setAgentSocket(this.model, id);
    },

    showView: function (selector, view) {
        if (this.currentView)
            this.currentView.close();
        $(selector).html(view.render().el);
        this.currentView = view;
        return view;
    }
});

