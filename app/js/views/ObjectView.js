window.ObjectView = Backbone.View.extend({

    getAttributes: function () {
        return {
            class: this.model.get('options')['className']
        };
    },

    _ensureElement: function () {
        if (!this.el) {
            var attrs = this.getAttributes() || {};
            var tagName = this.model.get('options')["view"]['tagName'];
            if (tagName) {
                this.tagName = tagName;
            }
            this.el = this.make(this.tagName, attrs);
        }
    },

    initialize: function () {
        var templateName = this.model.get("options")["view"]["template"];
        var template = tpl.get(templateName);
        this.template = _.template(template);
        this.bindEvents(this.model);
    },

    bindEvents: function (model) {
        this.model = model;
        this.model.bind("change", this.renderChange, this);
    },

    render: function () {

        var model = this.model.get("object");
        var html = "";
        if (model)
            html = this.template(model);

        $(this.el).html(html);

        return this;
    },

    renderChange: function () {
        var html = this.template(this.model.get("object"));
        if (html) {
            $(this.el).fadeOut(300);
            $(this.el).html(html);
            $(this.el).fadeIn(300);
        }
        else {
            var self = $(this.el);
            $(this.el).fadeOut(500, function () {
                self.remove();
            });
        }

        return this;
    }

    //events: {
    //    "click a": "info"
    //},
    //
    //info: function () {
    //    var path = this.model.get("pathPart") + this.model.get("id");
    //    this.options.router.navigate(path, true);
    //    return false;
    //}
});