window.ObjectListView = Backbone.View.extend({

    tagName: 'div',

    initialize: function () {
        if (this.model)
            this.bind(this.model);
    },

    bind: function (model) {
        this.model = model;
        this.model.bind("reset", this.render, this);
        var self = this;
        this.model.bind("add", function (model) {
            var item = new ObjectListItemView({model: model, router: self.options.router});
            $(self.$el).prepend(item.render().el);
            item.show();
        });

        this.model.bind("remove", function (model) {
            model.clear();
        });
    },

    render: function () {
        _.each(this.model.models, function (model) {
            $(this.$el).prepend(new ObjectListItemView({model: model, router: this.options.router}).render().el);
        }, this);

        return this;
    }
});

window.ObjectListItemView = Backbone.View.extend({

    attributes: function () {
        return {
            tagName: this.model.get('viewOptions')['tagName'],
            id: this.model.get('viewOptions')['blockId'],
            className: this.model.get('viewOptions')['className']
        };
    },

    _ensureElement: function () {
        if (!this.el) {
            var attrs = this.attributes() || {};
            if (this.id) attrs.id = this.id;
            if (this.className) {
                attrs['class'] = this.className;
            }
            else{
                attrs['class'] = attrs.className;
            }
            if(attrs.tagName)
            {
                this.tagName = attrs.tagName;
            }
            this.el = this.make(this.tagName, attrs);
        }
        else if (_.isString(this.el)) {
            this.el = $(this.el).get(0);
        }
    },

    initialize: function () {
        if (this.model)
            this.bind(this.model);
    },

    bind: function (model) {
        this.model = model;
        this.model.bind("change", this.renderChange, this);
    },

    render: function () {
        var html = this.model.get('body');
        $(this.el).html(html);

        return this;
    },

    show: function () {
        $(this.el).slideUp(0).css("visibility", "visible").slideDown(500);
    },

    renderChange: function () {
        var html = this.model.get('body');
        if (html) {
            $(this.el).fadeOut(500);
            $(this.el).html(html);
            $(this.el).fadeIn(500);
        }
        else {
            $(this.el).delay(500).fadeOut(500);
            var self = $(this.el);

            setTimeout(function () {
                self.remove()
            }, 1000);
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