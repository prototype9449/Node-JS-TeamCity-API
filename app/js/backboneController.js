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
        // $('#header').html(new HeaderView().render().el);
    },

    routes: {
        "": "mainPage",
        "/": "mainPage",
        "/build": "buildDetails",
        "/build/:id": "buildDetails",
        "/agent/:id": "agentDetails"
    },

    mainPage: function () {
        this.before(function (){
            app.showView('#content', new MainPageView({model: app}));
        });
    },

    buildDetails: function (id) {
        this.before(function () {
        // var build = app.wineList.get(id);
        var build = new Build(id);
        app.showView('#content', new BuildView({model: build}));
        });
    },

    agentDetails: function (id) {
        this.before(function () {
        // var build = app.wineList.get(id);
        var agent = new Agent(id);
        app.showView('#content', new AgentView({model: agent}));
        });
    },

    showView: function (selector, view) {
        if (this.currentView)
            this.currentView.close();
        $(selector).html(view.render().el);
        this.currentView = view;
        return view;
    },

    before: function (callback) {
        if (this.AgentList || this.BuildList) {
            if (callback) callback();
        } else {
            if (!this.AgentList) this.AgentList = new AgentCollection();
            if (!this.BuildList) this.BuildList = new BuildCollection();

            if (callback) callback();

           // this.AgentList.add(new Agent({id : 1}));
         //   this.AgentList.add(new Agent({id : 2}));
          //  this.AgentList.add(new Agent({id : 3}));
          //  this.AgentList.add(new Agent({id : 4}));
          //  this.AgentList.add(new Agent({id : 5}));
          //  this.AgentList.add(new Agent({id : 6}));
          //  this.BuildList.add(new Build({id : 7}));
        }
    }
});

