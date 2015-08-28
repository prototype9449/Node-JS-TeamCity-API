window.ObjectCollectionView = Backbone.View.extend({

    tagName: 'div',

    initialize: function () {
        this.bindEvents(this.model);
    },

    bindEvents: function (model) {
        this.model = model;
        this.model.bind("reset", this.render, this);
        this.model.bind("add", this.add, this);
        this.model.bind("remove", function (model) {
            model.clear();
        });
    },

    add: function (model) {
        var item = new ObjectView({model: model, router: this.options.router});
        $(this.$el).prepend(item.render().el);
    },

    render: function () {
        _.each(this.model.models, function (model) {
            this.add(model);
        }, this);

        return this;
    }
});

window.ObjectView = Backbone.View.extend({

    getAttributes: function () {
        return {
            class: this.model.get('viewOptions')['className']
        };
    },

    _ensureElement: function () {
        if (!this.el) {
            var attrs = this.getAttributes() || {};
            var tagName = this.model.get('viewOptions')['tagName'];
            if (tagName) {
                this.tagName = tagName;
            }
            this.el = this.make(this.tagName, attrs);
        }
    },

    initialize: function () {
        this.bindEvents(this.model);
    },

    bindEvents: function (model) {
        this.model = model;
        this.model.bind("change", this.renderChange, this);
    },

    render: function () {
        var html = this.model.get('body');
        $(this.el).html(html);

        return this;
    },

    renderChange: function () {
        var html = this.model.get('body');
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