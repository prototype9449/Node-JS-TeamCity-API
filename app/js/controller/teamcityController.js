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
        this.beforeView();
        var model = {
            agentList: new ObjectsCollection([], {modelProvider: Agent}),
            generalBuildList: new ObjectsCollection([], {modelProvider: GeneralBuild, maxElem: 10}),
            additionalBuildList: new ObjectsCollection([], {modelProvider: AdditionalBuild })
        };

        this.mainModel = model;

        this.showView('#content', new MainPageView({model: model, router: this}));
        this.socket = socketManager.setMainSocket(model);
    },

    buildDetails: function (stringId) {
        this.beforeView();
        var id = stringId.split(":")[1];

        var build = {};
        try {
            var buildModel = this.mainModel.buildList.find(function (item) {
                return item.id == id
            });
            build = new FullBuild({id: id, object: buildModel.get("object")});
        } catch (err) {
            build = new FullBuild({id: id});
        }

        var model = {
            build: build,
            buildList: new ObjectsCollection([], {modelProvider: BuildHistory})
        };

        this.showView('#content', new BuildPageView({model: model, router: this}));
        this.socket = socketManager.setBuildSocket(model, id);

    },

    agentDetails: function (stringId) {
        this.beforeView();
        var id = stringId.split(":")[1];

        var agent = {};
        try {
            var agentModel = this.mainModel.agentList.find(function (item) {
                return item.id == id
            });
            agent = new FullAgent({id: id, object: agentModel.get("object")});
        } catch (err) {
            agent = new FullAgent({id: id});
        }

        var model = {
            agent: agent,
            buildList: new ObjectsCollection([], {modelProvider: AgentHistory})
        };

        this.model = model;


        this.showView('#content', new AgentPageView({model: model, router: this}));
        this.socket = socketManager.setAgentSocket(model, id);
    },

    beforeView: function () {
        this.disconnectOldConnection();
    },

    disconnectOldConnection: function () {
        if (this.socket) {
            if (this.socket.emit)
                this.socket.emit("disconnect");
            if (this.socket.close)
                this.socket.close();
        }
    },

    showView: function (selector, view) {
        if (this.currentView)
            this.currentView.close();
        $(selector).html(view.render().el);
        this.currentView = view;
        return view;
    }
});