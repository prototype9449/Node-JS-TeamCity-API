window.AgentPageView = Backbone.View.extend({

    tagName: "div",

    initialize: function () {
        console.log('AgentPageView has been created');
        this.template = _.template(tpl.get('fullAgentInfo'));

        this.agentView = {};
        this.buildHistoryView = {};
    },

    render: function () {
        $(this.el).html(this.template());

        this.agentView = new ObjectView({model: this.model.agent, router: this.options.router});
        this.$('#agent-info').html(this.agentView.render().el);
        this.agentView.delegateEvents();

        this.buildHistoryView = new ObjectCollectionView({model: this.model.buildList, router: this.options.router});
        this.buildHistoryView.$el = this.$('#history-table-panel');
        this.buildHistoryView.render();

        return this;
    }
});
