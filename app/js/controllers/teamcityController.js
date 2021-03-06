TeamcityController = Backbone.Router.extend({

    initialize: function () {
        this.socket = {};

    },

    routes: {
        "": "showMainPage",
        "/": "mainPage",
        "/build/:id": "showBuildDetailsPage",
        "/agent/:id": "showAgentDetailsPage",
        "/settings": "showSettingsPage"
    },

    showMainPage: function () {
        this.doBeforeShowingView();
        var model = {
            agentList: new ObjectsCollection([], {modelProvider: Agent}),
            generalBuildList: new ObjectsCollection([], {modelProvider: GeneralBuild, maxElem: 10}),
            additionalBuildList: new ObjectsCollection([], {modelProvider: AdditionalBuild})
        };

        this.mainModel = model;

        this.showView('#content', new MainPageView({model: model}));
        this.socket = socketManager.setMainSocket(model);
    },

    showSettingsPage: function () {
        var model = {
            settings: new AgentsSettings(),
            urlSettings : new UrlSettings(),
            connectionSetting : new NewConnectionSetting()
        };

        this.showView('#content', new SettingsPageView({model: model}));
        this.socket = socketManager.setSettingsSocket(model);
    },

    showBuildDetailsPage: function (stringId) {
        this.doBeforeShowingView();
        var id = stringId.split(":")[1];

        var build = {};
        try {
            var buildModel = this.mainModel.generalBuildList.find(function (item) {
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

        this.showView('#content', new BuildPageView({model: model}));
        this.socket = socketManager.setBuildSocket(model, id);

    }
    ,

    showAgentDetailsPage: function (stringId) {
        this.doBeforeShowingView();
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

        this.showView('#content', new AgentPageView({model: model}));
        this.socket = socketManager.setAgentSocket(model, id);
    }
    ,

    doBeforeShowingView: function () {
        this.disconnectOldConnection();
    }
    ,

    disconnectOldConnection: function () {
        if (this.socket) {
            if (this.socket.emit)
                this.socket.emit("disconnect");
            if (this.socket.close)
                this.socket.close();
        }
    }
    ,

    showView: function (selector, view) {
        $(selector).html(view.render().el);
        return view;
    }
});