window.MainPageView = Backbone.View.extend({

    tagName: 'div',

    initialize: function () {
        console.log('MainPageView has been created');
        this.template = _.template(tpl.get('mainPage'));
        this.agentListView = {};
        this.generalBuildListView = {};
        this.additionalBuildListView = {};
    },

    render: function () {

        $(this.el).html(this.template());

        this.agentListView = new ObjectCollectionView({model: this.model.agentList, router: this.options.router});
        this.agentListView.$el = this.$('#agents-panel');
        this.agentListView.render();

        this.generalBuildListView = new ObjectCollectionView({model: this.model.generalBuildList, router: this.options.router});
        this.generalBuildListView.$el = this.$('#general-builds-panel');
        this.generalBuildListView.render();

        this.additionalBuildListView = new ObjectCollectionView({model: this.model.additionalBuildList, router: this.options.router});
        this.additionalBuildListView.$el = this.$('#additional-builds-panel');
        this.additionalBuildListView.render();
        this.additionalBuildListView.panel = this.$('#additional-build-panel');
        this.additionalBuildListView.panel.hide();

        return this;
    }
});
