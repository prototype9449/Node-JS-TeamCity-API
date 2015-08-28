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
            buildList: new ObjectsCollection([], {modelProvider: Build, maxElem: 10})
        };

        this.mainModel = model;

        this.showView('#content', new MainPageView({model: model, router: this}));
        this.socket = socketManager.setMainSocket(model);
    },

    buildDetails: function (stringId) {
        var id = stringId.split(":")[1];
        var build = this.mainModel.buildList.find(function (item) {
            return item.id == id
        });

        var model = {
            build: new FullBuild({id: id, object: build.get("object")}),
            buildList: new ObjectsCollection([], {modelProvider: BuildHistory})
        };

        this.showView('#content', new BuildPageView({model: model, router: this}));
        this.socket = socketManager.setBuildSocket(model, id);

    },

    agentDetails: function (stringId) {
        var id = stringId.split(":")[1];
        var agent = this.mainModel.agentList.find(function (item) {
            return item.id == id
        });

        var model = {
            agent: new FullAgent({id: id, object: agent.get("object")}),
            buildList: new ObjectsCollection([], {modelProvider: AgentHistory})
        };

        this.model = model;


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

