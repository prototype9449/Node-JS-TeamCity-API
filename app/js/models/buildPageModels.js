window.FullBuild = Backbone.Model.extend({
    defaults: {
        id: "0",
        object: "",
        options: {
            view: {
                needToUpdate: false,
                className: "fullBuildInfo",
                tagName: "div",
                template: "fullBuild"
            }
        }
    },
    getModel: function () {
        return this.get("object");
    }
});

window.BuildHistory = Backbone.Model.extend({
    defaults: {
        id: "0",
        object: "",
        options: {
            view: {
                needToUpdate: true,
                className: "history",
                tagName: "tr",
                template: "buildHistory"
            }
        }
    },
    getModel: function () {
        return this.get("object");
    }
});