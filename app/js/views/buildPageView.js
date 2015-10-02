
window.BuildPageView = Backbone.View.extend({

    tagName: "div",

    initialize: function () {
        console.log('BuildMainView has been created');
        this.template = _.template(tpl.get('buildsInfoPage'));

        this.buildView = {};
        this.buildHistoryView ={};
    },

    render: function () {

        $(this.el).html(this.template());

        this.buildView = new ObjectView({model : this.model.build});
        this.$('#build-info').html(this.buildView.render().el);
        this.buildView.delegateEvents();

        this.buildHistoryView =new ObjectCollectionView({model: this.model.buildList});
        this.buildHistoryView.$el = this.$('#history-table-panel');
        this.buildHistoryView.render();

        return this;
    }
});
