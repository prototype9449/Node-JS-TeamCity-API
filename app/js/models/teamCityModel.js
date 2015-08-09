window.Agent = Backbone.Model.extend({
    // urlRoot: "api/wines",
    defaults: {
        id: "0",
        body: "",
        freeSpace: "--",
        name: "default",
        state: "start"
    }
});

window.AgentCollection = Backbone.Collection.extend({
    // urlRoot: "api/wines",
    model: Agent
});

window.Build = Backbone.Model.extend({
    // urlRoot: "api/wines",
    defaults: {
        id: "0",
        body: "",
        status: "default",
        agentName: "-",
        branch: "master"
    }
});

window.BuildCollection = Backbone.Collection.extend({
    // urlRoot: "api/wines",
    model: Build
});
