window.UrlSettings = Backbone.Model.extend({
    defaults: {
        id: "0",
        object: "",
        state: "default",
        options: {
            view: {
                needToUpdate: false,
                className: "SettingsPanel",
                tagName: "div",
                template: "currentUrl"
            }
        },
        currentUrl: {
            option: ""
        },
        sendUrlChanging: ""
    },
    handleUrlChanging: function () {
        var objects = this.get('currentUrl').option.split(' ');
        var result = {
            url: objects[0],
            user: objects[1]
        };

        this.set({state: 'running'});
        var sendUrlChanging = this.get('sendUrlChanging');
        if (sendUrlChanging)
            sendUrlChanging(result);
    },

    getModel: function () {
        var model = this.get("object");
        model.state = this.get("state");
        return model;
    }
});

window.AgentsSettings = Backbone.Model.extend({
    defaults: {

        id: "0",
        object: "",
        state: "default",
        options: {
            view: {
                needToUpdate: false,
                className: "SettingsPanel",
                tagName: "div",
                template: "SettingsPanel"
            }
        },
        currentSetting: {
            url: "",
            userName: ""
        },
        sendSettingSubmit: ""
    },
    getModel: function () {
        var model = this.get("object");
        model.state = this.get("state");
        return model;
    },
    set: function (attributes, options) {
        if (attributes.object && attributes.object.urlsSetting) {
            for (var i in attributes.object.urlsSetting) {
                if (attributes.object.urlsSetting[i].isCurrent) {
                    this.get('currentSetting').url = attributes.object.urlsSetting[i].url;
                    this.get('currentSetting').userName = attributes.object.urlsSetting[i].userName;
                }
            }
            return;
        }

        Backbone.Model.prototype.set.call(this, attributes, options);


        if (attributes.object && attributes.object.settings && attributes.object.settings.agents) {
            this.get('currentSetting').agentFixBuilds = {};
            var agentsInModel = this.get('currentSetting').agentFixBuilds;
            for (var i in attributes.object.settings.agents) {
                var indexOfBuildType = attributes.object.settings.agents[i].indexOfBuildType;
                if (indexOfBuildType && indexOfBuildType > 0)
                    agentsInModel[attributes.object.settings.agents[i].agentName] = attributes.object.settings.buildTypes[indexOfBuildType].id;
                else
                    agentsInModel[attributes.object.settings.agents[i].agentName] = attributes.object.settings.buildTypes[0].id;
            }
        }
    },

    handleSettingSubmit: function () {
        var data = this.get('currentSetting');
        var result = {url: data.url, userName: data.userName, agentFixBuilds: []};
        for (var i in data.agentFixBuilds) {
            result.agentFixBuilds[result.agentFixBuilds.length] = {};
            result.agentFixBuilds[result.agentFixBuilds.length - 1].agentName = i;
            result.agentFixBuilds[result.agentFixBuilds.length - 1].buildTypeId = data.agentFixBuilds[i];
        }

        this.set({state: 'running'});
        var sendSettingSubmit = this.get('sendSettingSubmit');
        if (sendSettingSubmit)
            sendSettingSubmit(result);
    }
});

window.NewConnectionSetting = Backbone.Model.extend({
    defaults: {
        id: "0",
        object: {url: "", user: "", pass: ""},
        state: "default",
        options: {
            view: {
                needToUpdate: false,
                className: "SettingsPanel",
                tagName: "div",
                template: "newConnection"
            }
        },
        sendConnectionSubmit: ""
    },
    getModel: function () {
        var model = this.get("object");
        model.state = this.get("state");
        return model;
    },

    handleConnectionSubmit: function () {
        var data = this.get('object');

        this.set({state: 'running'});
        var sendConnectionSubmit = this.get('sendConnectionSubmit');
        if (sendConnectionSubmit)
            sendConnectionSubmit(data);
    }
});