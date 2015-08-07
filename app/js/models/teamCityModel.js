window.Agent = Backbone.Model.extend({
   // urlRoot: "api/wines",
    defaults: {
      //  username: "",
      //  state: "start"
    }
});

window.AgentCollection = Backbone.Collection.extend({
   // urlRoot: "api/wines",
    model: Agent
});

window.BuildType = Backbone.Model.extend({
    // urlRoot: "api/wines",
    defaults: {
        //  username: "",
        //  state: "start"
    }
});

window.BuildTypeCollection = Backbone.Collection.extend({
    // urlRoot: "api/wines",
    model: BuildType
});


window.Build = Backbone.Model.extend({
    // urlRoot: "api/wines",
    defaults: {
        //  username: "",
        //  state: "start"
    }
});

window.BuildCollection = Backbone.Collection.extend({
    // urlRoot: "api/wines",
    model: Build
});

window.FullAgent = Backbone.Model.extend({
    // urlRoot: "api/wines",
    defaults: {
        //  username: "",
        //  state: "start"
    }
});
