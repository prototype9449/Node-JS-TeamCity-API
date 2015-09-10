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

window.SelectedUrl = Backbone.Model.extend({
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
        renderFunction: function (settings, socket) {
            $(".selectpicker").selectpicker();
            $(".selectpicker[name='url']").selectpicker('val', settings.currentSettings.connection.url + ' ' + settings.currentSettings.connection.auth.user);
            $.each(settings.currentSettings.agentFixBuilds, function (index, item) {
                var selector = ".selectpicker[name='" + item.agentName + "']";
                $(selector).selectpicker('val', item.buildTypeId);
            });
            $("select.selectpicker[name='url']").on('change', function () {
                var value = $(".selectpicker[name='url'] option:selected").val();
                var objects = value.split(' ');
                var result = {
                    url: objects[0],
                    user: objects[1]
                };

                socket.emit('change url', result);
            });
        }
    }
});

window.SettingsPanel = Backbone.Model.extend({
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
        renderFunction: function (settings, socket) {
            $(".selectpicker").selectpicker();
            $('#settings-form').submit(function (event) {
                var arrayData = $(this).serializeArray();
                var urlWithUserName = arrayData[0].value.split(' ');
                var key = {
                    url: urlWithUserName[0],
                    userName: urlWithUserName[1]
                };
                var agentFixBuilds = arrayData.slice(1, arrayData.length).map(function (value) {
                    return {
                        agentName: value.name,
                        buildTypeId: value.value
                    }
                });

                var result = {
                    url: key.url,
                    userName: key.userName,
                    agentFixBuilds: agentFixBuilds
                };


                socket.emit('change configuration', result);
                event.preventDefault();
            });
        }
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
