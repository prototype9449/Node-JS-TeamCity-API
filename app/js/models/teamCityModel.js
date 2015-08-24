window.Agent = Backbone.Model.extend({
    defaults: {
        id: "0",
        body: "",
        pathPart: "/agent/id:",
        viewOptions: {
            className: "agentInfo",
            blockId: "",
            tagName: "div"
        }
    }
});

window.Build = Backbone.Model.extend({
    defaults: {
        id: "0",
        body: "",
        pathPart: "/build/id:",
        viewOptions: {
            className: "buildInfo",
            blockId: "",
            tagName: "div"
        }
    }
});

window.FullAgent = Backbone.Model.extend({
    defaults: {
        id: "0",
        body: "",
        pathPart: "/agent/id:",
        viewOptions: {
            className: "fullAgentInfo",
            blockId: "",
            tagName: "div"
        }
    }
});

window.FullBuild = Backbone.Model.extend({
    defaults: {
        id: "0",
        body: "",
        pathPart: "/agent/id:",
        viewOptions: {
            className: "fullBuildInfo",
            blockId: "",
            tagName: "div"
        }
    }
});

window.AgentHistory = Backbone.Model.extend({
    defaults: {
        id: "0",
        body: "",
        pathPart: "/build/id:",
        viewOptions: {
            className: "history",
            blockId: "",
            tagName: "tr"
        }
    }
});

window.BuildHistory = Backbone.Model.extend({
    defaults: {
        id: "0",
        body: "",
        pathPart: "/agent/id:",
        viewOptions: {
            className: "history",
            blockId: "",
            tagName: "tr"
        }
    }
});

var addElement = function (self, model) {
    var duplicate =self.find(function (agent) {
        return agent.id == model.id;
    });

    if (duplicate) {
        var index = self.indexOf(duplicate);
        self.models[index].set(model);
    }
    else {
        Backbone.Collection.prototype.add.call(self, model);
    }
};

window.ObjectsCollection = Backbone.Collection.extend({
    maxElem: null,
    initialize: function (models, options) {
        this.modelProvider = options.modelProvider;
        this.maxElem = options.maxElem || this.maxElem;
    },

    model: function (attrs, options) {
        return new options.collection.modelProvider(attrs, options);
    },

    comparator: function (build) {
        return (-build.get("id"));
    },

    add: function (model) {
        addElement(this, model);
        if (this.maxElem)
            if (this.length > this.maxElem)
                this.removeOldElements();
    },

    removeOldElements: function () {
        var oldElement = this.min(function (build) {
            return build.get("id");
        });

        this.remove(oldElement);
    }
});
