Backbone.View.prototype.close = function () {
    console.log('Closing view ' + this);
    if (this.beforeClose) {
        this.beforeClose();
    }
    this.remove();
    this.unbind();
};


var Controller = Backbone.Router.extend({

    initialize: function () {
       // $('#header').html(new HeaderView().render().el);
    },

    routes: {
        "": "mainPage",
        "/": "mainPage",
        "build": "buildDetails",
        "build/:id": "buildDetails",
        "agent/:id": "agentDetails"
    },

    mainPage: function (id) {
      //  this.before(function () {
        var build = new Build(id);
        var agent = new Agent(id);
            app.showView('#content', new MainPageView({model: build}));
      //  });
    },

    buildDetails: function (id) {
      //  this.before(function () {
           // var build = app.wineList.get(id);
            var build = new Build(id);
            app.showView('#content', new BuildView({model: build}));
      //  });
    },

    agentDetails: function (id) {
       // this.before(function () {
            // var build = app.wineList.get(id);
            var agent = new Agent(id);
            app.showView('#content', new AgentView({model: agent}));
       // });
    },


    showView: function (selector, view) {
        if (this.currentView)
            this.currentView.close();
        $(selector).html(view.render().el);
        this.currentView = view;
        return view;
    },

    before: function (callback) {
        if (this.mainList) {
            if (callback) callback();
        } else {
            this.buildsList = new BuildTypeCollection();
            this.buildsList.fetch({
                success: function () {
                    $('#sidebar').html(new WineListView({model: app.wineList}).render().el);
                    if (callback) callback();
                }
            });
        }
    }

});

tpl.loadTemplates(['briefAgentInfo', 'fullAgentInfo', 'briefBuildInfo', 'fullBuildsInfo', 'mainPage'], function () {
    app = new Controller();
    Backbone.history.start();
});