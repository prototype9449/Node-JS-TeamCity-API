window.Agent = Backbone.Model.extend({
    defaults: {
        id: "0",
        object: {},
        viewTemplate : "templates/agent-brief-information-panel",
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
        object: {},
        viewTemplate : "templates/build-brief-information-panel",
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
        object: {},
        viewTemplate : "templates/agent-full-Information-panel",
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
        object: {},
        viewTemplate : "templates/build-full-information-panel",
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
        object: {},
        viewTemplate : "templates/agent-history-panel",
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
        object: {},
        viewTemplate : "templates/build-history-panel",
        pathPart: "/agent/id:",
        viewOptions: {
            className: "history",
            blockId: "",
            tagName: "tr"
        }
    }
});

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
        this.addElement(this, model);
        if (this.maxElem)
            if (this.length > this.maxElem)
                this.removeOldElements();
    },

    addElement: function (self, model) {
        var duplicate = self.find(function (modelFromStorage) {
            return modelFromStorage.id == model.id;
        });

        if (duplicate) {
            var index = self.indexOf(duplicate);
            self.models[index].set(model);
        }
        else {
            Backbone.Collection.prototype.add.call(self, model);
        }
    },

    removeOldElements: function () {
        var oldElement = this.min(function (build) {
            return build.get("id");
        });

        this.remove(oldElement);
    }
});
