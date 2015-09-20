window.Agent = Backbone.Model.extend({
    defaults: {
        id: "0",
        object: "",
        state: "",
        options: {
            view: {
                needToUpdate: false,
                className: "agentInfo",
                tagName: "div",
                template: "briefAgent"
            }
        },
        sendLaunchBuild: ""
    },
    getModel: function () {
        var model = this.get("object");
        model.state = this.get("state");
        return model;
    },

    handleLaunchBuildClick: function () {
        var agent = {
            id: this.get("object").id,
            agentName: this.get("object").name
        };
        this.set({state: 'running'});
        var sendLaunchBuild = this.get('sendLaunchBuild');
        if (sendLaunchBuild)
            sendLaunchBuild(agent);
    }
});

window.GeneralBuild = Backbone.Model.extend({
    defaults: {
        id: "0",
        object: "",
        options: {
            view: {
                needToUpdate: true,
                className: "general-buildInfo",
                tagName: "div",
                template: "briefGeneralBuild"
            }
        }
    },
    getModel: function () {
        return this.get("object");
    }
});

window.AdditionalBuild = Backbone.Model.extend({
    defaults: {
        id: "0",
        object: "",
        options: {
            view: {
                needToUpdate: true,
                className: "additional-buildInfo",
                tagName: "tr",
                template: "briefAdditionalBuild"
            }
        }
    },
    getModel: function () {
        return this.get("object");
    }
});
