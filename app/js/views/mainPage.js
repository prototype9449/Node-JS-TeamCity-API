window.MainPageView = Backbone.View.extend({

    tagName: 'div',

    initialize: function () {
        console.log('MainPageView has been created');
        this.template = _.template(tpl.get('mainPage'));
        this.agentListView = new ObjectListView({router: this.options.router});
        this.buildListView = new ObjectListView({router: this.options.router});
    },

    render: function () {
        var renderPanel = function (view, model) {
            view.bind(model);
            view.render();
            view.delegateEvents();
        };
        $(this.el).html(this.template());

        this.agentListView.$el = this.$('#agents-panel');
        renderPanel(this.agentListView, this.model.agentList);

        this.buildListView.$el = this.$('#builds-panel');
        renderPanel(this.buildListView, this.model.buildList);

        return this;
    }
});
