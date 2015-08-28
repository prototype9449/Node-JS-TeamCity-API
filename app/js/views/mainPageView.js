window.MainPageView = Backbone.View.extend({

    tagName: 'div',

    initialize: function () {
        console.log('MainPageView has been created');
        this.template = _.template(tpl.get('mainPage'));
        this.agentListView = {};
        this.buildListView = {};
    },

    render: function () {

        $(this.el).html(this.template());

        this.agentListView = new ObjectCollectionView({model: this.model.agentList, router: this.options.router});
        this.agentListView.$el = this.$('#agents-panel');
        this.agentListView.render();

        this.buildListView = new ObjectCollectionView({model: this.model.buildList, router: this.options.router});
        this.buildListView.$el = this.$('#builds-panel');
        this.buildListView.render();

        return this;
    }
});
