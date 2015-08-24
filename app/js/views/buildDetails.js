window.BuildPageView = Backbone.View.extend({

    tagName: "div",

    initialize: function () {
        console.log('BuildMainView has been created');
        this.template = _.template(tpl.get('fullBuildsInfo'));

        this.buildView = {};
        this.buildHistoryView ={};
    },

    render: function () {
        var renderPanel = function (view) {
            view.render();
            view.delegateEvents();
        };
        $(this.el).html(this.template());

        this.buildView = new ObjectListItemView({model : this.model.build, router: this.options.router});
        this.buildViewPanel = this.$('#Build-panel');
        this.buildViewPanel.prepend(this.buildView.render().el);
        this.buildView.delegateEvents();

        this.buildHistoryView =new ObjectListView({model: this.model.buildList,router: this.options.router});
        this.buildHistoryView.$el = this.$('#history-table-panel');
        renderPanel(this.buildHistoryView);

        return this;
    }
});
