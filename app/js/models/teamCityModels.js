window.Agent = Backbone.Model.extend({
    defaults: {
        needToUpdate: false,
        id: "0",
        object: "",
        options: {
            path: "/agent/id:",
            view: {
                className: "agentInfo",
                tagName: "div",
                template: "briefAgent"
            }
        }
    }
});

window.GeneralBuild = Backbone.Model.extend({
    defaults: {
        needToUpdate: true,
        id: "0",
        object: "",
        options: {
            path: "/build/id:",
            view: {
                className: "general-buildInfo",
                tagName: "div",
                template: "briefGeneralBuild"
            }
        }
    }
});

window.AdditionalBuild = Backbone.Model.extend({
    defaults: {
        needToUpdate: true,
        id: "0",
        object: "",
        options: {
            view: {
                className: "additional-buildInfo",
                tagName: "tr",
                template: "briefAdditionalBuild"
            }
        }
    }
});

window.FullAgent = Backbone.Model.extend({
    defaults: {
        needToUpdate: false,
        id: "0",
        object: "",
        options: {
            path: "/agent/id:",
            view: {
                className: "fullAgentInfo",
                tagName: "div",
                template: "fullAgent"
            }
        }
    }
});

window.FullBuild = Backbone.Model.extend({
    defaults: {
        needToUpdate: false,
        id: "0",
        object: "",
        options: {
            path: "/agent/id:",
            view: {
                className: "fullBuildInfo",
                tagName: "div",
                template: "fullBuild"
            }
        }
    }
});

window.UrlSettings = Backbone.Model.extend({
    defaults: {
        needToUpdate: false,
        id: "0",
        object: "",
        options: {
            path: "/settings",
            view: {
                className: "SettingsPanel",
                tagName: "div",
                template: "currentUrl"
            }
        },
        sendUrlChanging: ""
    },
    handleUrlChanging: function (selectedUrl) {
        var urlsSettins = this.get('object').urlsSetting;
        for (var i in urlsSettins) {
            urlsSettins[i].isCurrent = false;
            if (urlsSettins[i].url == selectedUrl.url && urlsSettins[i].userName == selectedUrl.user) {
                urlsSettins[i].isCurrent = true;
            }
        }
        var sendUrlChanging = this.get('sendUrlChanging');
        if (sendUrlChanging)
            sendUrlChanging(selectedUrl);
    }
});

window.AgentsSettings = Backbone.Model.extend({
    defaults: {
        needToUpdate: false,
        id: "0",
        object: "",
        options: {
            path: "/settings",
            view: {
                className: "SettingsPanel",
                tagName: "div",
                template: "SettingsPanel"
            }
        },
        sendSettingSubmit: ""
    },

    handleSettingSubmit: function (data) {
        var sendSettingSubmit = this.get('sendSettingSubmit');
        if (sendSettingSubmit)
            sendSettingSubmit(data);
    }
});

window.NewConnectionSetting = Backbone.Model.extend({
    defaults: {
        needToUpdate: false,
        id: "0",
        object: {url: "", user: "", pass: ""},
        options: {
            path: "/settings",
            view: {
                className: "SettingsPanel",
                tagName: "div",
                template: "newConnection"
            }
        },
        sendConnectionSubmit: ""
    },
    handleConnectionSubmit: function (data) {
        var sendConnectionSubmit = this.get('sendConnectionSubmit');
        if (sendConnectionSubmit)
            sendConnectionSubmit(data);
    }
});

window.AgentHistory = Backbone.Model.extend({
    defaults: {
        needToUpdate: true,
        id: "0",
        object: "",
        options: {
            path: "/build/id:",
            view: {
                className: "history",
                tagName: "tr",
                template: "agentHistory"
            }
        }
    }
});

window.BuildHistory = Backbone.Model.extend({
    defaults: {
        needToUpdate: true,
        id: "0",
        object: "",
        options: {
            path: "/agent/id:",
            view: {
                className: "history",
                tagName: "tr",
                template: "buildHistory"
            }
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
