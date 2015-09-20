window.FullAgent = Backbone.Model.extend({
    defaults: {
        id: "0",
        object: "",
        state: "",
        options: {
            view: {
                needToUpdate: false,
                className: "fullAgentInfo",
                tagName: "div",
                template: "fullAgent"
            }
        },
        sendLaunchBuild: ""
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
    },
    getModel: function () {
        var model = this.get("object");
        model.state = this.get("state");
        return model;
    }
});

window.AgentHistory = Backbone.Model.extend({
    defaults: {
        id: "0",
        object: "",
        options: {
            view: {
                needToUpdate: true,
                className: "history",
                tagName: "tr",
                template: "agentHistory"
            }
        }
    },
    getModel: function () {
        return this.get("object");
    }
});