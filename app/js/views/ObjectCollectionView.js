window.ObjectCollectionView = Backbone.View.extend({

    tagName: 'div',

    initialize: function () {
        this.bindEvents(this.model);
    },

    bindEvents: function (model) {
        this.model = model;
        this.model.bind("reset", this.render, this);
        this.model.bind("add", this.renderAdd, this);
        this.model.bind("remove", function (model) {
            model.trigger('destroy');
        });
    },

    renderAdd: function (model) {
        if (this.panel)
            this.panel.show();
        var item;
        if (this.objectViewProvider)
            item = new this.objectViewProvider({model: model, router: this.options.router});
        else
            item = new ObjectView({model: model, router: this.options.router});

        $(this.$el).prepend(item.render().el);
    },

    render: function () {
        _.each(this.model.models, function (model) {
            this.add(model);
        }, this);

        return this;
    }
});