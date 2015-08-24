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
            class: this.model.get('viewOptions')['className']
        };
    },

    _ensureElement: function () {
        if (!this.el) {
            var attrs = this.attributes() || {};
            var tagName = this.model.get('viewOptions')['tagName'];
            if(tagName){
                this.tagName = tagName;
            }
            this.el = this.make(this.tagName, attrs);
        }
        //else if (_.isString(this.el)) {
        //    this.el = $(this.el).get(0);
        //}
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

    renderChange: function () {
        var html = this.model.get('body');
        if (html) {
            $(this.el).fadeOut(300);
            $(this.el).html(html);
            $(this.el).fadeIn(300);
        }
        else {
            var self = $(this.el);
            $(this.el).fadeOut(500, function(){ self.remove(); });
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