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
        this.model.bind("destroy", this.renderDestroy, this);
    },

    render: function () {
        var model = this.model.getModel();
        var html = "";
        if (model)
            html = this.template(model);

        $(this.el)
            .fadeOut(300)
            .html(html)
            .fadeIn(300);

        return this;
    },

    renderChange: function () {
        var needToUpdate = this.model.get('options')["view"]['needToUpdate'];
        var model = this.model.getModel();
        var html = this.template(model);
        if (!html)  return this;

        if (needToUpdate) {
            $(this.el)
                .fadeOut(300)
                .html(html)
                .fadeIn(300);
        }
        else {
            $(this.el).html(html);
        }

        return this;
    },

    renderDestroy: function () {
        $(this.el).remove();

        return this;
    }
});